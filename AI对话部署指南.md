# Malaysia Meal Planner 部署指南（AI对话专用）

## 项目概况
- **项目类型**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Supabase (PostgreSQL + Auth)
- **部署平台**: Vercel（自动部署）
- **代码仓库**: https://github.com/c1950900196-creator/malaixiya.git

---

## 一键部署流程

### 1. 代码修改后推送到 GitHub
```bash
cd /Users/huhaotian/未命名文件夹/malaysia-meal-planner
git add -A
git commit -m "描述你的更改"
git push origin main
```

### 2. Vercel 自动部署
- 推送后 Vercel 会自动触发构建和部署（约 1-2 分钟）
- 无需手动操作
- 部署状态可在 Vercel Dashboard 查看

---

## 环境变量（Vercel 中配置）

```env
# Supabase 连接
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI（可选，用于 AI 推荐）
OPENAI_API_KEY=sk-xxxxx

# 应用 URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## 关键目录结构

```
malaysia-meal-planner/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── api/               # API 路由
│   │   │   ├── generate-meal-plan-db/  # 膳食计划生成 API（主要）
│   │   │   └── ...
│   │   ├── page.tsx           # 首页
│   │   └── shopping-list/     # 购物清单页面
│   ├── components/            # React 组件
│   ├── lib/                   # 工具函数
│   │   ├── supabase.ts       # Supabase 客户端
│   │   ├── pdf-export.ts     # PDF 导出
│   │   └── ...
│   ├── store/                 # Zustand 状态管理
│   └── types/                 # TypeScript 类型定义
├── supabase/                  # 数据库相关
│   ├── schema.sql            # 数据库表结构
│   ├── seed-recipes.sql      # 初始食谱数据
│   └── recipes-data-200.sql  # 更多食谱数据
├── package.json
└── vercel.json               # Vercel 配置
```

---

## 常用命令

### 本地开发
```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器 (http://localhost:3002)
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
```

### Git 操作
```bash
# 推送更新到线上
git add -A && git commit -m "更新说明" && git push origin main

# 查看提交历史
git log --oneline -10

# 回滚到上一个版本
git revert HEAD
git push origin main
```

---

## 数据库操作（Supabase）

### 登录 Supabase
1. 访问 https://app.supabase.com/
2. 进入项目 Dashboard

### 执行 SQL
1. 进入 SQL Editor
2. 粘贴 SQL 并执行

### 关键表
- `recipes` - 食谱数据
- `meal_plans` - 用户膳食计划
- `meal_plan_details` - 每日餐食详情
- `shopping_lists` - 购物清单
- `shopping_list_items` - 购物清单项目
- `ingredients` - 食材信息

---

## 故障排除

### 问题：部署后页面没更新
```bash
# 强制刷新浏览器缓存
Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
```

### 问题：构建失败
```bash
# 本地测试构建
npm run build

# 查看错误信息并修复
```

### 问题：Supabase 连接失败
1. 检查环境变量是否正确
2. 确认 Supabase 项目状态正常
3. 检查 RLS 策略

---

## 部署检查清单

- [ ] 代码已提交到 GitHub
- [ ] Vercel 构建成功（绿色状态）
- [ ] 页面可正常访问
- [ ] 用户登录功能正常
- [ ] 膳食计划生成正常
- [ ] 购物清单显示正常
- [ ] PDF 导出正常

---

## 重要提示

1. **每次 git push 后 Vercel 会自动部署**，无需手动触发
2. **环境变量修改**需要在 Vercel Dashboard 中进行
3. **数据库更改**需要在 Supabase Dashboard 执行 SQL
4. **敏感密钥**（Service Role Key）绝不能暴露在前端代码中
