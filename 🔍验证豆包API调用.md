# 🔍 验证豆包 API 调用

## 关键问题

既然 API Key 确认是正确的，我们需要验证：**膳食计划是否真的成功调用了豆包 API？**

## 验证步骤

### 步骤 1：查看 Vercel 日志中的膳食计划调用

1. 在 Vercel → 最新部署 → Logs 或 Runtime Logs
2. **查找膳食计划 API 的日志**：
   - 应该有：`🔧 Using Doubao endpoint: ...`
   - 应该有：`📥 Received response from Doubao`
   - 或者：`⚠️ AI generation failed, using local algorithm`

3. **如果看到**：
   - `⚠️ AI generation failed, using local algorithm` → 说明膳食计划也失败了，只是用了 fallback
   - `📥 Received response from Doubao` → 说明膳食计划真的成功了

### 步骤 2：重新生成一次膳食计划并查看日志

1. 访问网站：`https://malaixiya-1xr11111.vercel.app`
2. 刷新页面（清除缓存）
3. 填写表单并生成膳食计划
4. **同时打开浏览器控制台**（F12 → Console）
5. 查看是否有：`⚠️ AI generation failed, using local algorithm`

如果有这个警告，说明膳食计划也没用豆包 API，只是有 fallback 所以看起来"成功"了。

---

## 如果膳食计划也失败了

那么问题就是：**两个 API 路由都失败了，说明豆包 API 配置确实有问题。**

可能的原因：

### 1. API Key 在 Vercel 中的值不对

虽然你说 API Key 是对的，但可能：
- 复制时包含了隐藏字符（空格、换行）
- Vercel 中保存的值和你以为的值不一样

**验证方法：**
1. 在 Vercel → Settings → Environment Variables
2. 点击 `DOUBAO_API_KEY` 的 Edit
3. **全选（Cmd/Ctrl+A）**
4. **复制**
5. 粘贴到记事本查看是否有隐藏字符

### 2. API Key 格式问题

你的 API Key：`Tmpoak9HWmhaV0UzTWpGbU5EbGtZMkZp...`

这个格式确实不太常见。**可能需要额外的处理或不同的认证方式。**

**根据豆包文档，标准用法是：**
```python
api_key=os.getenv('ARK_API_KEY')
```

环境变量名是 `ARK_API_KEY`，而不是 `DOUBAO_API_KEY`。

但在我们的代码中，我们使用的是 `DOUBAO_API_KEY`。

---

## 如果只有购物清单失败

如果膳食计划真的成功了（在日志中看到 `📥 Received response from Doubao`），但购物清单失败，那问题可能是：

### 可能原因 1：购物清单的 prompt 太长

购物清单的 prompt 包含了所有菜谱名称：
```javascript
const recipeNames = mealPlan.map(m => m.recipe.name_zh || m.recipe.name_ms).join(', ');
```

如果 prompt 太长，可能：
- 超过了 API 的限制
- 导致认证失败

### 可能原因 2：购物清单的请求体太大

购物清单请求：
- `max_tokens: 3000`（购物清单）
- `max_tokens: 1500`（膳食计划）

购物清单的 max_tokens 更大，可能导致问题。

### 可能原因 3：并发调用限制

购物清单是在膳食计划生成后立即调用的（后台异步）。

如果豆包 API 有并发限制或频率限制，可能导致第二个请求（购物清单）失败。

---

## 解决方案

### 方案 1：确认膳食计划是否真的成功

**立即执行：**
1. 生成一次膳食计划
2. 查看浏览器控制台
3. 查看 Vercel 日志
4. 确认是否真的调用了豆包 API

### 方案 2：测试简化的购物清单请求

我可以修改购物清单 API，发送一个最简单的测试请求：

```typescript
// 测试用的简单 prompt
const testPrompt = "生成一个简单的购物清单";
```

这样可以排除 prompt 太长的问题。

### 方案 3：检查环境变量在运行时的实际值

我已经在代码中添加了日志：
```typescript
console.log('🔧 API Key length:', process.env.DOUBAO_API_KEY?.length || 0);
console.log('🔧 API Key prefix:', process.env.DOUBAO_API_KEY?.substring(0, 10) || 'N/A');
```

你推送代码并重新部署后，在 Vercel 日志中应该能看到这些信息。

---

## 立即行动

请执行以下操作：

1. **推送我之前修改的代码**：
   ```bash
   cd "/Users/huhaotian/未命名文件夹/malaysia-meal-planner"
   git add .
   git commit -m "Add detailed logging for shopping list API"
   git push origin main
   ```

2. **等待 Vercel 部署完成**（2-3 分钟）

3. **生成一次膳食计划**

4. **在 Vercel 中查看日志**：
   - Deployments → 最新部署 → Runtime Logs
   - 查找：`🔧 Using Doubao endpoint for shopping list: ...`
   - 查找：`🔧 API Key length: ...`
   - 查找：`🔧 API Key prefix: ...`

5. **把日志信息告诉我**，包括：
   - API Key length（应该是一个数字）
   - API Key prefix（前10个字符）
   - 任何错误信息

这样我们就能准确定位问题了。

---

**首先推送代码并重新部署，然后查看详细日志，我们根据日志信息继续诊断。**

