#!/usr/bin/env node

/**
 * Supabase 配置检查脚本
 * 用于验证环境变量是否正确配置
 */

console.log('🔍 检查 Supabase 配置...\n');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer.trim());
    });
  });
}

async function checkConfig() {
  console.log('📋 请从 Supabase Dashboard 获取以下信息：');
  console.log('   1. 登录 https://supabase.com/dashboard');
  console.log('   2. 进入你的项目');
  console.log('   3. 点击 Settings → API\n');

  const supabaseUrl = await ask('请粘贴 Project URL (例如: https://xxx.supabase.co): ');
  const anonKey = await ask('请粘贴 anon public key: ');

  console.log('\n✅ 配置检查结果：\n');

  // 检查 URL 格式
  if (!supabaseUrl) {
    console.log('❌ Supabase URL 为空！');
  } else if (supabaseUrl.includes('/dashboard/')) {
    console.log('❌ Supabase URL 格式错误！');
    console.log(`   当前值: ${supabaseUrl}`);
    console.log('   这是 Dashboard URL，不是 Project URL！');
    console.log('   正确格式应该是: https://项目ID.supabase.co');
  } else if (supabaseUrl.match(/^https:\/\/[a-z0-9]+\.supabase\.co$/)) {
    console.log('✅ Supabase URL 格式正确！');
    console.log(`   ${supabaseUrl}`);
  } else {
    console.log('⚠️  Supabase URL 格式可能不正确');
    console.log(`   当前值: ${supabaseUrl}`);
    console.log('   请确认是否从 Settings → API → Project URL 复制');
  }

  // 检查 Key 格式
  if (!anonKey) {
    console.log('❌ Anon Key 为空！');
  } else if (anonKey.startsWith('eyJ')) {
    console.log('✅ Anon Key 格式正确！');
    console.log(`   ${anonKey.substring(0, 20)}...`);
  } else {
    console.log('⚠️  Anon Key 格式可能不正确');
    console.log('   应该是以 "eyJ" 开头的长字符串');
  }

  console.log('\n📝 下一步操作：');
  console.log('1. 在 Vercel Dashboard 中更新环境变量：');
  console.log(`   NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`);
  console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey.substring(0, 20)}...`);
  console.log('\n2. 在 Vercel 中重新部署项目');
  console.log('\n3. 确保 Supabase 已启用匿名登录：');
  console.log('   Authentication → Providers → Anonymous Sign-ins (打开)');

  rl.close();
}

checkConfig();



