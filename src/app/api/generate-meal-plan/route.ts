import { NextRequest, NextResponse } from 'next/server';

// Vercel 配置：延长函数执行时间
export const maxDuration = 30; // 30秒

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
    
    // 构建给豆包的提示词（优化版：只生成膳食计划，不生成购物清单）
    const prompt = `为${userProfile.age}岁${userProfile.gender}（目标：${userProfile.health_goal}${restrictions && restrictions.length > 0 ? `，限制：${restrictions.join('、')}` : ''}）生成7天马来西亚膳食计划。

要求：每天早午晚餐，使用真实马来西亚美食名称。

返回JSON（只要菜名）：
{"plan":[{"day":"Monday","meals":{"breakfast":{"name_zh":"椰浆饭","name_en":"Nasi Lemak"},"lunch":{"name_zh":"炒粿条","name_en":"Char Kway Teow"},"dinner":{"name_zh":"肉骨茶","name_en":"Bak Kut Teh"}}},{"day":"Tuesday","meals":{...}}]}`;

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
    
    // 调用豆包API，设置超时
    let response;
    let useFallback = false;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时（给 Doubao 充足时间）
      
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
              content: '你是营养师。只返回JSON，无需解释，无需markdown代码块。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 800, // 降低到 800（只生成膳食计划，不含购物清单）
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
      jsonString = cleanJsonString(jsonString);
      
      // 解析清理后的 JSON
      result = JSON.parse(jsonString);
      
      if (!result || !result.plan) {
        throw new Error('No valid meal plan found in response');
      }
      
      console.log('✅ Successfully parsed meal plan with', result.plan.length, 'days');
      
      // 生成购物清单（本地算法）
      const shoppingList = generateShoppingListFromMeals(result.plan);
      console.log('🛒 Generated shopping list with', shoppingList.length, 'items');
      
      return NextResponse.json({
        plan: result.plan,
        shopping_list: shoppingList
      });
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

// 根据膳食计划生成购物清单（基于常见食材）
function generateShoppingListFromMeals(mealPlan: any[]) {
  // 基础食材库（适用于大部分马来西亚菜）
  const baseIngredients = [
    { name: '大米', name_en: 'Rice', category: '主食', quantity: 3500, unit: 'g', price: 14.0 },
    { name: '食用油', name_en: 'Cooking Oil', category: '调味料', quantity: 500, unit: 'ml', price: 8.0 },
    { name: '酱油', name_en: 'Soy Sauce', category: '调味料', quantity: 300, unit: 'ml', price: 5.0 },
    { name: '盐', name_en: 'Salt', category: '调味料', quantity: 200, unit: 'g', price: 2.0 },
    { name: '糖', name_en: 'Sugar', category: '调味料', quantity: 200, unit: 'g', price: 3.0 },
  ];
  
  // 根据菜名关键词推断食材
  const allMeals = mealPlan.flatMap(day => [
    day.meals.breakfast?.name_zh || '',
    day.meals.lunch?.name_zh || '',
    day.meals.dinner?.name_zh || ''
  ]).filter(name => name);
  
  const mealText = allMeals.join('');
  const additionalIngredients: any[] = [];
  
  // 肉类检测
  if (mealText.includes('鸡') || mealText.includes('Chicken')) {
    additionalIngredients.push({ name: '鸡肉', name_en: 'Chicken', category: '肉类', quantity: 2000, unit: 'g', price: 24.0 });
  }
  if (mealText.includes('牛') || mealText.includes('Beef')) {
    additionalIngredients.push({ name: '牛肉', name_en: 'Beef', category: '肉类', quantity: 1500, unit: 'g', price: 35.0 });
  }
  if (mealText.includes('鱼') || mealText.includes('Fish')) {
    additionalIngredients.push({ name: '鱼', name_en: 'Fish', category: '肉类', quantity: 1200, unit: 'g', price: 28.0 });
  }
  if (mealText.includes('虾') || mealText.includes('Prawn') || mealText.includes('Shrimp')) {
    additionalIngredients.push({ name: '虾', name_en: 'Prawns', category: '肉类', quantity: 800, unit: 'g', price: 32.0 });
  }
  if (mealText.includes('猪') || mealText.includes('Pork')) {
    additionalIngredients.push({ name: '猪肉', name_en: 'Pork', category: '肉类', quantity: 1500, unit: 'g', price: 22.0 });
  }
  
  // 蔬菜检测
  if (mealText.includes('椰浆') || mealText.includes('Lemak') || mealText.includes('椰')) {
    additionalIngredients.push({ name: '椰浆', name_en: 'Coconut Milk', category: '调味料', quantity: 600, unit: 'ml', price: 8.0 });
  }
  if (mealText.includes('咖喱') || mealText.includes('Curry')) {
    additionalIngredients.push({ name: '咖喱粉', name_en: 'Curry Powder', category: '调味料', quantity: 100, unit: 'g', price: 6.0 });
  }
  if (mealText.includes('叻沙') || mealText.includes('Laksa')) {
    additionalIngredients.push({ name: '叻沙酱', name_en: 'Laksa Paste', category: '调味料', quantity: 200, unit: 'g', price: 7.0 });
  }
  
  // 通用蔬菜
  additionalIngredients.push(
    { name: '洋葱', name_en: 'Onion', category: '蔬菜', quantity: 1000, unit: 'g', price: 6.0 },
    { name: '大蒜', name_en: 'Garlic', category: '蔬菜', quantity: 300, unit: 'g', price: 4.0 },
    { name: '辣椒', name_en: 'Chili', category: '蔬菜', quantity: 400, unit: 'g', price: 5.0 },
    { name: '番茄', name_en: 'Tomato', category: '蔬菜', quantity: 800, unit: 'g', price: 5.0 },
    { name: '青菜', name_en: 'Vegetables', category: '蔬菜', quantity: 1500, unit: 'g', price: 8.0 }
  );
  
  // 其他
  additionalIngredients.push(
    { name: '鸡蛋', name_en: 'Eggs', category: '其他', quantity: 18, unit: '个', price: 9.0 }
  );
  
  return [...baseIngredients, ...additionalIngredients];
}

