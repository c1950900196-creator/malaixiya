# 🔧 豆包 API 配置检查

根据豆包官方文档，我发现了几个可能的问题：

## 1️⃣ API Key 获取位置

**正确的获取方式：**

访问：https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey

⚠️ 注意：必须从这个页面获取，而不是其他页面！

---

## 2️⃣ API Key 类型检查

根据文档，有两种认证方式：

### 方式 1：使用 API Key（推荐）
- 从控制台获取
- 格式可能不是 `sk-` 开头
- 直接在 Authorization header 中使用

### 方式 2：使用 Access Key
- 需要配置 Access Key 和 Secret Key
- 认证方式不同

**你当前使用的是哪种？**

---

## 3️⃣ 检查步骤

### 步骤 1：确认 API Key 来源

1. 访问：https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey
2. 确认你从这个页面复制的 API Key
3. **不要使用其他页面的 Key**

### 步骤 2：检查 API Key 格式

你的 API Key：`Tmpoak9HWmhaV0UzTWpGbU5EbGtZMkZp...`

这个格式看起来是：
- Base64 编码的字符串
- 不是 `sk-` 开头

**可能的问题：**
- 这可能不是正确的 API Key
- 或者是 Access Key（需要不同的认证方式）

### 步骤 3：重新获取 API Key

**建议：**
1. 访问：https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey
2. **点击"创建 API Key"** 或查看现有的 API Key
3. **完整复制** API Key（确保没有多余字符）
4. 在 Vercel 中更新 `DOUBAO_API_KEY`
5. 重新部署

---

## 4️⃣ 验证配置

### 在豆包控制台验证

1. 访问：https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey
2. 查看你的 API Key 列表
3. 确认 API Key 的状态是"启用"
4. 检查 API Key 的权限（是否有调用模型的权限）

### 测试 API Key

你可以在本地测试 API Key 是否有效：

```bash
curl https://ark.cn-beijing.volces.com/api/v3/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 你的API_KEY" \
  -d '{
    "model": "doubao-seed-1-6-251015",
    "messages": [
        {
            "role": "user",
            "content": "你好"
        }
    ]
  }'
```

如果返回 401 错误，说明 API Key 确实有问题。

---

## 5️⃣ 可能的原因

### 原因 1：使用了错误的 Key

你可能复制了：
- ❌ Access Key（不是 API Key）
- ❌ Secret Key
- ❌ 其他类型的 Key

**正确的应该是：**
- ✅ 从 API Key 管理页面获取的 API Key
- ✅ 用于调用模型的 Key

### 原因 2：API Key 权限不足

检查 API Key 的权限：
1. 在控制台查看 API Key 详情
2. 确认有"文本生成"或"Chat Completions"的权限
3. 确认可以调用 `doubao-seed-1-6-251015` 模型

### 原因 3：API Key 格式问题

你的 API Key：`Tmpoak9HWmhaV0UzTWpGbU5EbGtZMkZp...`

这个格式不太常见。标准的 API Key 通常：
- 可能以特定前缀开头
- 或者是一个长的随机字符串

**建议：重新生成一个新的 API Key**

---

## 6️⃣ 解决方案

### 方案 1：重新创建 API Key（强烈推荐）

1. **访问**：https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey
2. **点击"创建 API Key"**
3. **完整复制新的 API Key**
4. **在 Vercel 中更新** `DOUBAO_API_KEY`：
   - 删除旧的值
   - 粘贴新的 API Key
   - 确保没有多余空格
   - 保存并勾选三个环境
5. **重新部署**
6. **测试**

### 方案 2：检查是否需要开通服务

1. 访问：https://console.volcengine.com/ark/openManagement
2. 确认已开通"模型服务"
3. 确认 `doubao-seed-1-6-251015` 模型可用

### 方案 3：使用 Endpoint ID（如果适用）

根据文档，如果你使用的是自定义推理接入点：
- 需要使用 Endpoint ID
- 认证方式可能不同

---

## 7️⃣ 关键检查清单

- [ ] 从正确的页面获取 API Key：https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey
- [ ] API Key 是完整的（没有截断）
- [ ] API Key 没有多余的空格或换行
- [ ] 已开通模型服务
- [ ] API Key 有正确的权限
- [ ] 在 Vercel 中正确配置了环境变量
- [ ] 重新部署了项目

---

## 8️⃣ 诊断命令

在本地测试（替换 `YOUR_API_KEY`）：

```bash
# 测试 API Key 是否有效
curl -X POST https://ark.cn-beijing.volces.com/api/v3/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "doubao-seed-1-6-251015",
    "messages": [{"role": "user", "content": "测试"}]
  }'
```

**如果返回：**
- ✅ 正常的 JSON 响应 → API Key 有效
- ❌ 401 错误 → API Key 无效或格式错误
- ❌ 其他错误 → 查看具体错误信息

---

## 💡 我的建议

**最简单的解决方法：**

1. 访问：https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey
2. **重新创建一个新的 API Key**
3. **完整复制**新的 API Key
4. 在 Vercel 中**更新** `DOUBAO_API_KEY`
5. **重新部署**

这样可以排除：
- API Key 格式问题
- API Key 权限问题
- 复制粘贴错误

---

**按照这些步骤重新配置后，问题应该就能解决了！**

告诉我你重新获取 API Key 后的结果。

