/**
 * 膳食计划生成 API v3.0
 * 
 * 功能：
 * 1. 根据用户画像从 Supabase 筛选菜品
 * 2. 生成 7 天 21 餐计划
 * 3. 严格匹配饮食限制
 * 4. 每天热量偏差控制在 ±10%
 * 5. 同一菜品最多出现 2 次
 * 6. 总预算控制
 * 7. 汇总购物清单
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  type UserProfile,
  type DietaryRestriction,
  type Dish,
  type Ingredient,
  type MealType,
  generateMealPlan,
} from '@/lib/meal-generator';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// ==================== 数据库查询 ====================

interface RawRecipe {
  id: string;
  name_en: string;
  name_ms: string;
  name_zh: string | null;
  description: string | null;
  cuisine_type: string | null;
  meal_type: string[] | string | null;
  prep_time: number | null;
  cook_time: number | null;
  servings: number;
  difficulty: string | null;
  estimated_cost: number | null;
  is_halal: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  contains_nuts: boolean;
  contains_seafood: boolean;
  is_diabetic_friendly: boolean;
  nutrition?: {
    calories: number | null;
    protein: number | null;
    carbohydrates: number | null;
    fat: number | null;
    fiber: number | null;
    sugar: number | null;
  }[];
}

interface RawIngredient {
  recipe_id: string;
  quantity: number;
  unit: string;
  ingredients: {
    id: string;
    name_zh: string | null;
    name_en: string;
    name_ms: string;
    category: string | null;
    unit: string | null;
    avg_price_per_unit: number | null;
  };
}

/**
 * 从数据库加载所有菜品及其食材
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadDishesFromDatabase(supabase: any): Promise<Dish[]> {
  // 1. 查询所有菜品和营养信息
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select(`
      id,
      name_en,
      name_ms,
      name_zh,
      description,
      cuisine_type,
      meal_type,
      prep_time,
      cook_time,
      servings,
      difficulty,
      estimated_cost,
      is_halal,
      is_vegetarian,
      is_vegan,
      is_gluten_free,
      is_dairy_free,
      contains_nuts,
      contains_seafood,
      is_diabetic_friendly,
      nutrition:recipe_nutrition(
        calories,
        protein,
        carbohydrates,
        fat,
        fiber,
        sugar
      )
    `) as { data: RawRecipe[] | null; error: Error | null };

  if (recipesError || !recipes) {
    console.error('❌ 查询菜品失败:', recipesError);
    throw new Error('查询菜品失败');
  }

  // 2. 查询所有菜品的食材关联
  const { data: recipeIngredients, error: ingredientsError } = await supabase
    .from('recipe_ingredients')
    .select(`
      recipe_id,
      quantity,
      unit,
      ingredients(
        id,
        name_zh,
        name_en,
        name_ms,
        category,
        unit,
        avg_price_per_unit
      )
    `) as { data: RawIngredient[] | null; error: Error | null };

  if (ingredientsError) {
    console.error('⚠️ 查询食材关联失败:', ingredientsError);
    // 食材查询失败不影响主流程，只是购物清单会为空
  }

  // 3. 构建食材映射 (recipe_id -> ingredients[])
  const ingredientsByRecipe = new Map<string, Ingredient[]>();
  if (recipeIngredients) {
    for (const ri of recipeIngredients) {
      if (!ri.ingredients) continue;
      
      const ingredient: Ingredient = {
        id: ri.ingredients.id,
        name_zh: ri.ingredients.name_zh || ri.ingredients.name_en,
        name_en: ri.ingredients.name_en,
        name_ms: ri.ingredients.name_ms,
        category: ri.ingredients.category || '其他',
        unit: ri.unit || ri.ingredients.unit || 'g',
        avg_price_per_unit: ri.ingredients.avg_price_per_unit || 0,
        quantity: ri.quantity || 0,
      };

      const existing = ingredientsByRecipe.get(ri.recipe_id) || [];
      existing.push(ingredient);
      ingredientsByRecipe.set(ri.recipe_id, existing);
    }
  }

  // 4. 转换为 Dish 类型
  const dishes: Dish[] = recipes.map(recipe => {
    // 处理 meal_type 字段（可能是数组或字符串）
    let mealTypes: MealType[] = [];
    if (Array.isArray(recipe.meal_type)) {
      mealTypes = recipe.meal_type.filter(t => 
        ['breakfast', 'lunch', 'dinner', 'snack'].includes(t)
      ) as MealType[];
    } else if (typeof recipe.meal_type === 'string') {
      if (['breakfast', 'lunch', 'dinner', 'snack'].includes(recipe.meal_type)) {
        mealTypes = [recipe.meal_type as MealType];
      }
    }

    // 提取营养信息
    const nutritionData = recipe.nutrition?.[0];

    return {
      id: recipe.id,
      name_zh: recipe.name_zh || recipe.name_en,
      name_en: recipe.name_en,
      name_ms: recipe.name_ms,
      description: recipe.description || '',
      cuisine_type: recipe.cuisine_type || 'mixed',
      meal_type: mealTypes,
      prep_time: recipe.prep_time || 0,
      cook_time: recipe.cook_time || 0,
      servings: recipe.servings || 1,
      difficulty: recipe.difficulty || 'medium',
      estimated_cost: recipe.estimated_cost || 0,
      is_halal: recipe.is_halal ?? true,
      is_vegetarian: recipe.is_vegetarian ?? false,
      is_vegan: recipe.is_vegan ?? false,
      is_gluten_free: recipe.is_gluten_free ?? false,
      is_dairy_free: recipe.is_dairy_free ?? false,
      contains_nuts: recipe.contains_nuts ?? false,
      contains_seafood: recipe.contains_seafood ?? false,
      is_diabetic_friendly: recipe.is_diabetic_friendly ?? false,
      nutrition: nutritionData ? {
        calories: nutritionData.calories || 0,
        protein: nutritionData.protein || 0,
        carbohydrates: nutritionData.carbohydrates || 0,
        fat: nutritionData.fat || 0,
        fiber: nutritionData.fiber,
        sugar: nutritionData.sugar,
      } : undefined,
      ingredients: ingredientsByRecipe.get(recipe.id) || [],
    };
  });

  return dishes;
}

// ==================== API 处理 ====================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userProfile: rawProfile,
      restrictions = [],
      days = 7,
      peopleCount = 2,
      weeklyBudget,
    } = body;

    console.log('🚀 === 膳食计划 API v3.0 ===');
    console.log('📦 请求参数:', { days, peopleCount, restrictions, weeklyBudget });

    // 验证 Supabase 配置
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase 配置缺失' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. 加载所有菜品
    const allDishes = await loadDishesFromDatabase(supabase);
    console.log(`✅ 加载了 ${allDishes.length} 道菜品`);

    if (allDishes.length === 0) {
      return NextResponse.json(
        { error: '数据库中没有菜品数据，请先执行 seed-recipes.sql' },
        { status: 404 }
      );
    }

    // 2. 构建用户画像
    const profile: UserProfile = {
      age: rawProfile?.age || 30,
      gender: rawProfile?.gender || 'male',
      weight: rawProfile?.weight || 70,
      height: rawProfile?.height || 170,
      activityLevel: rawProfile?.activity_level || 'moderately_active',
      healthGoal: rawProfile?.health_goal || 'maintain',
      weeklyBudget: weeklyBudget || rawProfile?.weekly_budget || 250,
      peopleCount: peopleCount,
    };

    // 3. 转换饮食限制
    const dietaryRestrictions: DietaryRestriction[] = restrictions.map((r: string) => {
      const normalized = r.toLowerCase().replace(/[^a-z_]/g, '');
      return normalized as DietaryRestriction;
    });

    console.log(`👤 用户画像:`, profile);
    console.log(`🚫 饮食限制:`, dietaryRestrictions);

    // 4. 生成膳食计划
    const result = generateMealPlan(allDishes, profile, dietaryRestrictions);

    // 5. 转换为前端期望的格式
    const planForFrontend = result.plan.map(day => ({
      day: day.day,
        meals: {
        breakfast: day.breakfast ? {
          id: day.breakfast.id,
          name_zh: day.breakfast.name_zh,
          name_en: day.breakfast.name_en,
          name_ms: day.breakfast.name_ms,
          description: day.breakfast.description,
          prep_time: day.breakfast.prep_time,
          cook_time: day.breakfast.cook_time,
          calories: day.breakfast.nutrition?.calories || 0,
          cuisine_type: day.breakfast.cuisine_type,
          estimated_cost: day.breakfast.estimated_cost,
          } : null,
        lunch: day.lunch ? {
          id: day.lunch.id,
          name_zh: day.lunch.name_zh,
          name_en: day.lunch.name_en,
          name_ms: day.lunch.name_ms,
          description: day.lunch.description,
          prep_time: day.lunch.prep_time,
          cook_time: day.lunch.cook_time,
          calories: day.lunch.nutrition?.calories || 0,
          cuisine_type: day.lunch.cuisine_type,
          estimated_cost: day.lunch.estimated_cost,
          } : null,
        dinner: day.dinner ? {
          id: day.dinner.id,
          name_zh: day.dinner.name_zh,
          name_en: day.dinner.name_en,
          name_ms: day.dinner.name_ms,
          description: day.dinner.description,
          prep_time: day.dinner.prep_time,
          cook_time: day.dinner.cook_time,
          calories: day.dinner.nutrition?.calories || 0,
          cuisine_type: day.dinner.cuisine_type,
          estimated_cost: day.dinner.estimated_cost,
          } : null,
        },
    }));

    // 6. 转换购物清单格式
    const shoppingListForFrontend = result.shoppingList.map(item => ({
      ingredient_id: null, // 兼容旧格式
      name: item.name,
      name_en: item.name_en,
      name_ms: item.name_ms,
      category: item.category,
      quantity: item.totalQuantity,
      unit: item.unit,
      estimated_price: item.totalPrice,
    }));

    console.log(`✅ 生成完成: ${result.summary.totalDishes} 餐, ${result.summary.uniqueDishes} 道不同菜品`);
    console.log(`📊 热量: ${result.summary.avgDailyCalories} kcal/天, 偏差: ${result.summary.calorieDeviation.toFixed(1)}%`);
    console.log(`💰 总花费: RM${result.summary.totalCost.toFixed(2)} / RM${result.summary.weeklyBudget.toFixed(2)}`);

    return NextResponse.json({
      plan: planForFrontend,
      shopping_list: shoppingListForFrontend,
      summary: {
        total_items: shoppingListForFrontend.length,
        total_cost: result.summary.totalCost,
        weekly_budget: result.summary.weeklyBudget,
        is_within_budget: result.summary.isWithinBudget,
        people_count: peopleCount,
        days: days,
        // 新增统计信息
        total_calories: result.summary.totalCalories,
        avg_daily_calories: result.summary.avgDailyCalories,
        target_daily_calories: result.summary.targetDailyCalories,
        calorie_deviation: result.summary.calorieDeviation,
        total_dishes: result.summary.totalDishes,
        unique_dishes: result.summary.uniqueDishes,
      },
      debug: result.debug,
    });

  } catch (error: unknown) {
    console.error('❌ 生成膳食计划错误:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json(
      { error: '生成膳食计划失败', details: errorMessage },
      { status: 500 }
    );
  }
}
