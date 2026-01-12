#!/bin/bash

# 上传代码到 GitHub 的自动化脚本
# 使用方法：双击此文件即可执行

echo "🚀 开始准备上传代码到 GitHub..."
echo ""

# 进入脚本所在目录
cd "$(dirname "$0")"
echo "📁 当前目录: $(pwd)"
echo ""

# 检查是否已初始化 git
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    echo "✅ Git 仓库初始化完成"
else
    echo "✅ Git 仓库已存在"
fi

echo ""
echo "📝 添加所有文件到 Git..."
git add .

echo ""
echo "💾 提交更改..."
git commit -m "Initial commit: Malaysia Meal Planner"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  重要：接下来需要连接到 GitHub 仓库"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "请按照以下步骤操作："
echo ""
echo "1. 访问 https://github.com 并登录"
echo "2. 点击右上角 '+' → 'New repository'"
echo "3. 输入仓库名称（例如：malaysia-meal-planner）"
echo "4. 选择 'Public'（免费用户只能创建公开仓库）"
echo "5. 不要勾选 'Initialize this repository with a README'"
echo "6. 点击 'Create repository'"
echo ""
echo "创建完成后，GitHub 会显示一个页面，上面有仓库地址"
echo "例如：https://github.com/你的用户名/仓库名.git"
echo ""
read -p "请输入你的 GitHub 仓库地址（或按 Ctrl+C 取消）: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ 未输入仓库地址，操作已取消"
    exit 1
fi

echo ""
echo "🔗 连接到 GitHub 仓库..."
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"

echo ""
echo "📤 推送到 GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ 成功！代码已上传到 GitHub！"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "下一步："
    echo "1. 访问 https://vercel.com"
    echo "2. 用 GitHub 账号登录"
    echo "3. 点击 'Add New Project'"
    echo "4. 选择你刚才创建的仓库"
    echo "5. 添加环境变量并部署"
    echo ""
    echo "按任意键关闭窗口..."
    read -n 1
else
    echo ""
    echo "❌ 推送失败，可能的原因："
    echo "   - GitHub 仓库地址不正确"
    echo "   - 需要先登录 GitHub（运行: gh auth login）"
    echo "   - 或者需要输入 GitHub 用户名和密码"
    echo ""
    echo "💡 提示：如果提示需要认证，可以："
    echo "   1. 使用 GitHub CLI: gh auth login"
    echo "   2. 或者使用 Personal Access Token"
    echo ""
    echo "按任意键关闭窗口..."
    read -n 1
fi


