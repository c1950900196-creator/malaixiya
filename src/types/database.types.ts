// Supabase 数据库类型定义

export type HealthGoal = 'lose_weight' | 'gain_muscle' | 'maintain';
export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type CuisineType = 'malay' | 'chinese' | 'indian' | 'fusion';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type RestrictionType = 'halal' | 'vegetarian' | 'vegan' | 'gluten_free' | 'dairy_free' | 'nut_allergy' | 'seafood_allergy' | 'diabetes';

export interface UserProfile {
  id: string;
  full_name?: string;
  age?: number;
  gender?: Gender;
  weight?: number;
  height?: number;
  health_goal?: HealthGoal;
  weekly_budget?: number;
  activity_level?: ActivityLevel;
  created_at: string;
  updated_at: string;
}

export interface DietaryRestriction {
  id: string;
  user_id: string;
  restriction_type: RestrictionType;
  created_at: string;
}

export interface Recipe {
  id: string;
  name_en: string;
  name_ms: string;
  name_zh?: string;
  description?: string;
  cuisine_type?: CuisineType;
  meal_type: MealType[];
  prep_time?: number;
  cook_time?: number;
  servings: number;
  difficulty?: Difficulty;
  image_url?: string;
  is_halal: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  contains_nuts: boolean;
  contains_seafood: boolean;
  is_diabetic_friendly: boolean;
  estimated_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeNutrition {
  id: string;
  recipe_id: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface Ingredient {
  id: string;
  name_en: string;
  name_ms: string;
  name_zh?: string;
  category?: string;
  unit?: string;
  avg_price_per_unit?: number;
  is_local: boolean;
  created_at: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface CookingStep {
  id: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
  duration?: number;
  created_at: string;
}

export interface MealPlan {
  id: string;
  user_id: string;
  plan_name?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  total_budget?: number;
  created_at: string;
  updated_at: string;
}

export interface MealPlanDetail {
  id: string;
  meal_plan_id: string;
  recipe_id: string;
  date: string;
  meal_type: MealType;
  servings: number;
  is_completed: boolean;
  notes?: string;
  created_at: string;
}

export interface ShoppingList {
  id: string;
  user_id: string;
  meal_plan_id: string;
  list_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ShoppingListItem {
  id: string;
  shopping_list_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  is_purchased: boolean;
  estimated_price?: number;
  category?: string;
  created_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export interface UserRating {
  id: string;
  user_id: string;
  recipe_id: string;
  rating: number;
  review?: string;
  created_at: string;
}

// 扩展类型，包含关联数据
export interface RecipeWithDetails extends Recipe {
  nutrition?: RecipeNutrition;
  ingredients?: (RecipeIngredient & { ingredient: Ingredient })[];
  steps?: CookingStep[];
  avg_rating?: number;
  rating_count?: number;
}

export interface MealPlanWithDetails extends MealPlan {
  meals: (MealPlanDetail & { recipe: Recipe })[];
  total_calories?: number;
  total_cost?: number;
}



