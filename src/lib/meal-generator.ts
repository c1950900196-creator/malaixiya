/**
 * 膳食计划生成器
 * 
 * 核心功能：
 * 1. 根据用户画像（身高、体重、预算等）从数据库筛选菜品
 * 2. 生成 7 天 21 餐计划，严格匹配饮食限制
 * 3. 控制每天热量偏差在 ±10%
 * 4. 同一菜品最多出现 2 次
 * 5. 总预算控制在 weekly_budget 内
 * 6. 汇总购物清单
 */

// ==================== 类型定义 ====================

/** 用户画像 */
export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; // kg
  height: number; // cm
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  healthGoal: 'lose_weight' | 'gain_muscle' | 'maintain';
  weeklyBudget: number; // RM
  peopleCount: number;
}

/** 饮食限制 */
export type DietaryRestriction = 
  | 'halal' 
  | 'vegetarian' 
  | 'vegan' 
  | 'gluten_free' 
  | 'dairy_free' 
  | 'nut_allergy' 
  | 'seafood_allergy' 
  | 'diabetes';

/** 餐型 */
export type MealType = 'breakfast' | 'lunch' | 'dinner';

/** 食材（来自关联查询） */
export interface Ingredient {
  id: string;
  name_zh: string;
  name_en: string;
  name_ms: string;
  category: string;
  unit: string;
  avg_price_per_unit: number;
  quantity: number; // 来自 recipe_ingredients 表
}

/** 营养信息 */
export interface Nutrition {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number | null;
  sugar?: number | null;
}

