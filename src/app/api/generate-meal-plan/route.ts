import { NextRequest, NextResponse } from 'next/server';

// Vercel 配置：延长函数执行时间
export const maxDuration = 30; // 30秒（免费版最多60秒，我们设置保守一些）

export async function POST(request: NextRequest) {
  try {
    const { userProfile, restrictions } = await request.json();
    
    if (!userProfile) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // 构建给豆包的提示词（一次性生成膳食计划和购物清单）
    const prompt = `为${userProfile.age}岁${userProfile.gender}（目标：${userProfile.health_goal}，预算：RM${userProfile.weekly_budget}/周${restrictions && restrictions.length > 0 ? `，限制：${restrictions.join(', ')}` : ''}）生成7天马来西亚膳食计划和购物清单。

要求：
1. 7天膳食计划，每天含早午晚餐
2. 营养均衡，菜品多样，真实马来西亚美食
3. 根据膳食计划生成购物清单（4人份，一周用量，合并相同食材）

返回JSON：
{
  "plan": [
    {"day": "Monday", "meals": {"breakfast": {"name_zh": "椰浆饭", "name_en": "Nasi Lemak"}, "lunch": {"name_zh": "炒粿条", "name_en": "Char Kway Teow"}, "dinner": {"name_zh": "肉骨茶", "name_en": "Bak Kut Teh"}}},
    ...其他6天
  ],
  "shopping_list": [
    {"name": "洋葱", "name_en": "Onion", "category": "蔬菜", "quantity": 800, "unit": "g", "price": 4.8},
    ...其他食材
  ]
}`;

    console.log('📤 Calling Doubao API for meal plan generation...');
    
    // 检查豆包配置
    if (!process.env.DOUBAO_API_ENDPOINT || !process.env.DOUBAO_API_KEY) {
      console.error('❌ Doubao API not configured!');
      return NextResponse.json(
        { 
          error: 'AI API not configured',
          message: '豆包 API 未配置。请在 .env.local 中设置 DOUBAO_API_ENDPOINT 和 DOUBAO_API_KEY'
        },
        { status: 500 }
      );
    }
    
    console.log('🔧 Using Doubao endpoint:', process.env.DOUBAO_API_ENDPOINT);
    console.log('🔧 Using model:', process.env.DOUBAO_MODEL);
    
    // 调用豆包API，设置超时
    let response;
    let useFallback = false;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25秒超时（给 Vercel 5秒缓冲）
      
      response = await fetch(process.env.DOUBAO_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DOUBAO_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.DOUBAO_MODEL || 'doubao-seed-1-6-lite-251015',
          messages: [
            {
              role: 'system',
              content: '你是营养师。只返回JSON，无需解释。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500, // 增加到 1500，因为现在要同时生成膳食计划和购物清单
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      console.error('❌ Network error calling Doubao:', fetchError);
      
      // 检查是否是超时错误
      if (fetchError.name === 'AbortError') {
        console.log('⏱️ Doubao API 超时，使用本地算法生成膳食计划');
        useFallback = true;
      } else {
        console.log('⚠️ Doubao API 调用失败，使用本地算法生成膳食计划');
        useFallback = true;
      }
    }
    
    // 如果没有错误且响应成功，尝试解析
    if (!useFallback && response && response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      
      console.log('📥 Received response from Doubao');
      
      // 解析JSON响应
      try {
        let result;
        let jsonString = '';
        
        // 尝试多种方式提取JSON
        if (content.includes('```json')) {
          const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonString = jsonMatch[1];
          }
        } else if (content.includes('```')) {
          const codeMatch = content.match(/```\s*([\s\S]*?)\s*```/);
          if (codeMatch) {
            jsonString = codeMatch[1];
          }
        } else {
          const jsonMatch = content.match(/\{[\s\S]*"plan"[\s\S]*\}/);
          if (jsonMatch) {
            jsonString = jsonMatch[0];
          } else {
            jsonString = content;
          }
        }
        
        // 清理 JSON 字符串：移除 trailing commas
        jsonString = jsonString.replace(/,(\s*[\]}])/g, '$1');
        
        // 解析清理后的 JSON
        result = JSON.parse(jsonString);
        
        if (!result || !result.plan) {
          throw new Error('No valid meal plan found in response');
        }
        
        console.log('✅ Successfully parsed meal plan with', result.plan.length, 'days');
        
        // 检查是否包含购物清单
        if (result.shopping_list && result.shopping_list.length > 0) {
          console.log('✅ Shopping list also included:', result.shopping_list.length, 'items');
        }
        
        return NextResponse.json(result);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('Content preview:', content.substring(0, 500));
        console.log('⚠️ AI 响应解析失败，使用本地算法生成膳食计划');
        useFallback = true;
      }
    } else if (!useFallback && response && !response.ok) {
      const errorText = await response.text();
      console.error('❌ Doubao API error:', response.status, errorText);
      console.log('⚠️ AI 返回错误，使用本地算法生成膳食计划');
      useFallback = true;
    }
    
    // 如果需要使用 fallback，返回简单的膳食计划和购物清单
    if (useFallback) {
      console.log('🔄 Using local fallback algorithm');
      return NextResponse.json({
        plan: generateFallbackMealPlan(),
        shopping_list: generateFallbackShoppingList()
      });
    }
  } catch (error: any) {
    console.error('❌ Meal plan generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// 本地 fallback 算法
function generateFallbackMealPlan() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = {
    breakfast: [
      { name_zh: '椰浆饭', name_en: 'Nasi Lemak' },
      { name_zh: '印度煎饼', name_en: 'Roti Canai' },
      { name_zh: '海南咖啡吐司', name_en: 'Kaya Toast' },
    ],
    lunch: [
      { name_zh: '炒粿条', name_en: 'Char Kway Teow' },
      { name_zh: '福建炒面', name_en: 'Hokkien Mee' },
      { name_zh: '椰浆饭', name_en: 'Nasi Lemak' },
    ],
    dinner: [
      { name_zh: '肉骨茶', name_en: 'Bak Kut Teh' },
      { name_zh: '咖喱叻沙', name_en: 'Curry Laksa' },
      { name_zh: '沙爹', name_en: 'Satay' },
    ],
  };
  
  return days.map((day, i) => ({
    day,
    meals: {
      breakfast: meals.breakfast[i % 3],
      lunch: meals.lunch[i % 3],
      dinner: meals.dinner[i % 3],
    }
  }));
}

// 生成基础购物清单（fallback）
function generateFallbackShoppingList() {
  return [
    { name: '大米', name_en: 'Rice', category: '主食', quantity: 3000, unit: 'g', price: 12.0 },
    { name: '鸡肉', name_en: 'Chicken', category: '肉类', quantity: 1500, unit: 'g', price: 18.0 },
    { name: '洋葱', name_en: 'Onion', category: '蔬菜', quantity: 800, unit: 'g', price: 4.8 },
    { name: '大蒜', name_en: 'Garlic', category: '蔬菜', quantity: 200, unit: 'g', price: 2.5 },
    { name: '辣椒', name_en: 'Chili', category: '蔬菜', quantity: 300, unit: 'g', price: 3.0 },
    { name: '椰浆', name_en: 'Coconut Milk', category: '调味料', quantity: 400, unit: 'ml', price: 5.5 },
    { name: '酱油', name_en: 'Soy Sauce', category: '调味料', quantity: 250, unit: 'ml', price: 4.0 },
    { name: '鸡蛋', name_en: 'Eggs', category: '其他', quantity: 12, unit: '个', price: 6.0 },
  ];
}

