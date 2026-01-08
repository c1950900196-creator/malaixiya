import { NextRequest, NextResponse } from 'next/server';

// Vercel 配置：延长函数执行时间
export const maxDuration = 60; // 60秒（支持流式输出）

// Helper function to clean JSON string by removing trailing commas
function cleanJsonString(jsonString: string): string {
  return jsonString.replace(/,(\s*[\]}])/g, '$1');
}

export async function POST(request: NextRequest) {
  try {
    const { userProfile, restrictions } = await request.json();
    
    if (!userProfile) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // 构建给豆包的提示词（简化版但完整）
    const prompt = `为${userProfile.age}岁${userProfile.gender}（目标：${userProfile.health_goal}${restrictions && restrictions.length > 0 ? `，限制：${restrictions.join('、')}` : ''}）生成7天马来西亚膳食计划和购物清单。

返回JSON（紧凑格式）：
{"plan":[{"day":"Monday","meals":{"breakfast":{"name_zh":"椰浆饭","name_en":"Nasi Lemak"},"lunch":{"name_zh":"炒粿条","name_en":"Char Kway Teow"},"dinner":{"name_zh":"肉骨茶","name_en":"Bak Kut Teh"}}},...6天],"shopping_list":[{"name":"大米","name_en":"Rice","category":"主食","quantity":3000,"unit":"g","price":12},...其他]}`;

    console.log('📤 Calling Doubao API for meal plan generation...');
    console.log('🔧 Prompt length:', prompt.length, 'characters');
    
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
    
    // 调用豆包API，使用流式输出
    let response;
    let useFallback = false;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45秒超时（流式输出需要更多时间）
      
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
              content: '你是营养师。只返回JSON，无需解释，无需markdown。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500, // 增加到 1500（需要生成膳食计划和购物清单）
          stream: true, // 启用流式输出
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // 处理流式响应
      if (response.ok && response.body) {
        console.log('📡 Receiving streaming response from Doubao...');
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                fullContent += content;
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
        
        console.log('✅ Stream complete, received', fullContent.length, 'characters');
        
        // 解析完整的 JSON 响应
        try {
          let jsonString = '';
          
          // 尝试多种方式提取JSON
          if (fullContent.includes('```json')) {
            const jsonMatch = fullContent.match(/```json\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
              jsonString = jsonMatch[1];
            }
          } else if (fullContent.includes('```')) {
            const codeMatch = fullContent.match(/```\s*([\s\S]*?)\s*```/);
            if (codeMatch) {
              jsonString = codeMatch[1];
            }
          } else {
            const jsonMatch = fullContent.match(/\{[\s\S]*"plan"[\s\S]*\}/);
            if (jsonMatch) {
              jsonString = jsonMatch[0];
            } else {
              jsonString = fullContent;
            }
          }
          
          // 清理 JSON 字符串：移除 trailing commas
          jsonString = cleanJsonString(jsonString);
          
          // 解析清理后的 JSON
          const result = JSON.parse(jsonString);
          
          if (!result || !result.plan) {
            throw new Error('No valid meal plan found in response');
          }
          
          console.log('✅ Successfully parsed meal plan with', result.plan.length, 'days');
          console.log('🛒 Shopping list items:', result.shopping_list?.length || 0);
          
          return NextResponse.json(result);
        } catch (parseError) {
          console.error('❌ JSON parse error:', parseError);
          console.error('Content preview:', fullContent.substring(0, 500));
          console.log('⚠️ 流式响应解析失败，使用本地算法');
          useFallback = true;
        }
      } else {
        throw new Error('Stream response not available');
      }
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
    { name: '猪肉', name_en: 'Pork', category: '肉类', quantity: 1000, unit: 'g', price: 15.0 },
    { name: '鱼', name_en: 'Fish', category: '肉类', quantity: 800, unit: 'g', price: 20.0 },
    { name: '洋葱', name_en: 'Onion', category: '蔬菜', quantity: 800, unit: 'g', price: 4.8 },
    { name: '大蒜', name_en: 'Garlic', category: '蔬菜', quantity: 200, unit: 'g', price: 2.5 },
    { name: '辣椒', name_en: 'Chili', category: '蔬菜', quantity: 300, unit: 'g', price: 3.0 },
    { name: '青菜', name_en: 'Vegetables', category: '蔬菜', quantity: 1200, unit: 'g', price: 6.0 },
    { name: '椰浆', name_en: 'Coconut Milk', category: '调味料', quantity: 400, unit: 'ml', price: 5.5 },
    { name: '酱油', name_en: 'Soy Sauce', category: '调味料', quantity: 250, unit: 'ml', price: 4.0 },
    { name: '食用油', name_en: 'Cooking Oil', category: '调味料', quantity: 500, unit: 'ml', price: 8.0 },
    { name: '鸡蛋', name_en: 'Eggs', category: '其他', quantity: 12, unit: '个', price: 6.0 },
  ];
}

