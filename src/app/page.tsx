'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ProfileSetupForm } from '@/components/profile/ProfileSetupForm';
import { LoadingProgress } from '@/components/ui/LoadingProgress';
import { createBrowserClient } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';
import { useMealPlanStore } from '@/store/mealPlanStore';

// 保存购物清单（从数据库返回的结果）
async function saveShoppingListFromAI(userId: string, mealPlanId: string, shoppingListItems: any[], supabase: any) {
  try {
    console.log('🛒 Saving shopping list...');

    // 创建购物清单记录
    const { data: shoppingList, error: listError } = await supabase
      .from('shopping_lists')
      .insert({
        user_id: userId,
        meal_plan_id: mealPlanId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (listError) {
      console.error('❌ Shopping list creation error:', listError);
      return;
    }

    console.log('✅ Shopping list created:', shoppingList.id);

    // 保存购物清单项目
    if (shoppingListItems && shoppingListItems.length > 0) {
      console.log('📦 Processing', shoppingListItems.length, 'shopping items');
      
      const items = shoppingListItems.map((item: any) => {
        // 适配数据库格式
        const name = item.name || item.name_zh || '未知';
        const nameEn = item.name_en || '';
        const nameMs = item.name_ms || '';
        const notesText = `${name} | ${nameEn} | ${nameMs}`;
        
        return {
          shopping_list_id: shoppingList.id,
          ingredient_id: item.ingredient_id || null,
          quantity: item.quantity || 0,
          unit: item.unit || 'g',
          category: item.category || '其他',
          estimated_price: item.estimated_price || item.price || 0,
          is_purchased: false,
          notes: notesText,
        };
      });

      const { error: itemsError } = await supabase
        .from('shopping_list_items')
        .insert(items);

      if (itemsError) {
        console.error('❌ Shopping list items error:', itemsError);
      } else {
        console.log(`✅ Saved ${items.length} shopping list items`);
      }
    } else {
      console.log('⚠️ No shopping list items to save');
    }
  } catch (error) {
    console.error('❌ Shopping list save error:', error);
  }
}

// 默认价格表（马来西亚令吉）
const DEFAULT_PRICES: Record<string, number> = {
  // 肉类
  '鸡肉': 12, '牛肉': 35, '羊肉': 40, '猪肉': 18, '鸭肉': 20,
  '鸡腿': 10, '鸡胸': 12, '鸡翅': 8, '排骨': 25,
  // 海鲜
  '虾': 25, '鱼': 15, '蟹': 45, '鱿鱼': 18, '贝类': 20,
  // 蔬菜
  '白菜': 3, '菠菜': 4, '生菜': 3, '西兰花': 6, '胡萝卜': 2,
  '洋葱': 3, '大蒜': 5, '姜': 4, '辣椒': 3, '番茄': 4,
  '黄瓜': 3, '茄子': 4, '豆芽': 2, '空心菜': 3, '芥蓝': 5,
  // 主食
  '米饭': 8, '面条': 5, '米粉': 4, '面包': 6, '椰浆饭': 3,
  // 调味料
  '酱油': 6, '盐': 2, '糖': 4, '醋': 5, '咖喱粉': 8,
  '椰浆': 5, '虾酱': 10, '参巴酱': 8, '花生酱': 12,
  // 其他
  '鸡蛋': 8, '豆腐': 4, '豆干': 5, '花生': 8, '椰子': 6,
};

// 根据名称获取默认价格
function getDefaultPrice(name: string, category: string): number {
  // 先尝试精确匹配
  for (const [key, price] of Object.entries(DEFAULT_PRICES)) {
    if (name.includes(key)) return price;
  }
  // 按分类给默认价格
  const categoryPrices: Record<string, number> = {
    '肉类': 20, '海鲜': 25, '蔬菜': 4, '调味料': 6, '主食': 5,
    '肉类 & 海鲜': 22, '新鲜蔬菜': 4, '谷物 & 主食': 5, '水果': 6,
    '乳制品': 8, '菜品': 15, '小吃': 8, '主菜': 20, '其他': 5,
  };
  return categoryPrices[category] || 5;
}

// 预设购物清单模板（马来西亚常见食材）
function getDefaultShoppingList(): any[] {
  return [
    // 菜品（成品菜）
    { name: '椰浆饭', category: '菜品', quantity: 2, unit: '份', price: 8 },
    { name: '沙爹串', category: '小吃', quantity: 2, unit: '份', price: 12 },
    { name: '肉骨茶', category: '主菜', quantity: 1, unit: '份', price: 25 },
    { name: '马来炒面', category: '主菜', quantity: 1, unit: '份', price: 10 },
    { name: '叻沙', category: '主菜', quantity: 1, unit: '份', price: 12 },
    { name: '仁当鸡', category: '主菜', quantity: 1, unit: '份', price: 18 },
    { name: '咖喱鸡', category: '主菜', quantity: 1, unit: '份', price: 15 },
    // 蔬菜
    { name: '空心菜', category: '新鲜蔬菜', quantity: 500, unit: 'g', price: 4 },
    { name: '豆芽', category: '新鲜蔬菜', quantity: 300, unit: 'g', price: 3 },
    { name: '黄瓜', category: '新鲜蔬菜', quantity: 2, unit: '根', price: 3 },
    // 调味料
    { name: '椰浆', category: '调味料', quantity: 2, unit: '罐', price: 8 },
    { name: '参巴酱', category: '调味料', quantity: 1, unit: '瓶', price: 10 },
    // 蛋白质
    { name: '鸡蛋', category: '肉类 & 海鲜', quantity: 10, unit: '个', price: 8 },
    { name: '虾', category: '肉类 & 海鲜', quantity: 500, unit: 'g', price: 25 },
  ];
}

// 合并、去重、汇总购物清单
function mergeShoppingItems(items: any[]): any[] {
  const merged = new Map<string, any>();
  
  for (const item of items) {
    const name = item.name || item.name_zh || '';
    if (!name) continue;
    
    const key = name.toLowerCase().trim();
    const category = item.category || '其他';
    
    // 如果没有价格，使用默认价格
    const price = parseFloat(item.price) || getDefaultPrice(name, category);
    
    if (merged.has(key)) {
      // 已存在，累加数量
      const existing = merged.get(key);
      const existingQty = parseFloat(existing.quantity) || 0;
      const newQty = parseFloat(item.quantity) || 0;
      existing.quantity = existingQty + newQty;
      // 取较高的价格
      if (price > existing.price) {
        existing.price = price;
      }
    } else {
      // 新增
      merged.set(key, {
        name: name,
        name_en: item.name_en || '',
        category: category,
        quantity: parseFloat(item.quantity) || 1,
        unit: item.unit || '份',
        price: price,
      });
    }
  }
  
  return Array.from(merged.values());
}

export default function Home() {
  const router = useRouter();
  const { setProfile, setRestrictions } = useUserStore();
  const { setCurrentPlan, setPlanDetails } = useMealPlanStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isCheckingPlan, setIsCheckingPlan] = useState(true);
  
  // 检查用户登录状态和是否已有膳食计划
  useEffect(() => {
    const checkUserAndPlan = async () => {
      try {
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          if (!user.is_anonymous) {
            setIsLoggedIn(true);
            setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
          }
          
          // 检查用户是否已有活跃的膳食计划
          const { data: mealPlans } = await supabase
            .from('meal_plans')
            .select('id, created_at')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1);
          
          // 如果有活跃的膳食计划，自动跳转到 dashboard
          if (mealPlans && mealPlans.length > 0) {
            console.log('✅ 用户已有膳食计划，跳转到 dashboard');
            router.push('/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking user and plan:', error);
      } finally {
        setIsCheckingPlan(false);
      }
    };
    
    checkUserAndPlan();
  }, [router]);
  
  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setProgress(0);
    setLoadingStep('正在创建用户会话...');
    
    // 🔧 清除旧的缓存数据（重要！）
    console.log('🧹 Clearing old cached data...');
    setCurrentPlan(null);
    setPlanDetails([]);
    
    try {
      // 检查是否配置了 Supabase
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
        alert('⚠️ 请先配置 Supabase\n\n1. 访问 https://app.supabase.com/ 创建项目\n2. 复制 API 密钥到 .env.local 文件\n3. 执行数据库脚本\n\n详细说明请查看：配置说明.md');
        setIsLoading(false);
        return;
      }
      
      const supabase = createBrowserClient();
      
      // 获取当前用户
      let { data: { user } } = await supabase.auth.getUser();
      
      // 如果没有用户，创建匿名会话
      if (!user) {
        setProgress(10);
        setLoadingStep('正在创建匿名用户会话...');
        console.log('Creating anonymous user session...');
        const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
        
        if (anonError) {
          console.error('Failed to create anonymous session:', anonError);
          throw new Error('无法创建用户会话，请检查 Supabase 配置');
        }
        
        user = anonData.user;
      }
      
      if (!user) {
        throw new Error('无法获取用户信息');
      }
      
      // 保存用户档案
      setProgress(20);
      setLoadingStep('正在保存您的个人资料...');
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          full_name: data.full_name,
          age: data.age,
          gender: data.gender,
          weight: data.weight,
          height: data.height,
          health_goal: data.health_goal,
          weekly_budget: data.weekly_budget,
          activity_level: data.activity_level,
          updated_at: new Date().toISOString(),
        });
      
      if (profileError) {
        console.error('Profile save error:', profileError);
        throw profileError;
      }
      
      // 保存饮食限制
      if (data.restrictions && data.restrictions.length > 0) {
        const restrictions = data.restrictions.map((type: string) => ({
          user_id: user.id,
          restriction_type: type,
        }));
        
        // 先删除旧的限制
        await supabase
          .from('dietary_restrictions')
          .delete()
          .eq('user_id', user.id);
        
        // 插入新的限制
        const { error: restrictionsError } = await supabase
          .from('dietary_restrictions')
          .insert(restrictions);
        
        if (restrictionsError) throw restrictionsError;
      }
      
      setProfile({ id: user.id, ...data } as any);
      
      // 生成膳食计划
      setProgress(40);
      setLoadingStep('正在生成您的膳食计划 (21顿饭)...');
      console.log('Generating meal plan...');
      
      // 获取所有食谱
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*, nutrition:recipe_nutrition(*)');
      
      if (recipesError) {
        console.error('Error fetching recipes:', recipesError);
        throw new Error('无法加载食谱数据');
      }
      
      if (!recipes || recipes.length === 0) {
        throw new Error('食谱数据库为空，请先执行 seed-recipes.sql');
      }
      
      // 使用数据库生成膳食计划（不再使用豆包AI）
      const userProfile = {
        id: user.id,
        full_name: data.full_name,
        age: data.age,
        gender: data.gender,
        weight: data.weight,
        height: data.height,
        health_goal: data.health_goal,
        weekly_budget: data.weekly_budget,
        activity_level: data.activity_level,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const restrictionsArray = data.restrictions || [];
      
      // 一次性从数据库生成完整的 7 天膳食计划
      setProgress(40);
      setLoadingStep('正在从数据库生成膳食计划...');
      
      console.log('📤 从数据库生成膳食计划...');
      
      const dbResponse = await fetch('/api/generate-meal-plan-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          restrictions: restrictionsArray,
          days: 7,
          peopleCount: data.people_count || 2,
        }),
      });
      
      if (!dbResponse.ok) {
        const errorData = await dbResponse.json().catch(() => ({}));
        console.error('❌ 数据库生成膳食计划失败:', errorData);
        throw new Error(errorData.error || '膳食计划生成失败');
      }
      
      const dbResult = await dbResponse.json();
      console.log('✅ 数据库生成膳食计划成功:', dbResult);
      
      const allDayPlans = dbResult.plan || [];
      
      // 构建完整的 aiResult
      const aiResult = { plan: allDayPlans };
      
      console.log('📋 Processing meal plan with', aiResult.plan.length, 'days');
      
      // 转换 AI 生成的计划格式
      const mealPlan: any[] = [];
      const recipesMap = new Map(recipes.map(r => [r.id, r]));
      
      console.log('📦 Recipe map size:', recipesMap.size);
      
      // 获取当前日期作为起始日期（周一）
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = 周日, 1 = 周一, ...
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 计算到周一的偏移
      const monday = new Date(today);
      monday.setDate(today.getDate() + mondayOffset);
      monday.setHours(0, 0, 0, 0); // 重置时间为午夜
      
      console.log('📅 Week start (Monday):', monday.toISOString().split('T')[0]);
      
      aiResult.plan.forEach((dayPlan: any, dayIndex: number) => {
        // 安全检查
        if (!dayPlan || !dayPlan.meals || typeof dayPlan.meals !== 'object') {
          console.warn(`⚠️ Invalid day plan at index ${dayIndex}:`, dayPlan);
          return;
        }
        
        // 计算实际日期（从周一开始）
        const actualDate = new Date(monday);
        actualDate.setDate(monday.getDate() + dayIndex);
        const dateString = actualDate.toISOString().split('T')[0]; // YYYY-MM-DD
        
        console.log(`Day ${dayIndex + 1} (${dayPlan.day || 'Unknown'}): ${dateString}`);
        
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
          const aiMeal = dayPlan.meals?.[mealType];
          if (!aiMeal || aiMeal === null) {
            console.warn(`⚠️ Missing meal for ${mealType} on day ${dayIndex + 1}`);
            // 如果缺失，从同类型的菜谱中随机选一个
            const sameTypeRecipes = recipes.filter(r => 
              Array.isArray(r.meal_type) && r.meal_type.includes(mealType)
            );
            if (sameTypeRecipes.length > 0) {
              const recipe = sameTypeRecipes[Math.floor(Math.random() * sameTypeRecipes.length)];
              console.log(`  🔄 Using fallback ${mealType}: ${recipe.name_zh || recipe.name_ms}`);
              mealPlan.push({
                date: dateString,
                mealType,
                recipe,
              });
            }
            return;
          }
          
          const nameZh = aiMeal.name_zh || '';
          const nameEn = aiMeal.name_en || '';
          const namMs = aiMeal.name_ms || '';
          
          console.log(`  ${mealType}: ${nameZh} (${nameEn})`);
          
          // 在数据库中查找匹配的菜谱（通过名称模糊匹配）
          let recipe = recipes.find(r => 
            (nameZh && r.name_zh && r.name_zh.includes(nameZh.substring(0, 2))) ||
            (nameEn && r.name_en && r.name_en.toLowerCase().includes(nameEn.toLowerCase().substring(0, 4))) ||
            (namMs && r.name_ms && r.name_ms.toLowerCase().includes(namMs.toLowerCase().substring(0, 4)))
          );
          
          // 如果没找到，就从同类型的菜谱中随机选一个
          if (!recipe) {
            const sameTypeRecipes = recipes.filter(r => 
              Array.isArray(r.meal_type) && r.meal_type.includes(mealType)
            );
            if (sameTypeRecipes.length > 0) {
              recipe = sameTypeRecipes[Math.floor(Math.random() * sameTypeRecipes.length)];
              console.log(`  ⚠️ Recipe not found, using random ${mealType}: ${recipe.name_zh || recipe.name_ms}`);
            } else {
              console.warn(`⚠️ No recipes found for ${mealType}`);
              return;
            }
          } else {
            console.log(`  ✅ Found recipe: ${recipe.name_zh || recipe.name_ms}`);
          }
          
          mealPlan.push({
            date: dateString, // 使用计算出的实际日期
            mealType,
            recipe,
          });
        });
      });
      
      console.log('✅ Generated meal plan:', mealPlan.length, 'meals');
      
      if (mealPlan.length === 0) {
        throw new Error('AI 生成的膳食计划中没有有效的餐食，请重试');
      }
      
      // 计算实际的开始和结束日期
      const startDate = monday.toISOString().split('T')[0];
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const endDate = sunday.toISOString().split('T')[0];
      
      console.log(`📅 Meal plan period: ${startDate} to ${endDate}`);
      
      // 保存膳食计划
      const { data: planData, error: planError } = await supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          plan_name: `${data.full_name} 的膳食计划`,
          start_date: startDate,
          end_date: endDate,
          is_active: true,
        })
        .select()
        .single();
      
      if (planError) {
        console.error('Meal plan save error:', planError);
        throw planError;
      }
      
      // 保存膳食计划详情
      const planDetails = mealPlan
        .filter(meal => meal.recipe && meal.recipe.id) // 确保有有效的 recipe
        .map((meal) => {
          const detail = {
            meal_plan_id: planData.id,
            meal_type: meal.mealType,
            recipe_id: meal.recipe.id,
            date: meal.date,
            servings: 1,
          };
          
          // 验证所有UUID字段
          if (!detail.meal_plan_id || !detail.recipe_id) {
            console.error('❌ Invalid detail:', detail);
            throw new Error('数据格式错误：缺少必需的ID字段');
          }
          
          return detail;
        });
      
      console.log('📝 Saving', planDetails.length, 'meal details...');
      
      const { data: insertedDetails, error: detailsError } = await supabase
        .from('meal_plan_details')
        .insert(planDetails)
        .select();  // ✅ 添加 .select() 以获取插入后的数据（包含生成的 id）
      
      if (detailsError) {
        console.error('❌ Meal plan details save error:', detailsError);
        console.error('Details that failed:', planDetails);
        throw detailsError;
      }
      
      if (!insertedDetails || insertedDetails.length === 0) {
        throw new Error('保存膳食计划详情失败：未返回数据');
      }
      
      console.log('✅ Meal plan saved successfully! Inserted', insertedDetails.length, 'details');
      
      // 保存到 store 以便缓存
      setCurrentPlan(planData);
      const detailsWithRecipes = mealPlan.map((meal, index) => ({
        id: insertedDetails[index]?.id || '',  // ✅ 使用插入后返回的数据，包含数据库生成的 id
        meal_plan_id: planData.id,
        recipe_id: meal.recipe.id,
        date: meal.date,
        meal_type: meal.mealType,
        servings: 1,
        recipe: meal.recipe,
      }));
      setPlanDetails(detailsWithRecipes as any);
      
      setProgress(75);
      setLoadingStep('正在生成购物清单...');
      
      // 使用数据库返回的购物清单（不再调用豆包AI）
      let mergedItems = dbResult.shopping_list || [];
      console.log('✅ 数据库返回购物清单：', mergedItems.length, '项');
      
      // 移除预设模板，如果没有购物清单则报错
      if (mergedItems.length === 0) {
        throw new Error('购物清单生成失败：所选菜品尚未配置食材数据');
      }
      
      // 保存购物清单
      await saveShoppingListFromAI(user.id, planData.id, mergedItems, supabase);
      
      setProgress(100);
      setLoadingStep('膳食计划创建成功！');
      
      // 立即跳转到 dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      
      let errorMessage = '保存失败：' + (error.message || '未知错误');
      if (error.message?.includes('fetch')) {
        errorMessage = '⚠️ 无法连接到 Supabase\n\n请检查：\n1. .env.local 文件是否正确配置\n2. Supabase 项目是否正常运行\n3. 网络连接是否正常\n\n详细说明：配置说明.md';
      } else if (error.code === '42P01') {
        errorMessage = '⚠️ 数据库表不存在\n\n请执行数据库初始化脚本：\n1. 打开 Supabase SQL Editor\n2. 执行 supabase/schema.sql\n3. 执行 supabase/seed-recipes.sql\n\n详细说明：配置说明.md';
      } else if (error.message?.includes('匿名登录') || error.message?.includes('Anonymous sign-ins are disabled')) {
        errorMessage = '⚠️ 需要启用匿名登录\n\n请在 Supabase 中启用匿名登录：\n1. 打开 Supabase Dashboard\n2. 进入 Authentication > Providers\n3. 启用 "Anonymous Sign-ins"\n\n或者您可以先注册登录再使用。';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 正在检查是否有膳食计划时显示加载界面
  if (isCheckingPlan) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col transition-colors duration-300">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">加载中...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-10 text-center md:text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-3">
                设置您的膳食档案
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
                让 AI 为您生成最适合的 7天马来西亚美食计划！请告诉我们您的饮食偏好、预算和健康目标。
              </p>
            </div>
          </div>
          
          {isLoggedIn ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800 dark:text-green-300">
                ✅ <strong>欢迎回来{userName ? `，${userName}` : ''}！</strong>您的膳食计划将自动保存到您的账户。
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 <strong>提示：</strong>您可以
                {' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  登录
                </button>
                {' '}或{' '}
                <button
                  onClick={() => router.push('/register')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  注册
                </button>
                {' '}
                保存您的膳食计划，也可以直接填写下方表单匿名使用。
              </p>
            </div>
          )}
        </div>
        <ProfileSetupForm onSubmit={handleSubmit} />
      </main>
      
      {isLoading && <LoadingProgress step={loadingStep} progress={progress} />}
    </div>
  );
}

