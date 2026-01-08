import { Recipe, UserProfile, DietaryRestriction, RecipeNutrition } from '@/types/database.types';
import { calculateBMR, calculateTDEE, adjustCaloriesForGoal } from './utils';

// 基于内容的过滤 (Content-based Filtering)
export interface RecommendationCriteria {
  targetCalories: number;
  restrictions: string[];
  budget: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  cuisine?: string;
}

// 计算食谱评分
export function calculateRecipeScore(
  recipe: Recipe & { nutrition?: RecipeNutrition },
  criteria: RecommendationCriteria,
  userPreferences?: {
    favoriteCuisines?: string[];
    excludedIngredients?: string[];
  }
): number {
  let score = 100;
  
  // 1. 热量匹配度 (权重: 30%)
  if (recipe.nutrition?.calories) {
    const calorieTarget = getTargetCaloriesForMeal(criteria.targetCalories, criteria.mealType);
    const calorieDiff = Math.abs(recipe.nutrition.calories - calorieTarget);
    const calorieScore = Math.max(0, 100 - (calorieDiff / calorieTarget) * 100);
    score += calorieScore * 0.3;
  }
  
  // 2. 饮食限制匹配 (权重: 40%)
  const restrictionScore = checkDietaryRestrictions(recipe, criteria.restrictions);
  score += restrictionScore * 0.4;
  
  // 3. 预算匹配度 (权重: 15%)
  if (recipe.estimated_cost) {
    const costPerMeal = criteria.budget / 21; // 7天 * 3餐
    const budgetScore = recipe.estimated_cost <= costPerMeal ? 100 : Math.max(0, 100 - ((recipe.estimated_cost - costPerMeal) / costPerMeal) * 100);
    score += budgetScore * 0.15;
  }
  
  // 4. 用户偏好 (权重: 10%)
  if (userPreferences?.favoriteCuisines && recipe.cuisine_type) {
    const preferenceScore = userPreferences.favoriteCuisines.includes(recipe.cuisine_type) ? 100 : 50;
    score += preferenceScore * 0.1;
  }
  
  // 5. 餐型匹配 (权重: 5%)
  const mealTypeScore = recipe.meal_type.includes(criteria.mealType) ? 100 : 0;
  score += mealTypeScore * 0.05;
  
  return Math.min(100, score);
}

// 检查饮食限制
function checkDietaryRestrictions(recipe: Recipe, restrictions: string[]): number {
  let score = 100;
  
  for (const restriction of restrictions) {
    switch (restriction) {
      case 'halal':
        if (!recipe.is_halal) return 0;
        break;
      case 'vegetarian':
        if (!recipe.is_vegetarian) return 0;
        break;
      case 'vegan':
        if (!recipe.is_vegan) return 0;
        break;
      case 'gluten_free':
        if (!recipe.is_gluten_free) score -= 50;
        break;
      case 'dairy_free':
        if (!recipe.is_dairy_free) score -= 50;
        break;
      case 'nut_allergy':
        if (recipe.contains_nuts) return 0;
        break;
      case 'seafood_allergy':
        if (recipe.contains_seafood) return 0;
        break;
      case 'diabetes':
        if (!recipe.is_diabetic_friendly) score -= 30;
        break;
    }
  }
  
  return Math.max(0, score);
}

// 获取特定餐型的目标热量
function getTargetCaloriesForMeal(totalDailyCalories: number, mealType: string): number {
  const distribution: Record<string, number> = {
    breakfast: 0.25, // 25%
    lunch: 0.35,     // 35%
    dinner: 0.30,    // 30%
    snack: 0.10,     // 10%
  };
  
  return totalDailyCalories * (distribution[mealType] || 0.25);
}

// 约束满足问题 (Constraint Satisfaction Problem - CSP)
export interface MealPlanConstraints {
  totalBudget: number;
  totalCalories: number;
  minProtein: number;
  maxSugar?: number;
  variety: number; // 菜品多样性要求 (1-10)
}

