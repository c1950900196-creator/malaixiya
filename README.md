# MYMeal AI - 马来西亚智能膳食计划系统

> 利用人工智能为马来西亚用户生成个性化的7天膳食计划

## 📋 项目概述

MYMeal AI 是一个基于 Next.js 和 Supabase 开发的智能膳食计划系统，专为马来西亚用户设计。系统根据用户的健康状况、饮食偏好和预算，使用 AI 算法生成符合本地饮食习惯的个性化食谱。

### ✨ 核心功能

- **用户档案管理**
  - 输入饮食限制（清真、素食、糖尿病等）
  - 设定每周预算（RM50 - RM500）
  - 设定健康目标（减重、增肌、保持）

- **AI 膳食规划引擎**
  - 生成包含早餐、午餐、晚餐的 7 天计划
  - 使用马来西亚本地食材和菜肴（Nasi Lemak, Laksa 等）
  - 计算营养价值（卡路里、蛋白质、碳水、脂肪、糖）
  - 基于内容过滤 (Content-based Filtering) + 约束满足问题 (CSP) 算法

- **食谱数据库**
  - 包含 100-150 道马来西亚特色食谱
  - 完整的烹饪步骤和本地食材名称
  - 详细的营养数据分析

- **附加功能**
  - 自动生成购物清单
  - 导出 PDF 格式的膳食计划
  - 营养摘要仪表盘
  - 替换菜肴功能

## 🛠 技术栈

### 前端
- **Next.js 14** - React 框架 (App Router)
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Zustand** - 状态管理
- **React Hook Form** + **Zod** - 表单验证
- **Recharts** - 数据可视化
- **Lucide React** - 图标库

### 后端
- **Supabase** - Backend-as-a-Service
  - PostgreSQL 数据库
  - 实时订阅
  - 行级安全 (RLS)
  - 身份认证

### AI 算法
- 基于内容的过滤 (Content-based Filtering)
- 约束满足问题 (CSP) 求解
- 营养平衡算法

## ⚠️ 使用前必读

**本应用需要先配置 Supabase 和豆包 API 才能使用！**

### 📋 配置步骤

#### 1️⃣ 配置 Supabase（必须，约10分钟）

