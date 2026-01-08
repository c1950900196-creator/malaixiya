#!/usr/bin/env node

/**
 * MYMeal AI - 跨平台自动启动脚本 (Node.js)
 * 支持 Windows, macOS, Linux
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 颜色定义
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
  console.log('\n========================================');
  console.log(`  ${message}`);
  console.log('========================================\n');
}

function checkCommand(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  header('MYMeal AI - 自动启动脚本');

  // 步骤 1: 检查 Node.js
  log('[1/5] 检查 Node.js 环境...', 'blue');
  if (!checkCommand('node')) {
    log('❌ 错误: 未检测到 Node.js', 'red');
    log('请先安装 Node.js: https://nodejs.org/');
    process.exit(1);
  }
  const nodeVersion = execSync('node --version').toString().trim();
  console.log(nodeVersion);
  log('✅ Node.js 已安装', 'green');

  // 检查是否在正确的目录
  if (!fs.existsSync('package.json')) {
    log('❌ 错误: 未找到 package.json 文件', 'red');
    log('请确保在项目根目录运行此脚本');
    process.exit(1);
  }

  // 步骤 2: 检查依赖
  log('\n[2/5] 检查项目依赖...', 'blue');
  if (!fs.existsSync('node_modules')) {
    log('⏳ 首次运行，正在安装依赖包...', 'yellow');
    log('这可能需要几分钟时间，请耐心等待...\n');
    try {
      execSync('npm install', { stdio: 'inherit' });
      log('✅ 依赖安装完成', 'green');
    } catch (error) {
      log('❌ 依赖安装失败', 'red');
      process.exit(1);
    }
  } else {
    log('✅ 依赖已安装', 'green');
  }

  // 步骤 3: 检查环境变量
  log('\n[3/5] 检查环境变量配置...', 'blue');
  if (!fs.existsSync('.env.local')) {
    log('⚠️  警告: 未找到 .env.local 文件', 'yellow');
    if (fs.existsSync('.env.local.example')) {
      log('📝 正在创建 .env.local 文件...');
      fs.copyFileSync('.env.local.example', '.env.local');
      console.log('');
      log('⚠️  重要提示:', 'yellow');
      log('   请先编辑 .env.local 文件，填入你的 Supabase 配置');
      log('   然后重新运行此脚本\n');
      
      const answer = await question('按回车键继续，或输入 q 退出: ');
      rl.close();
      
      if (answer.toLowerCase() === 'q') {
        process.exit(0);
      }
      
      log('\n请编辑 .env.local 文件后重新运行启动脚本', 'yellow');
      process.exit(0);
    } else {
      log('❌ 错误: 未找到 .env.local.example 模板文件', 'red');
      rl.close();
      process.exit(1);
    }
  } else {
    log('✅ 环境变量配置已存在', 'green');
  }

  // 检查配置是否完整
  const envContent = fs.readFileSync('.env.local', 'utf8');
  if (envContent.includes('your_supabase')) {
    log('\n⚠️  检测到 .env.local 可能未正确配置', 'yellow');
    const confirm = await question('是否继续启动? (y/n): ');
    
    if (confirm.toLowerCase() !== 'y') {
      log('\n请编辑 .env.local 文件后重新运行启动脚本', 'yellow');
      rl.close();
      process.exit(0);
    }
  }

  rl.close();

  // 步骤 4: 清理缓存
  log('\n[4/5] 准备启动环境...', 'blue');
  if (fs.existsSync('.next')) {
    log('清理旧的构建缓存...');
    fs.rmSync('.next', { recursive: true, force: true });
  }
  log('✅ 环境准备完成', 'green');

  // 步骤 5: 启动服务器
  log('\n[5/5] 启动开发服务器...', 'blue');
  console.log('');
  header('🚀 服务器启动中...\n  访问地址: http://localhost:3000');
  log('按 Ctrl+C 停止服务器\n', 'yellow');

  // 使用 spawn 启动开发服务器，保持输出
  const child = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe',
    shell: true,
  });

  let serverStarted = false;

  // 监听输出以检测服务器是否启动
  child.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(output);

    // 检测服务器启动成功的标志
    if (!serverStarted && (output.includes('Local:') || output.includes('localhost:3000') || output.includes('ready'))) {
      serverStarted = true;
      
      // 延迟打开浏览器
      setTimeout(() => {
        log('🌐 正在打开浏览器...', 'green');
        openBrowser('http://localhost:3000');
      }, 1500);
    }
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(data.toString());
  });

  child.on('error', (error) => {
    log(`❌ 启动失败: ${error.message}`, 'red');
    process.exit(1);
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      log(`\n服务器已停止 (退出码: ${code})`, 'yellow');
    } else {
      log('\n服务器已正常关闭', 'green');
    }
  });
}

// 打开浏览器函数
function openBrowser(url) {
  const { exec } = require('child_process');
  const platform = process.platform;

  let command;
  if (platform === 'darwin') {
    command = `open ${url}`;
  } else if (platform === 'win32') {
    command = `start ${url}`;
  } else {
    command = `xdg-open ${url} || gnome-open ${url}`;
  }

  exec(command, (error) => {
    if (error) {
      log('提示: 请手动打开浏览器访问 http://localhost:3000', 'yellow');
    }
  });
}

// 处理 Ctrl+C
process.on('SIGINT', () => {
  log('\n\n正在关闭服务器...', 'yellow');
  process.exit(0);
});

// 运行主函数
main().catch((error) => {
  log(`\n❌ 发生错误: ${error.message}`, 'red');
  process.exit(1);
});

