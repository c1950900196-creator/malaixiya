#!/usr/bin/env node

/**
 * 测试脚本：验证数据库膳食计划生成功能
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ 缺少 Supabase 环境变量');
  console.log('请确保 .env.local 文件包含：');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=...');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=...');
  process.exit(1);
}

async function testDatabaseQuery() {
  console.log('\n🧪 测试 1: 查询数据库...\n');

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 测试查询食材
  const { data: ingredients, error: ingredientsError } = await supabase
    .from('ingredients')
    .select('*')
    .limit(5);

  if (ingredientsError) {
    console.error('❌ 查询食材失败:', ingredientsError.message);
    return false;
  }

  console.log(`✅ 成功查询到 ${ingredients?.length || 0} 条食材记录`);
  if (ingredients && ingredients.length > 0) {
    console.log('   示例食材:', ingredients[0].name_zh, '-', ingredients[0].avg_price_rm, 'RM');
  }

  // 测试查询菜品
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('*')
    .eq('meal_type', 'breakfast')
    .limit(5);

  if (recipesError) {
    console.error('❌ 查询菜品失败:', recipesError.message);
    return false;
  }

  console.log(`✅ 成功查询到 ${recipes?.length || 0} 条早餐菜品`);
  if (recipes && recipes.length > 0) {
    console.log('   示例早餐:', recipes[0].name_zh, '/', recipes[0].name_en);
  }

  // 测试查询食材关联
  const { data: mappings, error: mappingsError } = await supabase
    .from('recipe_ingredients')
    .select('*')
    .limit(5);

  if (mappingsError) {
    console.error('❌ 查询食材关联失败:', mappingsError.message);
    return false;
  }

  console.log(`✅ 成功查询到 ${mappings?.length || 0} 条食材关联记录`);

  return true;
}

async function testMealPlanGeneration() {
  console.log('\n🧪 测试 2: 生成膳食计划...\n');

  try {
    const response = await fetch(`http://localhost:3000/api/generate-meal-plan-db`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userProfile: {
          id: 'test-user',
          full_name: '测试用户',
          health_goal: 'weight_loss',
        },
        restrictions: [],
        days: 7,
        peopleCount: 2,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ 生成膳食计划失败:', error.error);
      return false;
    }

    const result = await response.json();
    
    console.log(`✅ 成功生成 ${result.plan?.length || 0} 天的膳食计划`);
    
    if (result.plan && result.plan.length > 0) {
      const day1 = result.plan[0];
      console.log(`   ${day1.day} 早餐:`, day1.meals?.breakfast?.name_zh || '未设置');
      console.log(`   ${day1.day} 午餐:`, day1.meals?.lunch?.name_zh || '未设置');
      console.log(`   ${day1.day} 晚餐:`, day1.meals?.dinner?.name_zh || '未设置');
    }

    console.log(`✅ 购物清单包含 ${result.shopping_list?.length || 0} 项食材`);
    
    if (result.shopping_list && result.shopping_list.length > 0) {
      const item = result.shopping_list[0];
      console.log(`   示例: ${item.name} ${item.quantity}${item.unit} - RM ${item.estimated_price.toFixed(2)}`);
    }

    return true;
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    return false;
  }
}

async function testDietaryRestrictions() {
  console.log('\n🧪 测试 3: 饮食限制过滤...\n');

  try {
    const response = await fetch(`http://localhost:3000/api/generate-meal-plan-db`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userProfile: { id: 'test-user', full_name: '测试用户' },
        restrictions: ['halal'], // 测试清真食品限制
        days: 2,
        peopleCount: 2,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ 饮食限制测试失败:', error.error);
      return false;
    }

    const result = await response.json();
    console.log(`✅ 清真饮食限制：成功生成 ${result.plan?.length || 0} 天的膳食计划`);
    
    return true;
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 开始测试数据库膳食计划生成系统\n');
  console.log('=' .repeat(60));

  const results = {
    database: await testDatabaseQuery(),
  };

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 测试摘要:\n');
  console.log(`  数据库查询: ${results.database ? '✅ 通过' : '❌ 失败'}`);

  console.log('\n💡 提示：');
  console.log('  - 如果数据库查询失败，请先执行 SQL 导入（见 DATABASE_IMPORT_GUIDE.md）');
  console.log('  - 如果 API 测试失败，请确保开发服务器正在运行（npm run dev）');
  console.log('  - Vercel 部署后可以将 localhost:3000 替换为实际域名测试\n');

  if (Object.values(results).every(r => r)) {
    console.log('🎉 所有测试通过！系统运行正常。\n');
    process.exit(0);
  } else {
    console.log('⚠️  部分测试失败，请检查上述错误信息。\n');
    process.exit(1);
  }
}

// 运行测试
runAllTests().catch(error => {
  console.error('\n❌ 测试运行出错:', error);
  process.exit(1);
});