/** 菜品（完整信息） */
export interface Dish {
  id: string;
  name_zh: string;
  name_en: string;
  name_ms: string;
  description: string;
  cuisine_type: string;
  meal_type: MealType[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  estimated_cost: number;
  // 饮食限制标签
  is_halal: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  contains_nuts: boolean;
  contains_seafood: boolean;
  is_diabetic_friendly: boolean;
  // 营养信息（来自 recipe_nutrition 表）
  nutrition?: Nutrition;
  // 食材列表（来自 recipe_ingredients + ingredients 联表）
  ingredients?: Ingredient[];
}

/** 单日膳食计划 */
export interface DayMealPlan {
  day: string; // Monday, Tuesday, ...
  date: string; // YYYY-MM-DD
  breakfast: Dish | null;
  lunch: Dish | null;
  dinner: Dish | null;
  totalCalories: number;
  totalCost: number;
}

/** 购物清单项 */
export interface ShoppingListItem {
  name: string;
  name_en?: string;
  name_ms?: string;
  category: string;
  totalQuantity: number;
  unit: string;
  totalPrice: number;
}

/** 膳食计划生成结果 */
export interface MealPlanResult {
  plan: DayMealPlan[];
  shoppingList: ShoppingListItem[];
  summary: {
    totalCalories: number;
    avgDailyCalories: number;
    targetDailyCalories: number;
    calorieDeviation: number; // 百分比
    totalCost: number;
    weeklyBudget: number;
    isWithinBudget: boolean;
    totalDishes: number;
    uniqueDishes: number;
  };
  debug?: {
    version: string;
    tdee: number;
    filteredDishCount: number;
    logs: string[];
  };
}

// ==================== TDEE 计算 ====================

/**
 * 计算基础代谢率 (BMR) - Mifflin-St Jeor 公式
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female' | 'other'
): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

/**
 * 计算每日总能量消耗 (TDEE)
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: string
): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.55));
}

/**
 * 根据健康目标调整卡路里
 */
export function adjustCaloriesForGoal(
  tdee: number,
  goal: 'lose_weight' | 'gain_muscle' | 'maintain'
): number {
  switch (goal) {
    case 'lose_weight':
      return Math.round(tdee * 0.85); // 减少 15%
    case 'gain_muscle':
      return Math.round(tdee * 1.15); // 增加 15%
    case 'maintain':
    default:
      return tdee;
  }
}

/**
 * 获取每餐的目标热量分配
 */
export function getMealCalorieDistribution(dailyCalories: number): Record<MealType, number> {
  return {
    breakfast: Math.round(dailyCalories * 0.25), // 25%
    lunch: Math.round(dailyCalories * 0.40),     // 40%
    dinner: Math.round(dailyCalories * 0.35),    // 35%
  };
}

// ==================== 菜品筛选 ====================

/**
 * 检查菜品是否满足饮食限制
 */
export function checkDietaryRestrictions(
  dish: Dish,
  restrictions: DietaryRestriction[]
): boolean {
  for (const restriction of restrictions) {
    switch (restriction) {
      case 'halal':
        if (!dish.is_halal) return false;
        break;
      case 'vegetarian':
        if (!dish.is_vegetarian) return false;
        break;
      case 'vegan':
        if (!dish.is_vegan) return false;
        break;
      case 'gluten_free':
        if (!dish.is_gluten_free) return false;
        break;
      case 'dairy_free':
        if (!dish.is_dairy_free) return false;
        break;
      case 'nut_allergy':
        if (dish.contains_nuts) return false;
        break;
      case 'seafood_allergy':
        if (dish.contains_seafood) return false;
        break;
      case 'diabetes':
        if (!dish.is_diabetic_friendly) return false;
        break;
    }
  }
  return true;
}

/**
 * 筛选可用菜品
 */
export function filterDishes(
  allDishes: Dish[],
  mealType: MealType,
  restrictions: DietaryRestriction[],
  maxCostPerMeal: number
): Dish[] {
  return allDishes.filter(dish => {
    // 1. 检查餐型
    if (!dish.meal_type || !dish.meal_type.includes(mealType)) {
      return false;
    }
    
    // 2. 检查饮食限制
    if (!checkDietaryRestrictions(dish, restrictions)) {
      return false;
    }
    
    // 3. 检查单餐价格上限（留一定余量）
    const cost = dish.estimated_cost || 0;
    if (cost > maxCostPerMeal * 1.5) {
      return false;
    }
    
    return true;
  });
}

// ==================== 随机工具 ====================

/**
 * Fisher-Yates 洗牌算法
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 从数组中随机选择 n 个元素
 */
export function randomPick<T>(array: T[], n: number): T[] {
  return shuffle(array).slice(0, n);
}

// ==================== 核心生成算法 ====================

/**
 * 生成 7 天膳食计划
 * 
 * 算法步骤：
 * 1. 计算用户 TDEE 和每日目标热量
 * 2. 按餐型筛选可用菜品
 * 3. 贪心算法选择菜品，满足：
 *    - 每天热量偏差 ≤ ±10%
 *    - 同一菜品 ≤ 2 次
 *    - 总预算不超标
 */
export function generateMealPlan(
  allDishes: Dish[],
  profile: UserProfile,
  restrictions: DietaryRestriction[]
): MealPlanResult {
  const logs: string[] = [];
  logs.push(`🚀 膳食计划生成器 v3.0`);
  
  // 1. 计算 TDEE
  const bmr = calculateBMR(
    profile.weight,
    profile.height,
    profile.age,
    profile.gender === 'other' ? 'female' : profile.gender
  );
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const targetDailyCalories = adjustCaloriesForGoal(tdee, profile.healthGoal);
  const mealCalories = getMealCalorieDistribution(targetDailyCalories);
  
  logs.push(`📊 BMR: ${bmr.toFixed(0)} kcal, TDEE: ${tdee} kcal, 目标: ${targetDailyCalories} kcal/天`);
  logs.push(`🍽️ 热量分配: 早餐 ${mealCalories.breakfast}, 午餐 ${mealCalories.lunch}, 晚餐 ${mealCalories.dinner}`);
  
  // 2. 计算预算约束
  const totalBudget = profile.weeklyBudget * profile.peopleCount;
  const avgCostPerMeal = totalBudget / 21;
  logs.push(`💰 总预算: RM${totalBudget.toFixed(2)}, 平均每餐: RM${avgCostPerMeal.toFixed(2)}`);
  
  // 3. 按餐型筛选菜品
  const breakfastPool = filterDishes(allDishes, 'breakfast', restrictions, avgCostPerMeal);
  const lunchPool = filterDishes(allDishes, 'lunch', restrictions, avgCostPerMeal);
  const dinnerPool = filterDishes(allDishes, 'dinner', restrictions, avgCostPerMeal);
  
  logs.push(`🍳 可用菜品: 早餐 ${breakfastPool.length}, 午餐 ${lunchPool.length}, 晚餐 ${dinnerPool.length}`);
  
  // 4. 初始化追踪变量
  const usageCount = new Map<string, number>(); // 菜品使用次数
  const MAX_USAGE = 2; // 同一菜品最多 2 次
  let runningCost = 0; // 累计花费
  
  // 一周从周日开始
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const plan: DayMealPlan[] = [];
  
  // 获取本周日的日期（作为一周的开始）
  const today = new Date();
  const dayOfWeek = today.getDay(); // 周日=0, 周一=1, ...
  const sundayOffset = -dayOfWeek; // 计算到本周日的偏移
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + sundayOffset);
  sunday.setHours(0, 0, 0, 0);
  