1. **创建 Supabase 项目**
   - 访问 [https://supabase.com](https://supabase.com) 注册并登录
   - 点击 "New Project" 创建新项目
   - 记下项目的 URL 和 API Keys

2. **获取 API 密钥**
   - 在 Supabase Dashboard → Settings → API
   - 找到 "Project URL"（类似 `https://xxx.supabase.co`）
   - 切换到 **"Legacy anon, service_role API keys"** 标签
   - 复制 `anon` 和 `service_role` 两个 JWT 密钥

3. **配置环境变量**
   - 复制 `.env.local.example` 为 `.env.local`
   - 填入你的 Supabase 配置：
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...你的anon密钥
     SUPABASE_SERVICE_ROLE_KEY=eyJhbG...你的service_role密钥
     ```

4. **初始化数据库**
   - 在 Supabase Dashboard → SQL Editor
   - 依次执行以下 SQL 文件：
     1. `supabase/schema.sql`（创建表结构）
     2. `supabase/seed-recipes.sql`（导入食谱数据）

5. **启用匿名登录**
   - 在 Supabase Dashboard → Authentication → Providers
   - 找到 "Anonymous Sign-ins" 并启用
   - 点击 Save 保存

#### 2️⃣ 配置豆包 AI（必须）

豆包 AI 用于智能生成购物清单。在 `.env.local` 中添加：

```env
DOUBAO_API_KEY=你的豆包API密钥
DOUBAO_MODEL=你的模型名称
```

---

## 🚀 快速启动

配置完成后，有两种启动方式：

### 方式一：一键启动脚本（推荐）

**Windows 用户**：双击 `start.bat`

**macOS 用户**：双击 `start.command`

**Linux 用户**：运行 `./start.sh`

启动脚本会自动：
- ✅ 检查 Node.js 环境
- ✅ 安装项目依赖
- ✅ 启动开发服务器（默认端口 3002）
- ✅ 自动打开浏览器

### 方式二：手动启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3002](http://localhost:3002) 开始使用！

---

## 🔧 常见问题

### Q1：点击"生成膳食计划"没有反应？
**A**：请检查：
1. 是否已配置 Supabase（查看 `.env.local` 文件）
2. 是否已执行数据库初始化脚本
3. 是否启用了 Supabase 匿名登录
4. 打开浏览器控制台查看错误信息

### Q2：购物清单为空？
**A**：请确保：
1. 已配置豆包 API（`DOUBAO_API_KEY` 和 `DOUBAO_MODEL`）
2. 已成功生成膳食计划
3. 豆包 API 密钥有效且有足够额度

### Q3：启动脚本没有反应？
**A**：
- **macOS 用户**：请双击 `start.command` 而不是 `start.sh`
- **Windows 用户**：右键以管理员身份运行 `start.bat`
- 或者手动运行 `npm install && npm run dev`

### Q4：如何修改端口？
**A**：编辑启动脚本，将 `PORT=3002` 改为你想要的端口号

### Q5：如何重新生成膳食计划？
**A**：返回首页重新填写并提交个人档案即可

## 📁 项目结构

```
malaysia-meal-planner/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页（用户档案设置）
│   │   ├── dashboard/          # 仪表板页面
│   │   ├── shopping-list/      # 购物清单页面
│   │   └── analytics/          # 营养分析页面
│   ├── components/             # React 组件
│   │   ├── ui/                 # 基础 UI 组件
│   │   ├── layout/             # 布局组件
│   │   ├── profile/            # 用户档案组件
│   │   ├── meal-plan/          # 膳食计划组件
│   │   ├── shopping/           # 购物清单组件
│   │   └── analytics/          # 分析图表组件
│   ├── lib/                    # 工具函数
│   │   ├── supabase.ts         # Supabase 客户端
│   │   ├── utils.ts            # 通用工具函数
│   │   ├── ai-recommendation.ts # AI 推荐算法
│   │   └── pdf-export.ts       # PDF 导出功能
│   ├── store/                  # Zustand 状态管理
│   │   ├── userStore.ts        # 用户状态
│   │   └── mealPlanStore.ts    # 膳食计划状态
│   └── types/                  # TypeScript 类型定义
│       └── database.types.ts   # 数据库类型
├── supabase/                   # Supabase 相关文件
│   ├── schema.sql              # 数据库架构
│   └── seed-recipes.sql        # 食谱种子数据
├── public/                     # 静态资源
├── tailwind.config.js          # Tailwind 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 项目依赖
```

## 🗃️ 数据库设计

### 核心表结构

- **user_profiles** - 用户档案
- **dietary_restrictions** - 饮食限制
- **recipes** - 食谱
- **recipe_nutrition** - 营养信息
- **ingredients** - 食材
- **recipe_ingredients** - 食谱-食材关联
- **cooking_steps** - 烹饪步骤
- **meal_plans** - 膳食计划
- **meal_plan_details** - 膳食计划详情
- **shopping_lists** - 购物清单
- **shopping_list_items** - 购物清单项目

详细的 ER 图和表关系请参考 `supabase/schema.sql`

## 🤖 AI 推荐算法

### 算法原理

系统使用混合推荐算法：

1. **基于内容的过滤 (Content-based Filtering)**
   - 根据食谱的营养成分、价格、菜系类型等特征计算匹配度
   - 考虑用户的饮食限制和健康目标

2. **约束满足问题 (CSP)**
   - 预算约束：确保每周总成本在用户预算内
   - 营养约束：满足每日热量和宏量营养素目标
   - 多样性约束：避免短期内重复相同菜肴

3. **评分算法**
   ```
   总分 = 热量匹配度(30%) + 饮食限制(40%) + 预算匹配(15%) + 用户偏好(10%) + 餐型匹配(5%)
   ```

### 核心函数

- `calculateRecipeScore()` - 计算食谱评分
- `generateWeeklyMealPlan()` - 生成 7 天计划
- `suggestAlternativeRecipes()` - 推荐替换菜肴
- `checkNutritionalBalance()` - 营养平衡检查

详见 `src/lib/ai-recommendation.ts`

## 🎨 设计规范

### 组件化开发

- ✅ 所有 UI 拆分为独立、可复用组件
- ✅ 严禁使用内联 `style` 属性
- ✅ 所有样式使用 Tailwind CSS Classes
- ✅ 逻辑与界面分离，使用 React Hooks

### 代码规范

- TypeScript 严格模式
- ESLint + Prettier 代码格式化
- 组件命名：PascalCase
- 文件命名：kebab-case.tsx

## 🚀 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 自动部署完成

### 手动部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题，请联系项目维护者。

---

**Made with ❤️ for Malaysia**

