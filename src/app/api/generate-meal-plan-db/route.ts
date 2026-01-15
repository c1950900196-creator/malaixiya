import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * 从数据库生成膳食计划 API (不使用豆包AI)
 * 直接从数据库智能选择菜品，带随机性和多样性
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, restrictions, days = 7, peopleCount = 2 } = body;

    console.log('📦 生成膳食计划请求:', { days, peopleCount, restrictions });

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase 配置缺失' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 查询所有可用菜品
    let query = supabase
      .from('recipes')
      .select('*')
      .order('id', { ascending: true });

    // 如果有dietary_restrictions，排除包含这些标签的菜品
    if (restrictions && restrictions.length > 0) {
      // PostgreSQL 数组操作：不包含任何限制标签
      for (const restriction of restrictions) {
        query = query.not('dietary_restrictions', 'cs', `{${restriction}}`);
      }
    }

    const { data: allRecipes, error: recipesError } = await query;

    if (recipesError) {
      console.error('❌ 查询菜品失败:', recipesError);
      return NextResponse.json(
        { error: '查询菜品失败', details: recipesError.message },
        { status: 500 }
      );
    }

    if (!allRecipes || allRecipes.length === 0) {
      return NextResponse.json(
        { error: '数据库中没有可用的菜品' },
        { status: 404 }
      );
    }

    console.log(`✅ 查询到 ${allRecipes.length} 道菜品`);

    // 按 meal_type 分组
    const breakfasts = allRecipes.filter(r => r.meal_type === 'breakfast');
    const lunches = allRecipes.filter(r => r.meal_type === 'lunch');
    const dinners = allRecipes.filter(r => r.meal_type === 'dinner');
    const snacks = allRecipes.filter(r => r.meal_type === 'snack');

    console.log(`早餐: ${breakfasts.length}, 午餐: ${lunches.length}, 晚餐: ${dinners.length}, 小吃: ${snacks.length}`);

    // 随机打乱函数
    const shuffle = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // 生成膳食计划
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealPlan = [];

    // 随机打乱菜品，确保每周多样性
    const shuffledBreakfasts = shuffle(breakfasts);
    const shuffledLunches = shuffle(lunches);
    const shuffledDinners = shuffle(dinners);

    for (let i = 0; i < days; i++) {
      const day = dayNames[i % 7];
      
      // 循环选择，避免重复（如果菜品足够多）
      const breakfast = shuffledBreakfasts[i % shuffledBreakfasts.length];
      const lunch = shuffledLunches[i % shuffledLunches.length];
      const dinner = shuffledDinners[i % shuffledDinners.length];

      mealPlan.push({
        day,
        meals: {
          breakfast: breakfast ? {
            id: breakfast.id,
            name_zh: breakfast.name_zh,
            name_en: breakfast.name_en,
            name_ms: breakfast.name_ms,
            description: breakfast.description,
            prep_time: breakfast.prep_time,
            cook_time: breakfast.cook_time,
            calories: breakfast.calories,
            cuisine_type: breakfast.cuisine_type,
          } : null,
          lunch: lunch ? {
            id: lunch.id,
            name_zh: lunch.name_zh,
            name_en: lunch.name_en,
            name_ms: lunch.name_ms,
            description: lunch.description,
            prep_time: lunch.prep_time,
            cook_time: lunch.cook_time,
            calories: lunch.calories,
            cuisine_type: lunch.cuisine_type,
          } : null,
          dinner: dinner ? {
            id: dinner.id,
            name_zh: dinner.name_zh,
            name_en: dinner.name_en,
            name_ms: dinner.name_ms,
            description: dinner.description,
            prep_time: dinner.prep_time,
            cook_time: dinner.cook_time,
            calories: dinner.calories,
            cuisine_type: dinner.cuisine_type,
          } : null,
        },
      });
    }

    console.log(`✅ 生成了 ${days} 天的膳食计划`);

    // 生成购物清单
    const recipeIds: number[] = [];
    const recipeNames: string[] = [];
    for (const day of mealPlan) {
      if (day.meals.breakfast?.id) {
        recipeIds.push(day.meals.breakfast.id);
        recipeNames.push(day.meals.breakfast.name_zh);
      }
      if (day.meals.lunch?.id) {
        recipeIds.push(day.meals.lunch.id);
        recipeNames.push(day.meals.lunch.name_zh);
      }
      if (day.meals.dinner?.id) {
        recipeIds.push(day.meals.dinner.id);
        recipeNames.push(day.meals.dinner.name_zh);
      }
    }

    console.log('🔍 生成的菜品 IDs:', recipeIds);
    console.log('🔍 生成的菜品名称:', recipeNames);

    let shoppingList: any[] = [];

    if (recipeIds.length > 0) {
      const { data: recipeIngredients, error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .select(`
          recipe_id,
          ingredient_id,
          quantity,
          unit,
          ingredients (
            id,
            name_zh,
            name_en,
            name_ms,
            category,
            unit,
            avg_price_per_unit,
            allergens
          )
        `)
        .in('recipe_id', recipeIds);

      if (ingredientsError) {
        console.error('⚠️ 查询食材失败:', ingredientsError);
        return NextResponse.json(
          { error: '查询食材关联失败', details: ingredientsError.message },
          { status: 500 }
        );
      }
      
      console.log(`🔍 查询到 ${recipeIngredients?.length || 0} 个食材关联`);
      
      if (!recipeIngredients || recipeIngredients.length === 0) {
        console.error('❌ 没有找到任何食材关联');
        console.error('📋 当前生成的菜品:', recipeNames);
        return NextResponse.json(
          { 
            error: '购物清单生成失败：这些菜品尚未配置食材数据',
            recipes: recipeNames,
            hint: '请在数据库中为这些菜品配置食材关联'
          },
          { status: 404 }
        );
      }

      if (recipeIngredients && recipeIngredients.length > 0) {
        console.log(`✅ 查询到 ${recipeIngredients.length} 个食材关联`);

        // 汇总食材（合并相同食材，数量相加）
        const ingredientMap = new Map<number, any>();

        for (const ri of recipeIngredients) {
          const ingredient = (ri as any).ingredients;
          if (!ingredient) continue;

          const ingredientId = ingredient.id;
          const quantity = ri.quantity * peopleCount;

          if (ingredientMap.has(ingredientId)) {
            const existing = ingredientMap.get(ingredientId);
            existing.quantity += quantity;
            existing.estimated_price = ingredient.avg_price_per_unit * existing.quantity;
          } else {
            ingredientMap.set(ingredientId, {
              ingredient_id: ingredientId,
              name: ingredient.name_zh,
              name_en: ingredient.name_en,
              name_ms: ingredient.name_ms,
              category: ingredient.category,
              quantity: quantity,
              unit: ri.unit || ingredient.unit,
              estimated_price: ingredient.avg_price_per_unit * quantity,
              allergens: ingredient.allergens || [],
            });
          }
        }

        shoppingList = Array.from(ingredientMap.values());

        // 按类别排序
        const categoryOrder: any = {
          '肉类': 1,
          '海鲜': 2,
          '蔬菜': 3,
          '主食': 4,
          '调味料': 5,
          '香料': 6,
          '其他': 99,
        };

        shoppingList.sort((a, b) => {
          const orderA = categoryOrder[a.category] || 50;
          const orderB = categoryOrder[b.category] || 50;
          if (orderA !== orderB) return orderA - orderB;
          return a.name.localeCompare(b.name, 'zh-CN');
        });

        console.log(`✅ 生成了 ${shoppingList.length} 项购物清单`);
      }
    }

    return NextResponse.json({
      plan: mealPlan,
      shopping_list: shoppingList,
    });

  } catch (error: any) {
    console.error('❌ 生成膳食计划错误:', error);
    return NextResponse.json(
      { error: '生成膳食计划失败', details: error.message },
      { status: 500 }
    );
  }
}

