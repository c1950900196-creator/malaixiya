# 🔧 修复豆包 AI API 错误

## ❌ 问题

网站可以正常访问，但在生成购物清单时出现错误：

1. **401 (Unauthorized)** - 购物清单生成失败
2. **AuthenticationError: The API key format is incorrect** - API key 格式不正确

## 🔍 原因

**豆包 AI API 配置错误或缺失。**

可能的原因：
- `DOUBAO_API_KEY` 未配置或格式错误
- `DOUBAO_API_ENDPOINT` 未配置或格式错误
- API key 已过期或无效
- 认证方式不正确

---

## ✅ 解决方案

### 方案 1：配置正确的豆包 API（如果已购买）

如果你已经购买了豆包 API，需要在 Vercel 中配置：

#### 步骤 1：获取豆包 API 配置

1. **访问豆包 AI 控制台**
   - 访问：https://console.volcengine.com/doubao
   - 或相应的豆包 AI 平台

2. **获取 API 配置信息**
   - **API Endpoint**（API 端点）
     - 通常类似：`https://ark.cn-beijing.volces.com/api/v3/chat/completions`
     - 或：`https://ark.volces.com/api/v3/chat/completions`
   - **API Key**（API 密钥）
     - 以 `sk-` 开头的字符串
     - 或类似格式的密钥
   - **Model Name**（模型名称）
     - 例如：`doubao-seed-1-6-lite-251015`
     - 或你使用的其他模型名称

#### 步骤 2：在 Vercel 中配置环境变量

1. **进入 Vercel 项目设置**
   - 访问：https://vercel.com
   - 进入你的项目：`malaixiya`
   - 点击 **"Settings"** → **"Environment Variables"**

2. **添加/更新以下环境变量：**

   | 变量名 | 值 | 示例 |
   |--------|-----|------|
   | `DOUBAO_API_ENDPOINT` | 你的豆包 API 端点 | `https://ark.cn-beijing.volces.com/api/v3/chat/completions` |
   | `DOUBAO_API_KEY` | 你的豆包 API 密钥 | `sk-xxxxx...` 或类似格式 |
   | `DOUBAO_MODEL` | 模型名称 | `doubao-seed-1-6-lite-251015` |

3. **确保每个变量都勾选了三个环境：**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **保存并重新部署**
   - 点击 **"Save"**
   - 回到项目页面
   - 点击 **"Deployments"** → 找到最新部署 → 点击 **"..."** → **"Redeploy"**

---

### 方案 2：暂时禁用豆包 API 功能（如果没有购买）

如果你还没有购买豆包 API，可以暂时禁用购物清单的 AI 生成功能，使用基础版本。

#### 临时解决方案：修改代码使用基础购物清单

或者，我们可以修改代码，让购物清单使用数据库中的食谱数据生成，而不是调用 AI API。

---

### 方案 3：检查 API Key 格式

确保 API Key 格式正确：

#### 常见的 API Key 格式：

1. **字节跳动豆包 API**：
   ```
   DOUBAO_API_KEY=sk-xxxxx...（通常以 sk- 开头）
   DOUBAO_API_ENDPOINT=https://ark.cn-beijing.volces.com/api/v3/chat/completions
   DOUBAO_MODEL=doubao-seed-1-6-lite-251015
   ```

2. **其他可能的格式**：
   ```
   DOUBAO_API_KEY=your-api-key-here
   DOUBAO_API_ENDPOINT=https://your-endpoint.com/api/v3/chat/completions
   ```

#### 检查 API Key 是否正确：

- ✅ 应该是一个完整的字符串（没有空格、没有换行）
- ✅ 不应该包含引号（`"` 或 `'`）
- ✅ 不应该有前导或尾随空格
- ✅ 如果是以 `sk-` 开头，确保完整复制了

---

## 🔍 验证配置

### 步骤 1：检查环境变量是否设置

在 Vercel 中确认：
- ✅ `DOUBAO_API_ENDPOINT` 已添加且格式正确
- ✅ `DOUBAO_API_KEY` 已添加且格式正确
- ✅ `DOUBAO_MODEL` 已添加且格式正确
- ✅ 三个环境（Production、Preview、Development）都勾选了

### 步骤 2：重新部署

更新环境变量后，**必须重新部署**才能生效：