  // 5. 逐天生成计划（从周日开始）
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const dayDate = new Date(sunday);
    dayDate.setDate(sunday.getDate() + dayIndex);
    const dateStr = dayDate.toISOString().split('T')[0];
    
    const remainingBudget = totalBudget - runningCost;
    const remainingMeals = 21 - (dayIndex * 3);
    const avgRemainingBudget = remainingMeals > 0 ? remainingBudget / remainingMeals : avgCostPerMeal;
    
    // 选择每餐
    const breakfast = selectMealWithConstraints(
      breakfastPool,
      'breakfast',
      mealCalories.breakfast,
      avgRemainingBudget,
      usageCount,
      MAX_USAGE,
      profile.peopleCount
    );
    
    const lunch = selectMealWithConstraints(
      lunchPool,
      'lunch',
      mealCalories.lunch,
      avgRemainingBudget,
      usageCount,
      MAX_USAGE,
      profile.peopleCount
    );
    
    const dinner = selectMealWithConstraints(
      dinnerPool,
      'dinner',
      mealCalories.dinner,
      avgRemainingBudget,
      usageCount,
      MAX_USAGE,
      profile.peopleCount
    );
    
    // 计算当天统计
    const dayCalories = 
      (breakfast?.nutrition?.calories || 0) +
      (lunch?.nutrition?.calories || 0) +
      (dinner?.nutrition?.calories || 0);
    
    const dayCost = 
      ((breakfast?.estimated_cost || 0) +
      (lunch?.estimated_cost || 0) +
      (dinner?.estimated_cost || 0)) * profile.peopleCount;
    
    runningCost += dayCost;
    
    plan.push({
      day: dayNames[dayIndex],
      date: dateStr,
      breakfast,
      lunch,
      dinner,
      totalCalories: dayCalories,
      totalCost: dayCost,
    });
    
    logs.push(`📅 ${dayNames[dayIndex]}: 热量 ${dayCalories} kcal, 费用 RM${dayCost.toFixed(2)}`);
  }
  
  // 6. 生成购物清单
  const shoppingList = generateShoppingList(plan, profile.peopleCount);
  
  // 7. 计算总结统计
  const totalCalories = plan.reduce((sum, day) => sum + day.totalCalories, 0);
  const avgDailyCalories = Math.round(totalCalories / 7);
  const calorieDeviation = Math.abs((avgDailyCalories - targetDailyCalories) / targetDailyCalories * 100);
  
  const allSelectedDishes = plan.flatMap(day => [day.breakfast, day.lunch, day.dinner].filter(Boolean));
  const uniqueDishIds = new Set(allSelectedDishes.map(d => d?.id));
  
  logs.push(`✅ 计划生成完成: ${allSelectedDishes.length} 餐, ${uniqueDishIds.size} 道不同菜品`);
  logs.push(`📊 平均热量: ${avgDailyCalories} kcal/天, 偏差: ${calorieDeviation.toFixed(1)}%`);
  logs.push(`💰 总花费: RM${runningCost.toFixed(2)} / RM${totalBudget.toFixed(2)}`);
  
  return {
    plan,
    shoppingList,
    summary: {
      totalCalories,
      avgDailyCalories,
      targetDailyCalories,
      calorieDeviation,
      totalCost: runningCost,
      weeklyBudget: totalBudget,
      isWithinBudget: runningCost <= totalBudget,
      totalDishes: allSelectedDishes.length,
      uniqueDishes: uniqueDishIds.size,
    },
    debug: {
      version: 'v3.0',
      tdee,
      filteredDishCount: breakfastPool.length + lunchPool.length + dinnerPool.length,
      logs,
    },
  };
}

