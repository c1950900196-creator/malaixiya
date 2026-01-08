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
    // 如果 store 中已经有数据，先验证数据有效性
    if (planDetails && planDetails.length > 0) {
      // 检查缓存数据是否有效（必须有 id）
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
      // 检查 Supabase 配置
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
        setIsLoading(false);
        alert('⚠️ 请先配置 Supabase\n\n详细说明请查看：配置说明.md');
        router.push('/');
        return;
      }
      
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user found, redirecting to home');
        alert('请先设置您的膳食档案');
        router.push('/');
        return;
      }
      
      console.log('Loading meal plan for user:', user.id, user.is_anonymous ? '(anonymous)' : '(registered)');
      
      // 获取当前活跃的膳食计划（最新的一个）
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
      
      // 如果没有计划，显示空状态
      if (!plansList || plansList.length === 0) {
        console.log('No meal plans found');
        setIsLoading(false);
        return;
      }
      
      const plans = plansList[0];
      setCurrentPlan(plans); // 保存到 store
      
      // 获取计划详情 - 只加载必要字段以提高性能
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
      
      // 转换数据格式：将 recipe 数组转换为单个 recipe 对象
      const formattedDetails = (details || []).map((detail: any) => ({
        ...detail,
        recipe: Array.isArray(detail.recipe) ? detail.recipe[0] : detail.recipe,
      })) as (MealPlanDetail & { recipe?: Recipe })[];
      
      setPlanDetails(formattedDetails);
    } catch (error: any) {
      console.error('Error:', error);
      
      let errorMessage = '加载膳食计划失败';
      if (error.code === '42P01') {
        errorMessage = '⚠️ 数据库表不存在\n\n请执行数据库初始化脚本\n详细说明：配置说明.md';
      } else if (error.message?.includes('fetch')) {
        errorMessage = '⚠️ 无法连接到 Supabase\n\n请检查配置和网络\n详细说明：配置说明.md';
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
      
      // 1. 找到要替换的餐食
      const mealToReplace = planDetails?.find(detail => detail.id === mealId);
      console.log('🔍 Meal to replace:', mealToReplace);
      
      if (!mealToReplace) {
        alert('找不到要替换的餐食');
        return;
      }
      
      // 2. 获取所有同类型的菜谱
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
        alert('网络连接失败，请检查网络后重试');
        return;
      }
      
      if (recipesError) {
        console.error('❌ Supabase error:', recipesError);
        alert(`数据库查询失败：${recipesError.message || '未知错误'}`);
        return;
      }
      
      if (!allRecipes || allRecipes.length === 0) {
        alert('没有找到同类型的菜谱');
        return;
      }
      
      // 3. 过滤掉当前已在计划中的菜谱
      const currentRecipeIds = planDetails?.map(d => d.recipe_id) || [];
      const availableRecipes = allRecipes?.filter(recipe => !currentRecipeIds.includes(recipe.id)) || [];
      
      console.log('✅ Available recipes:', availableRecipes.length, 'Current IDs:', currentRecipeIds);
      
      if (availableRecipes.length === 0) {
        alert('没有找到可替换的菜肴，所有同类型的菜品可能都已在您的计划中');
        return;
      }
      
      // 4. 随机选择一个新菜谱
      const newRecipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
      
      console.log('🎲 Selected new recipe:', {
        id: newRecipe.id,
        name: newRecipe.name_zh || newRecipe.name_ms || newRecipe.name_en,
      });
      
      // 验证数据
      if (!newRecipe || !newRecipe.id) {
        alert('选择的菜谱数据无效，请重试');
        return;
      }
      
      if (!mealId || mealId === '') {
        console.error('❌ Invalid mealId:', mealId);
        console.error('Meal to replace:', mealToReplace);
        alert('❌ 数据错误：餐食ID无效\n\n这通常是因为使用了旧的缓存数据。\n\n请返回首页重新生成膳食计划。');
        return;
      }
      
      console.log('📝 Updating meal_plan_details:', {
        mealId,
        newRecipeId: newRecipe.id,
      });
      
      // 5. 更新数据库
      const { error: updateError } = await supabase
        .from('meal_plan_details')
        .update({ recipe_id: newRecipe.id })
        .eq('id', mealId);
      
      if (updateError) {
        console.error('❌ Update error:', updateError);
        throw updateError;
      }
      
      console.log('✅ Database updated successfully');
      
      // 6. 更新本地状态
      const updatedDetails = planDetails?.map(detail => 
        detail.id === mealId 
          ? { ...detail, recipe_id: newRecipe.id, recipe: newRecipe as Recipe }
          : detail
      );
      
      setPlanDetails(updatedDetails || []);
      alert(`✅ 已将菜肴替换为：${newRecipe.name_zh || newRecipe.name_ms || newRecipe.name_en}`);
      
    } catch (error: any) {
      console.error('Replace meal error:', error);
      const errorMessage = error?.message || error?.error_description || JSON.stringify(error);
      alert(`替换失败：${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegeneratePlan = async () => {
    // TODO: 实现重新生成计划
    alert('重新生成膳食计划功能即将推出！');
  };
  
  const todayCalories = 1850; // TODO: 从实际数据计算
  const weeklyProtein = 120; // TODO: 从实际数据计算
  const weeklyCarbs = 200; // TODO: 从实际数据计算
  
  return (
    <MainLayout>
      <header className="h-16 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-border-dark flex items-center justify-between px-6 py-4 z-10">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          我的本周膳食计划
        </h1>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-surface-dark border border-transparent dark:border-border-dark px-3 py-1.5 rounded-md">
            <span className="mr-1">📅</span>
            {new Date().toLocaleDateString('zh-CN')}
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={handleRegeneratePlan}
          >
            重新生成计划
          </Button>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card hover className="group">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider">
                  今日热量目标
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {todayCalories}
                </p>
                <Badge variant="success" size="sm" className="mt-1">
                  达标
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
                  平均蛋白质摄入
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {weeklyProtein}g
                  <span className="text-sm font-normal text-gray-500">/天</span>
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
                  碳水化合物
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {weeklyCarbs}g
                  <span className="text-sm font-normal text-gray-500">/天</span>
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
                <ShoppingBag className="w-24 h-24 text-black" />
              </div>
              <div className="z-10">
                <p className="font-bold text-lg leading-tight text-black">
                  购物清单<br />已准备就绪
                </p>
              </div>
              <div className="flex justify-between items-end z-10 mt-2">
                <p className="text-xs font-semibold opacity-80 text-black">
                  包含 32 种食材
                </p>
                <span className="text-xs bg-black text-primary px-3 py-1.5 rounded-full font-bold">
                  查看清单
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* 膳食日历 */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">加载中...</p>
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