1. 在 Vercel 项目页面
2. 点击 **"Deployments"** 标签
3. 找到最新的部署
4. 点击右侧的 **"..."** → **"Redeploy"**
5. 等待 2-3 分钟部署完成

### 步骤 3：测试功能

部署完成后：

1. **访问网站**：`https://malaixiya-1xr11111.vercel.app`
2. **刷新页面**（Cmd+Shift+R 强制刷新）
3. **测试购物清单功能**：
   - 生成膳食计划
   - 访问"购物清单"页面
   - 查看是否能正常生成

4. **检查浏览器控制台**（F12 → Console）：
   - 确认没有 401 错误
   - 确认没有 AuthenticationError

---

## 🚨 常见错误

### 错误 1：API Key 格式不正确

**症状**：`The API key format is incorrect`

**原因**：
- API Key 包含空格或换行
- API Key 缺少某些字符
- API Key 格式不对（例如不是 `sk-` 开头）

**解决**：
- 确保 API Key 完整复制，没有多余的空格
- 检查 API Key 格式是否符合豆包 API 的要求
- 如果不确定，从豆包控制台重新复制

### 错误 2：401 Unauthorized

**症状**：`401 (Unauthorized)`

**原因**：
- API Key 无效或已过期
- API Key 没有权限
- API Endpoint 不正确

**解决**：
- 检查 API Key 是否有效
- 确认 API Key 有正确的权限
- 验证 API Endpoint 是否正确

### 错误 3：环境变量未生效

**症状**：更新环境变量后还是报错

**原因**：
- 没有重新部署
- 环境变量格式错误

**解决**：
- **必须重新部署**才能生效
- 检查环境变量格式是否正确
- 确认三个环境都勾选了

---

## 💡 如果还没有购买豆包 API

如果你还没有购买豆包 API，有两个选择：

### 选择 1：购买豆包 API（推荐）

- 访问豆包 AI 控制台购买 API 服务
- 获取 API Key 和 Endpoint
- 按照上面的步骤配置

### 选择 2：暂时使用基础功能

- 购物清单功能可能无法使用 AI 生成
- 其他功能（膳食计划生成、营养分析等）不受影响
- 可以稍后再配置豆包 API

---

## ✅ 完整的检查清单

- [ ] 已购买豆包 API 服务
- [ ] 已获取 API Key（格式正确）
- [ ] 已获取 API Endpoint（格式正确）
- [ ] 已获取 Model Name
- [ ] 在 Vercel 中添加了 `DOUBAO_API_ENDPOINT`
- [ ] 在 Vercel 中添加了 `DOUBAO_API_KEY`
- [ ] 在 Vercel 中添加了 `DOUBAO_MODEL`
- [ ] 每个变量都勾选了三个环境
- [ ] 环境变量格式正确（没有多余空格、没有引号）
- [ ] 重新部署了项目
- [ ] 等待部署完成（2-3 分钟）
- [ ] 测试购物清单功能正常

---

## 📊 验证 API 配置是否生效

### 方法 1：查看 Vercel 日志

1. 在 Vercel 项目页面
2. 点击 **"Deployments"** → 选择最新部署
3. 查看 **"Functions"** 或 **"Logs"** 标签
4. 查看是否有豆包 API 相关的错误或成功消息

### 方法 2：测试购物清单功能

1. 访问网站
2. 生成膳食计划
3. 访问"购物清单"页面
4. 查看是否能正常生成购物清单

---

## 🎯 快速修复步骤

**如果你已有豆包 API：**

1. ✅ 获取正确的 API Key、Endpoint 和 Model Name
2. ✅ 在 Vercel → Settings → Environment Variables 中添加/更新：
   - `DOUBAO_API_ENDPOINT`
   - `DOUBAO_API_KEY`
   - `DOUBAO_MODEL`
3. ✅ 确保每个变量都勾选了三个环境
4. ✅ 重新部署项目
5. ✅ 等待部署完成并测试

**如果你还没有豆包 API：**

- 可以先使用其他功能（膳食计划生成不受影响）
- 或者购买豆包 API 后再配置
- 或者我可以帮你修改代码，使用基础版本（不依赖 AI）

---

**按照步骤更新环境变量并重新部署后，错误应该就会消失了！**

告诉我你是否有豆包 API，我可以帮你具体配置。如果没有，我们也可以修改代码使用其他方式。