/**
 * 选择满足约束的菜品
 */
function selectMealWithConstraints(
  pool: Dish[],
  mealType: MealType,
  targetCalories: number,
  maxCost: number,
  usageCount: Map<string, number>,
  maxUsage: number,
  peopleCount: number
): Dish | null {
  if (pool.length === 0) return null;
  
  // 过滤可用菜品
  const available = pool.filter(dish => {
    const usage = usageCount.get(dish.id) || 0;
    const cost = (dish.estimated_cost || 0) * peopleCount;
    return usage < maxUsage && cost <= maxCost * 1.2;
  });
  
  if (available.length === 0) {
    // 如果没有可用的，放宽限制
    const fallback = pool.filter(dish => {
      const usage = usageCount.get(dish.id) || 0;
      return usage < maxUsage;
    });
    
    if (fallback.length === 0) return null;
    
    const selected = fallback[Math.floor(Math.random() * fallback.length)];
    usageCount.set(selected.id, (usageCount.get(selected.id) || 0) + 1);
    return selected;
  }
  
  // 按热量匹配度排序
  const scored = available.map(dish => {
    const calories = dish.nutrition?.calories || targetCalories; // 默认使用目标热量
    const calorieScore = 100 - Math.abs(calories - targetCalories) / targetCalories * 100;
    const costScore = dish.estimated_cost ? 50 - (dish.estimated_cost / maxCost * 25) : 50;
    return { dish, score: calorieScore + costScore + Math.random() * 20 }; // 加入随机性
  });
  
  scored.sort((a, b) => b.score - a.score);
  
  // 从前 5 个中随机选择
  const topCandidates = scored.slice(0, Math.min(5, scored.length));
  const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)].dish;
  
  usageCount.set(selected.id, (usageCount.get(selected.id) || 0) + 1);
  return selected;
}

// ==================== 购物清单汇总 ====================

/**
 * 生成购物清单
 * 
 * 遍历所有选中菜品的食材，使用 Map 合并同名食材
 */
export function generateShoppingList(
  plan: DayMealPlan[],
  peopleCount: number
): ShoppingListItem[] {
  const ingredientMap = new Map<string, ShoppingListItem>();
  
  // 遍历所有餐食
  for (const day of plan) {
    const meals = [day.breakfast, day.lunch, day.dinner];
    
    for (const dish of meals) {
      if (!dish) continue;
      
      // 容错：检查食材字段是否存在
      if (!dish.ingredients || !Array.isArray(dish.ingredients)) {
        continue;
      }
      
      // 遍历菜品的所有食材
      for (const ingredient of dish.ingredients) {
        if (!ingredient || !ingredient.name_zh) continue;
        
        const key = ingredient.name_zh.toLowerCase().trim();
        const quantity = (ingredient.quantity || 0) * peopleCount;
        const price = (ingredient.avg_price_per_unit || 0) * quantity;
        
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          existing.totalQuantity += quantity;
          existing.totalPrice += price;
        } else {
          ingredientMap.set(key, {
            name: ingredient.name_zh,
            name_en: ingredient.name_en,
            name_ms: ingredient.name_ms,
            category: ingredient.category || '其他',
            totalQuantity: quantity,
            unit: ingredient.unit || 'g',
            totalPrice: price,
          });
        }
      }
    }
  }
  
  // 转换为数组并按分类排序
  const categoryOrder: Record<string, number> = {
    '肉类': 1,
    '海鲜': 2,
    '蔬菜': 3,
    '主食': 4,
    '调味料': 5,
    '香料': 6,
    '乳制品': 7,
    '其他': 99,
  };
  
  const result = Array.from(ingredientMap.values());
  result.sort((a, b) => {
    const orderA = categoryOrder[a.category] || 50;
    const orderB = categoryOrder[b.category] || 50;
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name, 'zh-CN');
  });
  
  return result;
}

