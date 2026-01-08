@echo off
chcp 65001 > nul
echo ========================================
echo   MYMeal AI - 自动启动脚本 (Windows)
echo ========================================
echo.

:: 检查 Node.js 是否安装
echo [1/5] 检查 Node.js 环境...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

node --version
echo ✅ Node.js 已安装
echo.

:: 检查是否在正确的目录
if not exist "package.json" (
    echo ❌ 错误: 未找到 package.json 文件
    echo 请确保在项目根目录运行此脚本
    pause
    exit /b 1
)

:: 检查 node_modules 是否存在
echo [2/5] 检查项目依赖...
if not exist "node_modules" (
    echo ⏳ 首次运行，正在安装依赖包...
    echo 这可能需要几分钟时间，请耐心等待...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已安装
)
echo.

:: 检查环境变量文件
echo [3/5] 检查环境变量配置...
if not exist ".env.local" (
    echo ⚠️  警告: 未找到 .env.local 文件
    if exist ".env.local.example" (
        echo 📝 正在创建 .env.local 文件...
        copy ".env.local.example" ".env.local" >nul
        echo.
        echo ⚠️  重要提示:
        echo    请先编辑 .env.local 文件，填入你的 Supabase 配置
        echo    然后重新运行此脚本
        echo.
        echo 按任意键打开 .env.local 文件...
        pause >nul
        notepad .env.local
        exit /b 0
    ) else (
        echo ❌ 错误: 未找到 .env.local.example 模板文件
        pause
        exit /b 1
    )
) else (
    echo ✅ 环境变量配置已存在
)
echo.

:: 检查 .env.local 是否已配置
findstr /C:"your_supabase" .env.local >nul
if %errorlevel% equ 0 (
    echo ⚠️  检测到 .env.local 可能未正确配置
    echo.
    set /p confirm="是否继续启动? (y/n): "
    if /i not "%confirm%"=="y" (
        echo 按任意键打开 .env.local 进行编辑...
        pause >nul
        notepad .env.local
        exit /b 0
    )
)

:: 清理旧的构建缓存（可选）
echo [4/5] 准备启动环境...
if exist ".next" (
    echo 清理旧的构建缓存...
    rmdir /s /q ".next" 2>nul
)
echo ✅ 环境准备完成
echo.

:: 启动开发服务器
echo [5/5] 启动开发服务器...
echo.
echo ========================================
echo   🚀 服务器启动中...
echo   访问地址: http://localhost:3000
echo ========================================
echo.
echo 按 Ctrl+C 停止服务器
echo.
echo ⏳ 等待服务器启动...
echo.

:: 启动服务器并等待其准备就绪
start /b cmd /c "timeout /t 3 >nul && start http://localhost:3000"

:: 启动开发服务器（前台运行以显示日志）
npm run dev

