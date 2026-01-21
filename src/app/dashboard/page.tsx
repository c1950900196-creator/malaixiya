'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MealPlanCalendar } from '@/components/meal-plan/MealPlanCalendar';
import { RecipeDetailModal } from '@/components/meal-plan/RecipeDetailModal';
import { createBrowserClient } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';
import { useMealPlanStore } from '@/store/mealPlanStore';
import { Flame, Activity, Croissant, ShoppingBag, RefreshCw } from 'lucide-react';
import { MealPlanDetail, Recipe, RecipeWithDetails } from '@/types/database.types';

export default function DashboardPage() {
  const router = useRouter();
  const { profile } = useUserStore();
  const { currentPlan, planDetails, setPlanDetails, setCurrentPlan } = useMealPlanStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeWithDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // If store already has data, validate first
    if (planDetails && planDetails.length > 0) {
      // Check if cached data is valid (must have id)
      const hasInvalidData = planDetails.some(detail => !detail.id || detail.id === '');
      
      if (hasInvalidData) {
        console.warn('⚠️ Cached data has invalid IDs, reloading from database...');
        loadMealPlan();
        return;
      }
      
      console.log('✅ Using cached meal plan data with valid IDs');
      setIsLoading(false);
      return;
    }
    loadMealPlan();
  }, []);
  
  const loadMealPlan = async () => {
    try {
      // Check Supabase configuration
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
        setIsLoading(false);
        alert('⚠️ Please configure Supabase first\n\nSee: Configuration Guide');
        router.push('/');
        return;
      }
      
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user found, redirecting to home');
        alert('Please set up your meal profile first');
        router.push('/');
        return;
      }
      
      console.log('Loading meal plan for user:', user.id, user.is_anonymous ? '(anonymous)' : '(registered)');
      
      // Get current active meal plan (most recent one)
      const { data: plansList, error: planError } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (planError) {
        console.error('Error loading meal plan:', planError);
        setIsLoading(false);
        return;
      }
      
      // If no plan, show empty state
      if (!plansList || plansList.length === 0) {
        console.log('No meal plans found');
        setIsLoading(false);
        return;
      }
      
      const plans = plansList[0];
      setCurrentPlan(plans); // Save to store
      
      // Get plan details - only load necessary fields for performance
      const { data: details, error: detailsError } = await supabase
        .from('meal_plan_details')
        .select(`
          id,
          meal_plan_id,
          recipe_id,
          date,
          meal_type,
          servings,
          is_completed,
          created_at,
          notes,
          recipe:recipes(
            id,
            name_en,
            name_ms,
            name_zh,
            description,
            cuisine_type,
            prep_time,
            cook_time,
            image_url
          )
        `)
        .eq('meal_plan_id', plans.id);
      
      if (detailsError) throw detailsError;
      
      // Convert data format: convert recipe array to single recipe object
      const formattedDetails = (details || []).map((detail: any) => ({
        ...detail,
        recipe: Array.isArray(detail.recipe) ? detail.recipe[0] : detail.recipe,
      })) as (MealPlanDetail & { recipe?: Recipe })[];
      
      setPlanDetails(formattedDetails);
    } catch (error: any) {
      console.error('Error:', error);
      
      let errorMessage = 'Failed to load meal plan';
      if (error.code === '42P01') {
        errorMessage = '⚠️ Database tables do not exist\n\nPlease run database initialization scripts\nSee: Configuration Guide';
      } else if (error.message?.includes('fetch')) {
        errorMessage = '⚠️ Cannot connect to Supabase\n\nPlease check configuration and network\nSee: Configuration Guide';
      }
      
      alert(errorMessage);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMealClick = (meal: MealPlanDetail & { recipe?: Recipe }) => {
    if (meal.recipe) {
      setSelectedRecipe(meal.recipe as RecipeWithDetails);
      setIsModalOpen(true);
    }
  };
  
  const handleReplaceMeal = async (mealId: string) => {
    try {
      setIsLoading(true);
      const supabase = createBrowserClient();
      
      // 1. Find meal to replace
      const mealToReplace = planDetails?.find(detail => detail.id === mealId);
      console.log('🔍 Meal to replace:', mealToReplace);
      
      if (!mealToReplace) {
        alert('Cannot find meal to replace');
        return;
      }
      
      // 2. Get all recipes of the same type
      console.log('🔍 Fetching recipes with meal_type:', mealToReplace.meal_type);
      
      let allRecipes: any[] = [];
      let recipesError: any = null;
      
      try {
        const response = await supabase
          .from('recipes')
          .select('id, name_en, name_ms, name_zh, description, meal_type, cuisine_type, cook_time, prep_time, difficulty, image_url, estimated_cost')
          .contains('meal_type', [mealToReplace.meal_type]);
        
        allRecipes = response.data || [];
        recipesError = response.error;
        
        console.log('📦 All recipes:', allRecipes.length, 'Error:', recipesError);
      } catch (fetchError: any) {
        console.error('❌ Network error:', fetchError);
        alert('Network connection failed, please check your network and try again');
        return;
      }
      
      if (recipesError) {
        console.error('❌ Supabase error:', recipesError);
        alert(`Database query failed: ${recipesError.message || 'Unknown error'}`);
        return;
      }
      
      if (!allRecipes || allRecipes.length === 0) {
        alert('No recipes of the same type found');
        return;
      }
      
      // 3. Filter out recipes already in plan
      const currentRecipeIds = planDetails?.map(d => d.recipe_id) || [];
      const availableRecipes = allRecipes?.filter(recipe => !currentRecipeIds.includes(recipe.id)) || [];
      
      console.log('✅ Available recipes:', availableRecipes.length, 'Current IDs:', currentRecipeIds);
      
      if (availableRecipes.length === 0) {
        alert('No replacement dishes found. All dishes of this type may already be in your plan.');
        return;
      }
      
      // 4. Randomly select a new recipe
      const newRecipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
      
      console.log('🎲 Selected new recipe:', {
        id: newRecipe.id,
        name: newRecipe.name_en || newRecipe.name_zh || newRecipe.name_ms,
      });
      
      // Validate data
      if (!newRecipe || !newRecipe.id) {
        alert('Selected recipe data is invalid, please try again');
        return;
      }
      
      if (!mealId || mealId === '') {
        console.error('❌ Invalid mealId:', mealId);
        console.error('Meal to replace:', mealToReplace);
        alert('❌ Data error: Invalid meal ID\n\nThis usually happens with old cached data.\n\nPlease return to home and regenerate your meal plan.');
        return;
      }
      
      console.log('📝 Updating meal_plan_details:', {
        mealId,
        newRecipeId: newRecipe.id,
      });
      
      // 5. Update database
      const { error: updateError } = await supabase
        .from('meal_plan_details')
        .update({ recipe_id: newRecipe.id })
        .eq('id', mealId);
      
      if (updateError) {
        console.error('❌ Update error:', updateError);
        throw updateError;
      }
      
      console.log('✅ Database updated successfully');
      
      // 6. Update local state
      const updatedDetails = planDetails?.map(detail => 
        detail.id === mealId 
          ? { ...detail, recipe_id: newRecipe.id, recipe: newRecipe as Recipe }
          : detail
      );
      
      setPlanDetails(updatedDetails || []);
      alert(`✅ Dish replaced with: ${newRecipe.name_en || newRecipe.name_zh || newRecipe.name_ms}`);
      
    } catch (error: any) {
      console.error('Replace meal error:', error);
      const errorMessage = error?.message || error?.error_description || JSON.stringify(error);
      alert(`Replace failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegeneratePlan = async () => {
    // TODO: Implement regenerate plan
    alert('Regenerate meal plan feature coming soon!');
  };
  
  const todayCalories = 1850; // TODO: Calculate from actual data
  const weeklyProtein = 120; // TODO: Calculate from actual data
  const weeklyCarbs = 200; // TODO: Calculate from actual data
  
  return (
    <MainLayout>
      <header className="h-16 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-border-dark flex items-center justify-between px-6 py-4 z-10">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          My Weekly Meal Plan
        </h1>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-surface-dark border border-transparent dark:border-border-dark px-3 py-1.5 rounded-md">
            <span className="mr-1">📅</span>
            {new Date().toLocaleDateString('en-US')}
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={handleRegeneratePlan}
          >
            Regenerate Plan
          </Button>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card hover className="group">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">
                  Daily Calorie Target
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {todayCalories}
                </p>
                <Badge variant="success" size="sm" className="mt-1">
                  On Track
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-primary/10 flex items-center justify-center text-green-600 dark:text-primary">
                <Flame className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          
          <Card hover>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">
                  Avg. Protein Intake
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {weeklyProtein}g
                  <span className="text-sm font-normal text-gray-500">/day</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Activity className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          
          <Card hover>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">
                  Carbohydrates
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {weeklyCarbs}g
                  <span className="text-sm font-normal text-gray-500">/day</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                <Croissant className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          
          <Card
            hover
            className="bg-primary cursor-pointer"
            onClick={() => router.push('/shopping-list')}
          >
            <CardContent className="p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-20 transform translate-x-4 -translate-y-4">
                <ShoppingBag className="w-24 h-24 text-white" />
              </div>
              <div className="z-10">
                <p className="font-bold text-lg leading-tight text-white">
                  Shopping List<br />Ready
                </p>
              </div>
              <div className="flex justify-between items-end z-10 mt-2">
                <p className="text-xs font-semibold opacity-80 text-white">
                  Includes 32 ingredients
                </p>
                <span className="text-xs bg-white text-primary px-3 py-1.5 rounded-full font-bold">
                  View List
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Meal Calendar */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <MealPlanCalendar
            meals={planDetails}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onMealClick={handleMealClick}
            onReplaceMeal={handleReplaceMeal}
          />
        )}
      </div>
      
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </MainLayout>
  );
}
