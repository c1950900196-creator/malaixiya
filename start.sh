#!/bin/bash

# MYMeal AI - 自动启动脚本 (macOS/Linux)

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "========================================"
echo "  MYMeal AI - 自动启动脚本"
echo "========================================"
echo ""

# 检查 Node.js 是否安装
echo -e "${BLUE}[1/5]${NC} 检查 Node.js 环境..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 错误: 未检测到 Node.js${NC}"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

node --version
echo -e "${GREEN}✅ Node.js 已安装${NC}"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误: 未找到 package.json 文件${NC}"
    echo "请确保在项目根目录运行此脚本"
    exit 1
fi

# 检查 node_modules 是否存在
echo -e "${BLUE}[2/5]${NC} 检查项目依赖..."
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⏳ 首次运行，正在安装依赖包...${NC}"
    echo "这可能需要几分钟时间，请耐心等待..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 依赖安装失败${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
else
    echo -e "${GREEN}✅ 依赖已安装${NC}"
fi
echo ""

# 检查环境变量文件
echo -e "${BLUE}[3/5]${NC} 检查环境变量配置..."
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  警告: 未找到 .env.local 文件${NC}"
    if [ -f ".env.local.example" ]; then
        echo "📝 正在创建 .env.local 文件..."
        cp .env.local.example .env.local
        echo ""
        echo -e "${YELLOW}⚠️  重要提示:${NC}"
        echo "   请先编辑 .env.local 文件，填入你的 Supabase 配置"
        echo "   然后重新运行此脚本"
        echo ""
        echo "按回车键打开 .env.local 文件进行编辑..."
        read
        
        # 尝试用不同的编辑器打开
        if command -v code &> /dev/null; then
            code .env.local
        elif command -v nano &> /dev/null; then
            nano .env.local
        elif command -v vim &> /dev/null; then
            vim .env.local
        else
            echo "请手动编辑 .env.local 文件"
        fi
        exit 0
    else
        echo -e "${RED}❌ 错误: 未找到 .env.local.example 模板文件${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ 环境变量配置已存在${NC}"
fi
echo ""

# 检查 .env.local 是否已配置
if grep -q "your_supabase" .env.local 2>/dev/null; then
    echo -e "${YELLOW}⚠️  检测到 .env.local 可能未正确配置${NC}"
    echo ""
    read -p "是否继续启动? (y/n): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "正在打开 .env.local 进行编辑..."
        if command -v code &> /dev/null; then
            code .env.local
        elif command -v nano &> /dev/null; then
            nano .env.local
        else
            echo "请手动编辑 .env.local 文件"
        fi
        exit 0
    fi
fi

# 清理旧的构建缓存（可选）
echo -e "${BLUE}[4/5]${NC} 准备启动环境..."
if [ -d ".next" ]; then
    echo "清理旧的构建缓存..."
    rm -rf .next 2>/dev/null
fi
echo -e "${GREEN}✅ 环境准备完成${NC}"
echo ""

# 启动开发服务器
echo -e "${BLUE}[5/5]${NC} 启动开发服务器..."
echo ""
echo "========================================"
echo -e "  ${GREEN}🚀 服务器启动中...${NC}"
echo "  访问地址: http://localhost:3000"
echo "========================================"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 在后台启动开发服务器
npm run dev &
SERVER_PID=$!

# 等待服务器启动
echo -e "${YELLOW}⏳ 等待服务器启动...${NC}"
sleep 3

# 自动打开浏览器
echo -e "${GREEN}🌐 正在打开浏览器...${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000
    elif command -v gnome-open &> /dev/null; then
        gnome-open http://localhost:3000
    fi
fi

# 等待服务器进程
wait $SERVER_PID

