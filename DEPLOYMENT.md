# 部署指南

本文档详细说明如何将 MYMeal AI 系统部署到生产环境。

## 目录

1. [Supabase 设置](#supabase-设置)
2. [环境变量配置](#环境变量配置)
3. [Vercel 部署](#vercel-部署)
4. [自托管部署](#自托管部署)
5. [数据库迁移](#数据库迁移)
6. [性能优化](#性能优化)
7. [故障排除](#故障排除)

---

## Supabase 设置

### 1. 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://app.supabase.com/)
2. 点击 "New Project"
3. 填写项目信息：
   - Project Name: `mymeal-ai`
   - Database Password: 设置强密码
   - Region: 选择最近的区域（推荐 Singapore）
4. 等待项目创建完成（约 2 分钟）

### 2. 初始化数据库架构

1. 进入 SQL Editor
2. 创建新查询
3. 复制 `supabase/schema.sql` 的内容并执行
4. 确认所有表创建成功

### 3. 导入食谱数据

1. 在 SQL Editor 中新建查询
2. 复制 `supabase/seed-recipes.sql` 的内容并执行
3. 验证数据导入成功：
   ```sql
   SELECT COUNT(*) FROM recipes;
   -- 应该返回约 100-150 条记录
   ```

### 4. 配置存储桶（可选）

如果需要上传食谱图片：

1. 进入 Storage
2. 创建新桶：`recipe-images`
3. 设置为公开访问
4. 配置 RLS 策略允许上传

### 5. 获取 API 密钥

1. 进入 Project Settings > API
2. 复制以下密钥：
   - Project URL
   - anon/public key
   - service_role key（保密！）

---

## 环境变量配置

### 开发环境 (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI (可选 - 用于增强 AI 功能)
OPENAI_API_KEY=sk-your-openai-api-key

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 生产环境

在生产环境中设置相同的环境变量，但使用生产 URL：

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## Vercel 部署

### 快速部署（推荐）

1. **连接 GitHub**
   - 将代码推送到 GitHub 仓库
   - 访问 [Vercel Dashboard](https://vercel.com/)
   - 点击 "Import Project"
   - 选择你的 GitHub 仓库

2. **配置项目**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **添加环境变量**
   - 在 Environment Variables 部分添加所有环境变量
   - 确保所有变量在 Production、Preview 和 Development 环境中都已设置

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约 2-3 分钟）
   - 访问你的生产 URL

### 自定义域名

1. 进入 Vercel 项目设置 > Domains
2. 添加自定义域名
3. 按照说明配置 DNS 记录
4. 等待 SSL 证书自动配置

### 持续部署

- 每次推送到 `main` 分支会自动部署到生产环境
- Pull Request 会创建预览部署
- 可以在 Vercel Dashboard 中回滚到任意历史版本

---

## 自托管部署

### 使用 Docker

1. **创建 Dockerfile**

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

2. **构建镜像**

```bash
docker build -t mymeal-ai .
```

3. **运行容器**

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your-url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  mymeal-ai
```

### 使用 PM2

1. **安装 PM2**

```bash
npm install -g pm2
```

2. **构建应用**

```bash
npm run build
```

3. **创建 ecosystem.config.js**

```javascript
module.exports = {
  apps: [{
    name: 'mymeal-ai',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

4. **启动应用**

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 数据库迁移

### 备份数据库

```bash
# 使用 Supabase CLI
supabase db dump -f backup.sql
```

### 恢复数据库

```bash
supabase db reset
psql -h db.your-project.supabase.co -U postgres -f backup.sql
```

### 版本控制

建议使用 Supabase Migrations 进行版本控制：

```bash
# 创建新迁移
supabase migration new add_new_table

# 应用迁移
supabase db push
```

---

## 性能优化

### 1. 图片优化

使用 Next.js Image 组件：

```tsx
import Image from 'next/image';

<Image
  src="/recipe.jpg"
  alt="Recipe"
  width={500}
  height={300}
  loading="lazy"
/>
```

### 2. 数据库索引

确保以下字段已创建索引（已在 schema.sql 中定义）：

- `recipes.meal_type` (GIN 索引)
- `meal_plans.user_id`
- `meal_plan_details.date`

### 3. 缓存策略

在 `next.config.js` 中配置：

```javascript
module.exports = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, stale-while-revalidate=86400',
        },
      ],
    },
  ],
}
```

### 4. 代码分割

使用动态导入：

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});
```

---

## 故障排除

### 常见问题

**1. Supabase 连接失败**

检查：
- 环境变量是否正确设置
- Supabase 项目是否处于活跃状态
- 防火墙是否阻止连接

**2. 构建失败**

```bash
# 清除缓存重新构建
rm -rf .next node_modules
npm install
npm run build
```

**3. 样式问题**

确保 Tailwind CSS 配置正确：

```bash
# 重新生成 Tailwind CSS
npx tailwindcss -i ./src/app/globals.css -o ./dist/output.css
```

**4. 数据库查询慢**

启用查询日志分析：

```sql
EXPLAIN ANALYZE SELECT * FROM recipes WHERE ...;
```

### 监控和日志

**Vercel 内置监控**
- 访问 Vercel Dashboard > Analytics
- 查看性能指标和错误日志

**Supabase 监控**
- Database > Logs
- 查看慢查询和错误

**自定义监控**

可集成 Sentry 进行错误追踪：

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

---

## 安全检查清单

- [ ] 所有环境变量已正确设置
- [ ] Service Role Key 仅用于服务端代码
- [ ] RLS 策略已正确配置
- [ ] CORS 设置仅允许可信域名
- [ ] SQL 注入防护已启用
- [ ] 敏感数据已加密
- [ ] HTTPS 已启用
- [ ] API 速率限制已配置

---

## 支持

如遇到部署问题，请：

1. 查看 [GitHub Issues](your-repo/issues)
2. 阅读 [Next.js 文档](https://nextjs.org/docs)
3. 参考 [Supabase 文档](https://supabase.com/docs)

---

**部署完成后别忘了测试所有功能！** ✅





