# 🚀 快速开始指南

5 分钟快速部署 MYMeal AI 系统！

## 步骤 1: 克隆并安装 (2分钟)

```bash
# 克隆项目
git clone <your-repo-url>
cd malaysia-meal-planner

# 安装依赖
npm install
```

## 步骤 2: 设置 Supabase (2分钟)

1. 访问 https://app.supabase.com/ 创建账户
2. 创建新项目，选择 Singapore 区域
3. 等待项目初始化完成
4. 进入 SQL Editor，执行以下文件：
   - `supabase/schema.sql` （创建表）
   - `supabase/seed-recipes.sql` （导入食谱）

## 步骤 3: 配置环境变量 (1分钟)

```bash
# 复制环境变量模板
cp .env.local.example .env.local

# 编辑 .env.local，填入你的 Supabase 信息
# 在 Supabase Dashboard > Settings > API 找到这些值
```

```.env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

## 步骤 4: 启动应用 (10秒)

```bash
npm run dev
```

打开浏览器访问：http://localhost:3000

## ✅ 完成！

现在你可以：
- 创建用户档案
- 生成 7 天膳食计划
- 查看营养分析
- 导出购物清单

## 🎨 示例用户档案

快速测试用的示例配置：

- **姓名**: 张伟
- **年龄**: 30
- **性别**: 男
- **体重**: 70 kg
- **身高**: 175 cm
- **健康目标**: 增肌
- **每周预算**: RM 250
- **活动水平**: 中度活动
- **饮食限制**: 清真 (Halal)

填写这些信息后点击"生成膳食计划"即可！

## ❓ 遇到问题？

### 数据库连接失败

```bash
# 检查环境变量
cat .env.local

# 确保 Supabase URL 和 Key 正确
```

### 样式不显示

```bash
# 清除缓存重新启动
rm -rf .next
npm run dev
```

### 端口被占用

```bash
# 使用其他端口
PORT=3001 npm run dev
```

## 📚 下一步

- 阅读完整 [README.md](./README.md)
- 查看 [部署指南](./DEPLOYMENT.md)
- 浏览代码结构了解架构

---

**祝你使用愉快！🎉**