export function generateWeeklyMealPlan(
  recipes: (Recipe & { nutrition?: RecipeNutrition })[],
  profile: UserProfile,
  restrictions: DietaryRestriction[]
): { date: string; mealType: string; recipe: Recipe }[] {
  const plan: { date: string; mealType: string; recipe: Recipe }[] = [];
  
  // 计算每日目标热量
  const bmr = calculateBMR(
    profile.weight || 70,
    profile.height || 170,
    profile.age || 30,
    (profile.gender === 'male' || profile.gender === 'female') ? profile.gender : 'male'
  );
  const tdee = calculateTDEE(bmr, profile.activity_level || 'moderately_active');
  const targetCalories = adjustCaloriesForGoal(tdee, profile.health_goal || 'maintain');
  
  const restrictionTypes = restrictions.map((r) => r.restriction_type);
  const mealTypes: ('breakfast' | 'lunch' | 'dinner')[] = ['breakfast', 'lunch', 'dinner'];
  
  // 生成7天计划
  for (let day = 0; day < 7; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];
    
    for (const mealType of mealTypes) {
      const criteria: RecommendationCriteria = {
        targetCalories,
        restrictions: restrictionTypes,
        budget: (profile.weekly_budget || 250) / 7,
        mealType,
      };
      
      // 过滤并评分所有食谱
      const scoredRecipes = recipes
        .filter((recipe) => recipe.meal_type.includes(mealType))
        .map((recipe) => ({
          recipe,
          score: calculateRecipeScore(recipe, criteria),
        }))
        .filter((item) => item.score > 50) // 只选择评分 > 50 的
        .sort((a, b) => b.score - a.score);
      
      // 从高分菜谱中随机选择，增加多样性
      const topCandidates = scoredRecipes.slice(0, Math.min(10, scoredRecipes.length)); // 取前10名候选
      const recentMeals = plan.slice(-6); // 检查最近6餐
      
      // 过滤掉最近使用过的菜谱
      const availableCandidates = topCandidates.filter(
        (item) => !recentMeals.some((m) => m.recipe.id === item.recipe.id)
      );
      
      // 如果所有候选都用过了，就用全部候选
      const finalCandidates = availableCandidates.length > 0 ? availableCandidates : topCandidates;
      
      // 随机选择一个
      let selectedRecipe: Recipe | undefined;
      if (finalCandidates.length > 0) {
        const randomIndex = Math.floor(Math.random() * finalCandidates.length);
        selectedRecipe = finalCandidates[randomIndex]?.recipe;
      }
      
      if (selectedRecipe) {
        plan.push({
          date: dateStr,
          mealType,
          recipe: selectedRecipe,
        });
      }
    }
  }
  
  return plan;
}

// 替换单个餐食
export function suggestAlternativeRecipes(
  currentRecipe: Recipe,
  allRecipes: (Recipe & { nutrition?: RecipeNutrition })[],
  criteria: RecommendationCriteria,
  count: number = 5
): Recipe[] {
  return allRecipes
    .filter((recipe) => recipe.id !== currentRecipe.id) // 排除当前食谱
    .filter((recipe) => recipe.meal_type.includes(criteria.mealType)) // 同类型餐食
    .map((recipe) => ({
      recipe,
      score: calculateRecipeScore(recipe, criteria),
    }))
    .filter((item) => item.score > 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((item) => item.recipe);
}

// 营养平衡检查
export function checkNutritionalBalance(meals: (Recipe & { nutrition?: RecipeNutrition })[]): {
  isBalanced: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const totalNutrition = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.nutrition?.calories || 0),
      protein: acc.protein + (meal.nutrition?.protein || 0),
      carbs: acc.carbs + (meal.nutrition?.carbohydrates || 0),
      fat: acc.fat + (meal.nutrition?.fat || 0),
      sugar: acc.sugar + (meal.nutrition?.sugar || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 }
  );
  
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let isBalanced = true;
  
  // 检查蛋白质 (应占15-30%)
  const proteinPercentage = (totalNutrition.protein * 4) / totalNutrition.calories;
  if (proteinPercentage < 0.15) {
    warnings.push('蛋白质摄入不足');
    suggestions.push('建议增加鸡肉、鱼类或豆类食物');
    isBalanced = false;
  }
  
  // 检查碳水化合物 (应占45-65%)
  const carbsPercentage = (totalNutrition.carbs * 4) / totalNutrition.calories;
  if (carbsPercentage > 0.65) {
    warnings.push('碳水化合物比例过高');
    suggestions.push('建议减少米饭或面食，增加蔬菜');
    isBalanced = false;
  }
  
  // 检查糖分
  if (totalNutrition.sugar > 50) {
    warnings.push('糖分摄入过高');
    suggestions.push('建议减少甜品和含糖饮料');
    isBalanced = false;
  }
  
  return { isBalanced, warnings, suggestions };
}


