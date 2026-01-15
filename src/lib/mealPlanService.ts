import { createBrowserClient } from './supabase';

// 获取Supabase客户端
const getClient = () => {
  const client = createBrowserClient();
  if (!client) {
    throw new Error('无法创建Supabase客户端');
  }
  return client;
};

/**
 * 生成膳食计划（从数据库选择菜品，带随机性）
 */
export async function generateMealPlanFromDatabase(params: {
  days: number;
  peopleCount: number;
  dietary_restrictions?: string[];
  preferences?: string[];
}) {
  const client = getClient();

  const { days, peopleCount, dietary_restrictions = [], preferences = [] } = params;

  // 每天需要：1早餐 + 1午餐 + 1晚餐
  const breakfastNeeded = days;
  const lunchNeeded = days;
  const dinnerNeeded = days;

  // 查询菜品，带筛选和随机性
  const queryRecipes = async (mealType: string, count: number) => {
    let query = client
      .from('recipes')
      .select('*')
      .eq('meal_type', mealType);

    // 如果有dietary_restrictions，需要排除
    if (dietary_restrictions.length > 0) {
      // PostgreSQL数组操作：排除包含任何限制标签的菜品
      for (const restriction of dietary_restrictions) {
        query = query.not('dietary_restrictions', 'cs', `{${restriction}}`);
      }
    }

    // 如果有preferences，优先选择包含这些标签的菜品
    // 但为了简化，这里仅排除dietary_restrictions
    // TODO: 可以添加评分逻辑，优先选择符合preferences的菜品

    // 添加随机排序并限制数量
    // Supabase/PostgreSQL没有直接的RANDOM()排序，使用order by随机列
    const { data, error } = await query.limit(count * 3); // 多取一些用于随机选择

    if (error) {
      console.error('查询菜品出错:', error);
      throw new Error('查询菜品失败');
    }

    // 在客户端进行随机打乱
    const shuffled = (data || []).sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  try {
    // 并行查询三种meal_type
    const [breakfasts, lunches, dinners] = await Promise.all([
      queryRecipes('breakfast', breakfastNeeded),
      queryRecipes('lunch', lunchNeeded),
      queryRecipes('dinner', dinnerNeeded),
    ]);

    // 构建膳食计划
    const mealPlan = [];
    for (let i = 0; i < days; i++) {
      const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i % 7];
      mealPlan.push({
        day: dayName,
        meals: {
          breakfast: breakfasts[i] || null,
          lunch: lunches[i] || null,
          dinner: dinners[i] || null,
        },
      });
    }

    return mealPlan;
  } catch (err) {
    console.error('生成膳食计划失败:', err);
    throw err;
  }
}

/**
 * 根据膳食计划生成购物清单（从数据库查询食材）
 */
export async function generateShoppingListFromDatabase(mealPlan: any[], peopleCount: number) {
  const client = getClient();

  // 收集所有菜品ID
  const recipeIds: number[] = [];
  for (const day of mealPlan) {
    if (day.meals.breakfast) recipeIds.push(day.meals.breakfast.id);
    if (day.meals.lunch) recipeIds.push(day.meals.lunch.id);
    if (day.meals.dinner) recipeIds.push(day.meals.dinner.id);
  }

  if (recipeIds.length === 0) {
    return [];
  }

  // 查询所有相关的 recipe_ingredients 和 ingredients
  const { data: recipeIngredients, error } = await client
    .from('recipe_ingredients')
    .select(`
      recipe_id,
      ingredient_id,
      quantity,
      unit,
      is_optional,
      ingredients (
        id,
        name_zh,
        name_en,
        name_ms,
        category,
        unit,
        avg_price_rm,
        allergens
      )
    `)
    .in('recipe_id', recipeIds);

  if (error) {
    console.error('查询食材关联失败:', error);
    throw new Error('查询食材失败');
  }

  // 汇总食材（合并相同食材，数量相加）
  const ingredientMap = new Map<number, any>();

  for (const ri of recipeIngredients || []) {
    const ingredient = (ri as any).ingredients;
    if (!ingredient) continue;

    const ingredientId = ingredient.id;
    const quantity = ri.quantity * peopleCount; // 根据人数调整

    if (ingredientMap.has(ingredientId)) {
      const existing = ingredientMap.get(ingredientId);
      existing.quantity += quantity;
    } else {
      ingredientMap.set(ingredientId, {
        ingredient_id: ingredientId,
        name: ingredient.name_zh,
        name_en: ingredient.name_en,
        name_ms: ingredient.name_ms,
        category: ingredient.category,
        quantity: quantity,
        unit: ri.unit || ingredient.unit,
        estimated_price: ingredient.avg_price_rm * quantity,
        is_optional: ri.is_optional,
        allergens: ingredient.allergens || [],
      });
    }
  }

  // 转换为数组
  const shoppingList = Array.from(ingredientMap.values());

  // 按类别分组并排序
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

  return shoppingList;
}

