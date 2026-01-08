# 🔍 检查豆包 API 配置

## ❌ 问题

膳食计划可以正常生成，但购物清单失败，显示 401 错误。

## 🔍 可能的原因

从你的截图看，可能存在以下问题：

### 1. API Endpoint URL 不完整

你的 `DOUBAO_API_ENDPOINT` 显示为：`https://ark.cn-beijing.volces.co...`

**可能不完整！** 正确的应该是：

```
https://ark.cn-beijing.volces.com/api/v3/chat/completions
```

**检查方法：**
1. 在 Vercel → Settings → Environment Variables
2. 找到 `DOUBAO_API_ENDPOINT`
3. 点击 **"Edit"** 或点击值字段
4. **确认完整的 URL**：
   - ✅ 应该是：`https://ark.cn-beijing.volces.com/api/v3/chat/completions`
   - ❌ 不应该是：`https://ark.cn-beijing.volces.co`（缺少 `/api/v3/chat/completions`）
   - ❌ 不应该是：`https://ark.cn-beijing.volces.com`（缺少 `/api/v3/chat/completions`）

### 2. API Key 格式问题

你的 `DOUBAO_API_KEY` 显示为：`Tmpoak9HWmhaV0UzTWpGbU5EbGtZMkZp...`

**检查格式：**
- 豆包 API Key 通常以 `sk-` 开头
- 或者是一个长字符串（Base64 编码的格式）
- **确保完整复制，没有空格或换行**

### 3. 环境变量检查缺失

我已经修复了代码，添加了环境变量检查。但是需要重新部署才能生效。

---

## ✅ 修复步骤

### 步骤 1：检查并更新 API Endpoint

1. **进入 Vercel → Settings → Environment Variables**

2. **找到 `DOUBAO_API_ENDPOINT`**

3. **点击 Edit 或值字段**

4. **确认值是否完整：**

   **正确的值应该是：**
   ```
   https://ark.cn-beijing.volces.com/api/v3/chat/completions
   ```

   **或者可能是：**
   ```
   https://ark.volces.com/api/v3/chat/completions
   ```

   **检查点：**
   - ✅ 以 `https://` 开头
   - ✅ 以 `/api/v3/chat/completions` 结尾
   - ✅ 中间是域名（`ark.cn-beijing.volces.com` 或 `ark.volces.com`）
   - ✅ 没有多余的空格或字符

5. **如果不完整，更新为完整值**

6. **保存**（确保勾选了三个环境）

### 步骤 2：验证 API Key

1. **找到 `DOUBAO_API_KEY`**

2. **点击 Edit 查看完整值**

3. **确认：**
   - ✅ Key 是完整的（没有截断）
   - ✅ 没有多余的空格
   - ✅ 没有换行
   - ✅ 格式正确（符合豆包 API 的要求）

### 步骤 3：重新部署（重要！）

**更新环境变量后，必须重新部署才能生效！**

1. 在 Vercel 项目页面
2. 点击 **"Deployments"** 标签
3. 找到最新的部署
4. 点击右侧的 **"..."** → **"Redeploy"**
5. 等待 2-3 分钟部署完成

---

## 🔍 验证配置

### 方法 1：在 Vercel 中查看

1. 在 Vercel → Settings → Environment Variables
2. 点击每个变量查看完整值（点击眼睛图标显示）
3. 确认：
   - `DOUBAO_API_ENDPOINT` = `https://ark.cn-beijing.volces.com/api/v3/chat/completions`（完整 URL）
   - `DOUBAO_API_KEY` = 完整的 API Key（没有截断）
   - `DOUBAO_MODEL` = `doubao-seed-1-6-lite-251015`

### 方法 2：查看 Vercel 日志

1. 在 Vercel 项目页面
2. 点击 **"Deployments"** → 选择最新部署
3. 查看 **"Functions"** 或 **"Logs"** 标签
4. 查找豆包 API 相关的日志：
   - 应该看到：`🔧 Using Doubao endpoint for shopping list: ...`
   - 如果没有看到，说明环境变量没有正确传递

---

## 💡 常见问题

### 问题 1：为什么膳食计划可以工作，但购物清单不行？

**可能原因：**
- 两个 API 路由的代码稍有不同
- 购物清单 API 缺少环境变量检查（已修复）
- 可能在某些情况下环境变量没有正确传递

**解决：**
- 我已经修复了代码，添加了环境变量检查
- 需要重新部署才能生效

### 问题 2：URL 看起来被截断了

**如果 URL 显示不完整：**
1. 点击值字段或 Edit 按钮
2. 查看完整值
3. 如果确实不完整，更新为完整 URL
4. 重新部署

### 问题 3：401 Unauthorized 错误

**可能原因：**
- API Key 无效或过期
- API Key 格式不正确
- API Endpoint 不正确
- 权限不足

**解决：**
1. 检查 API Key 是否正确
2. 检查 API Endpoint 是否完整
3. 确认 API Key 有正确的权限
4. 如果还是不行，尝试重新生成 API Key

---

## 🎯 快速检查清单

- [ ] `DOUBAO_API_ENDPOINT` 是完整的 URL（包含 `/api/v3/chat/completions`）
- [ ] `DOUBAO_API_KEY` 是完整的（没有截断）
- [ ] `DOUBAO_MODEL` 已设置
- [ ] 每个变量都勾选了三个环境（Production、Preview、Development）
- [ ] 重新部署了项目（更新环境变量后必须重新部署）

---

## ✅ 修复后的操作

1. **我已经修复了代码**（添加了环境变量检查）
2. **检查 API Endpoint 是否完整**（最重要！）
3. **检查 API Key 是否完整**
4. **推送到 GitHub**：
   ```bash
   cd "/Users/huhaotian/未命名文件夹/malaysia-meal-planner"
   git add .
   git commit -m "Fix: Add environment variable check for shopping list API"
   git push origin main
   ```
5. **Vercel 会自动重新部署**
6. **等待部署完成并测试**

---

## 🔧 如果还是不行

如果更新配置并重新部署后还是不行，请：

1. **查看 Vercel 日志**（Deployments → Functions → Logs）
2. **查看错误信息**（特别是 API 返回的错误详情）
3. **检查豆包 API 控制台**（确认 API Key 是否有效）
4. **尝试在豆包控制台手动测试 API**（确认配置是否正确）

告诉我检查结果，我可以继续帮你排查！

