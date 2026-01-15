import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * 从数据库生成膳食计划 API (不使用豆包AI)
 * 直接从数据库智能选择菜品，带随机性和多样性
 * 
 * 🆕 v2.0 - 修复肉骨茶重复问题，每道菜一周最多2次
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, restrictions, days = 7, peopleCount = 2, weeklyBudget } = body;

    // 🚀 版本标识 - 用于确认代码是否已部署
    console.log('🚀 === 膳食计划 API v2.1 (2026-01-15 修复版) ===');
    console.log('📦 生成膳食计划请求:', { days, peopleCount, restrictions, weeklyBudget });

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

    const { data: rawRecipes, error: recipesError } = await query;

    if (recipesError) {
      console.error('❌ 查询菜品失败:', recipesError);
      return NextResponse.json(
        { error: '查询菜品失败', details: recipesError.message },
        { status: 500 }
      );
    }

    if (!rawRecipes || rawRecipes.length === 0) {
      return NextResponse.json(
        { error: '数据库中没有可用的菜品' },
        { status: 404 }
      );
    }

    // 🧹 数据清洗与去重：按中文名去重，避免重复导入导致同名菜品泛滥
    const uniqueRecipesMap = new Map<string, any>();
    rawRecipes.forEach(recipe => {
      // 优先使用中文名作为唯一键，如果没有则用英文名
      const key = recipe.name_zh || recipe.name_en;
      if (!key) return;
      
      // 如果还没存过，或者新记录信息更全（这里简单取 ID 较小的作为基准，或者保留任意一个）
      if (!uniqueRecipesMap.has(key)) {
        uniqueRecipesMap.set(key, recipe);
      }
    });
    
    const allRecipes = Array.from(uniqueRecipesMap.values());
    console.log(`✅ 查询到 ${rawRecipes.length} 条记录，去重后剩余 ${allRecipes.length} 道独特菜品`);

    // 🔧 辅助函数：检查 meal_type 是否匹配
    const matchesMealType = (mealType: any, targetType: string): boolean => {
      if (!mealType) return false;
      if (Array.isArray(mealType)) return mealType.includes(targetType);
      if (typeof mealType === 'string') return mealType === targetType || mealType.includes(targetType);
      return false;
    };

    // 1. 先按餐型分组（不考虑预算）
    const allBreakfasts = allRecipes.filter(r => matchesMealType(r.meal_type, 'breakfast'));
    const allLunches = allRecipes.filter(r => matchesMealType(r.meal_type, 'lunch'));
    const allDinners = allRecipes.filter(r => matchesMealType(r.meal_type, 'dinner'));

    // 2. 预算过滤逻辑优化
    let filteredRecipes = allRecipes;
    let budgetDebugInfo = '未启用预算过滤';
    
    if (weeklyBudget && weeklyBudget > 0) {
      const avgBudgetPerMeal = (weeklyBudget / (days * 3)) * peopleCount;
      // 放宽限制：0.3倍 - 2.0倍，或者更宽松，避免早餐太便宜被过滤掉
      const budgetMin = avgBudgetPerMeal * 0.3; 
      const budgetMax = avgBudgetPerMeal * 2.0; 
      
      budgetDebugInfo = `预算范围 RM${budgetMin.toFixed(2)} - RM${budgetMax.toFixed(2)} (平均: RM${avgBudgetPerMeal.toFixed(2)})`;

      filteredRecipes = allRecipes.filter(r => {
        const cost = r.estimated_cost || 0;
        // 关键修复：如果菜品价格为0（未录入），也保留，避免被误杀
        if (cost === 0) return true;
        return cost >= budgetMin && cost <= budgetMax;
      });

      // 🚨 紧急救援：如果过滤后早餐太少（小于7道），强制把所有便宜的早餐加回来
      const filteredBreakfasts = filteredRecipes.filter(r => matchesMealType(r.meal_type, 'breakfast'));
      if (filteredBreakfasts.length < 7) {
        console.log('⚠️ 预算过滤后早餐太少，强制召回所有早餐');
        budgetDebugInfo += ' | 触发早餐召回机制';
        const missingBreakfasts = allBreakfasts.filter(b => !filteredRecipes.find(fr => fr.id === b.id));
        filteredRecipes = [...filteredRecipes, ...missingBreakfasts];
      }
    }

    // 3. 最终分组
    const breakfasts = filteredRecipes.filter(r => matchesMealType(r.meal_type, 'breakfast'));
    const lunches = filteredRecipes.filter(r => matchesMealType(r.meal_type, 'lunch'));
    const dinners = filteredRecipes.filter(r => matchesMealType(r.meal_type, 'dinner'));
    const snacks = filteredRecipes.filter(r => matchesMealType(r.meal_type, 'snack'));

    // 收集调试日志
    const debugLogs: string[] = [];
    debugLogs.push(`🚀 API版本: v2.2 (强制多样性修复版)`);
    debugLogs.push(`📊 统计: 总菜品 ${allRecipes.length}, 过滤后 ${filteredRecipes.length}`);
    debugLogs.push(`🍳 早餐: 原始 ${allBreakfasts.length} -> 最终 ${breakfasts.length}`);
    debugLogs.push(`💰 预算: ${budgetDebugInfo}`);
    debugLogs.push(`📋 最终早餐列表: ${breakfasts.map(r => r.name_zh).join(', ')}`);

    console.log(debugLogs.join('\n'));

    // 随机打乱函数
    const shuffle = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // 🔒 改进的选择算法：一道菜最多出现2次 + 避免连续重复
    const selectRecipe = (
      availableRecipes: any[],
      usedRecipes: Map<number, number>,
      globalUsedRecipes: Set<number>,  // 全局已用完的菜品（出现过2次的）
      recentRecipeIds: number[],  // 最近N餐使用的菜品ID
      maxUsePerWeek: number = 2
    ): any | null => {
      if (availableRecipes.length === 0) {
        console.error('❌ 没有可用的菜品');
        return null;
      }

      // 🚫 过滤出可用的菜品：
      // 1) 未达到使用上限 
      // 2) 不在全局黑名单中
      // 3) 不在最近3餐中（避免连续重复）
      const selectableRecipes = availableRecipes.filter(recipe => {
        const useCount = usedRecipes.get(recipe.id) || 0;
        const isBlacklisted = globalUsedRecipes.has(recipe.id);
        const recentlyUsed = recentRecipeIds.includes(recipe.id);
        return useCount < maxUsePerWeek && !isBlacklisted && !recentlyUsed;
      });

      // 备选方案1：如果没有符合的，只检查周上限（放宽最近3餐限制）
      let finalCandidates = selectableRecipes;
      if (finalCandidates.length === 0) {
        console.warn('⚠️ 无符合条件的菜品，放宽"最近3餐"限制');
        finalCandidates = availableRecipes.filter(recipe => {
          const useCount = usedRecipes.get(recipe.id) || 0;
          const isBlacklisted = globalUsedRecipes.has(recipe.id);
          return useCount < maxUsePerWeek && !isBlacklisted;
        });
      }

      // 备选方案2：如果还是没有，返回 null
      if (finalCandidates.length === 0) {
        console.warn('⚠️ 所有可用菜品都已达到2次上限，无法继续选择');
        return null;
      }

      // 优先选择使用次数最少的菜品
      const minUseCount = Math.min(
        ...finalCandidates.map(r => usedRecipes.get(r.id) || 0)
      );
      const leastUsedRecipes = finalCandidates.filter(
        r => (usedRecipes.get(r.id) || 0) === minUseCount
      );

      // 🎲 从使用次数最少的菜品中随机选择（增加多样性）
      const randomPool = leastUsedRecipes.slice(0, Math.min(5, leastUsedRecipes.length));
      const selected = randomPool[Math.floor(Math.random() * randomPool.length)];
      
      // 更新使用计数
      const newCount = (usedRecipes.get(selected.id) || 0) + 1;
      usedRecipes.set(selected.id, newCount);
      
      // 🔒 如果达到2次上限，加入全局黑名单
      if (newCount >= maxUsePerWeek) {
        globalUsedRecipes.add(selected.id);
        console.log(`🔒 菜品 "${selected.name_zh}" 已达到${maxUsePerWeek}次上限，加入黑名单`);
      }
      
      return selected;
    };

    // 生成膳食计划
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealPlan = [];

    // 随机打乱菜品，增加随机性
    const shuffledBreakfasts = shuffle(breakfasts);
    const shuffledLunches = shuffle(lunches);
    const shuffledDinners = shuffle(dinners);

    // 跟踪每道菜的使用次数
    const breakfastUsage = new Map<number, number>();
    const lunchUsage = new Map<number, number>();
    const dinnerUsage = new Map<number, number>();

    // 🔒 全局黑名单：已经出现2次的菜品ID集合（绝对不能再选）
    const globalBreakfastBlacklist = new Set<number>();
    const globalLunchBlacklist = new Set<number>();
    const globalDinnerBlacklist = new Set<number>();

    // 🆕 追踪最近3餐的菜品ID（避免连续重复）
    const recentBreakfastIds: number[] = [];
    const recentLunchIds: number[] = [];
    const recentDinnerIds: number[] = [];
    const RECENT_MEALS_WINDOW = 3; // 检查最近3餐

    for (let i = 0; i < days; i++) {
      const day = dayNames[i % 7];
      
      console.log(`\n📅 === 生成第 ${i + 1} 天 (${day}) 的膳食 ===`);
      console.log(`   早餐黑名单: ${Array.from(globalBreakfastBlacklist).join(', ') || '无'}`);
      console.log(`   最近早餐: ${recentBreakfastIds.join(', ') || '无'}`);
      
      // 🔒 严格限制：一道菜最多2次，用完就从候选中永久移除，且避免连续3餐重复
      const breakfast = selectRecipe(
        shuffledBreakfasts, 
        breakfastUsage, 
        globalBreakfastBlacklist, 
        recentBreakfastIds,  // 🆕 传入最近使用的ID
        2
      );
      
      if (breakfast) {
        console.log(`   ✅ 选中早餐: ${breakfast.name_zh} (ID: ${breakfast.id}, 当前使用: ${breakfastUsage.get(breakfast.id) || 0}次)`);
      }
      const lunch = selectRecipe(
        shuffledLunches, 
        lunchUsage, 
        globalLunchBlacklist, 
        recentLunchIds,  // 🆕 传入最近使用的ID
        2
      );
      const dinner = selectRecipe(
        shuffledDinners, 
        dinnerUsage, 
        globalDinnerBlacklist, 
        recentDinnerIds,  // 🆕 传入最近使用的ID
        2
      );

      // 🆕 更新最近使用记录
      if (breakfast) {
        recentBreakfastIds.push(breakfast.id);
        if (recentBreakfastIds.length > RECENT_MEALS_WINDOW) {
          recentBreakfastIds.shift(); // 移除最旧的
        }
      }
      if (lunch) {
        recentLunchIds.push(lunch.id);
        if (recentLunchIds.length > RECENT_MEALS_WINDOW) {
          recentLunchIds.shift();
        }
      }
      if (dinner) {
        recentDinnerIds.push(dinner.id);
        if (recentDinnerIds.length > RECENT_MEALS_WINDOW) {
          recentDinnerIds.shift();
        }
      }

      // 如果某餐没有可用菜品，使用后备方案或跳过
      if (!breakfast) {
        console.warn(`⚠️ Day ${i + 1} 早餐：所有菜品已用完，使用后备方案`);
      }
      if (!lunch) {
        console.warn(`⚠️ Day ${i + 1} 午餐：所有菜品已用完，使用后备方案`);
      }
      if (!dinner) {
        console.warn(`⚠️ Day ${i + 1} 晚餐：所有菜品已用完，使用后备方案`);
      }

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
            estimated_cost: breakfast.estimated_cost,
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
            estimated_cost: lunch.estimated_cost,
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
            estimated_cost: dinner.estimated_cost,
          } : null,
        },
      });
    }

    // 输出使用统计
    console.log('📊 菜品使用统计:');
    console.log('早餐:', Array.from(breakfastUsage.entries()).map(([id, count]) => 
      `${shuffledBreakfasts.find(r => r.id === id)?.name_zh}(${count}次)`
    ).join(', '));
    console.log('午餐:', Array.from(lunchUsage.entries()).map(([id, count]) => 
      `${shuffledLunches.find(r => r.id === id)?.name_zh}(${count}次)`
    ).join(', '));
    console.log('晚餐:', Array.from(dinnerUsage.entries()).map(([id, count]) => 
      `${shuffledDinners.find(r => r.id === id)?.name_zh}(${count}次)`
    ).join(', '));

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
            avg_price_per_unit
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

        // 计算购物清单总费用
        const totalCost = shoppingList.reduce((sum, item) => sum + (item.estimated_price || 0), 0);
        console.log(`✅ 生成了 ${shoppingList.length} 项购物清单，预估总费用: RM ${totalCost.toFixed(2)}`);
        
        // 如果有预算限制，检查是否超预算
        if (weeklyBudget && weeklyBudget > 0) {
          const budgetDiff = totalCost - weeklyBudget;
          if (budgetDiff > 0) {
            console.warn(`⚠️ 购物清单超出预算 RM ${budgetDiff.toFixed(2)}`);
          } else {
            console.log(`✅ 购物清单在预算范围内，节省 RM ${Math.abs(budgetDiff).toFixed(2)}`);
          }
        }
      }
    }

    return NextResponse.json({
      plan: mealPlan,
      shopping_list: shoppingList,
      summary: {
        total_items: shoppingList.length,
        total_cost: shoppingList.reduce((sum, item) => sum + (item.estimated_price || 0), 0),
        weekly_budget: weeklyBudget || null,
        people_count: peopleCount,
        days: days,
      },
      // 🐛 暴露调试信息给前端
      debug: {
        version: 'v2.2',
        logs: debugLogs,
        breakfast_count: breakfasts.length,
        breakfast_names: breakfasts.map(r => r.name_zh)
      }
    });

  } catch (error: any) {
    console.error('❌ 生成膳食计划错误:', error);
    return NextResponse.json(
      { error: '生成膳食计划失败', details: error.message },
      { status: 500 }
    );
  }
}

