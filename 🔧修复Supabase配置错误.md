# 🔧 修复 Supabase 配置错误

## ❌ 问题

网站显示错误：`保存失败:无法创建用户会话,请检查 Supabase 配置`

浏览器控制台显示 CORS 错误：
```
Access to fetch at 'https://supabase.com/dashboard/project/...' 
has been blocked by CORS policy
```

## 🔍 原因

**Supabase URL 配置错误！**

你配置的 URL 是：`https://supabase.com/dashboard/project/wpabckyfygfvghslzjnl/...`

这是 **Dashboard 的 URL**（用于管理界面），不是 **API URL**（用于应用调用）。

---

## ✅ 解决方案

### 步骤 1：获取正确的 Supabase URL

1. **打开 Supabase Dashboard**
   - 访问：https://app.supabase.com
   - 登录你的账号

2. **进入项目设置**
   - 选择你的项目
   - 点击左侧菜单 **"Settings"**（齿轮图标）
   - 点击 **"API"**

3. **找到 Project URL**
   - 在页面中找到 **"Project URL"**
   - 格式应该是：`https://xxxxxxxxxxxxx.supabase.co`
   - **不是** `https://supabase.com/dashboard/project/...`

4. **复制 Project URL**
   - 点击复制按钮复制完整的 URL
   - 例如：`https://wpabckyfygfvghslzjnl.supabase.co`

---

### 步骤 2：在 Vercel 中更新环境变量

1. **进入 Vercel 项目设置**
   - 访问：https://vercel.com
   - 登录并进入你的项目
   - 点击 **"Settings"** → **"Environment Variables"**

2. **找到 `NEXT_PUBLIC_SUPABASE_URL`**
   - 在环境变量列表中找到这个变量
   - 点击变量名或点击 **"Edit"**

3. **更新值**
   - 删除旧的值：`https://supabase.com/dashboard/project/...`
   - 输入正确的值：`https://wpabckyfygfvghslzjnl.supabase.co`
   - **注意**：不要包含 `/dashboard`、`/project` 等路径，只要基础 URL！

4. **保存并确认**
   - 确保勾选了 **Production**、**Preview**、**Development** 三个环境
   - 点击 **"Save"**

5. **重新部署**
   - 点击项目页面顶部的 **"Deployments"** 标签
   - 找到最新的部署
   - 点击右上角的 **"..."** → **"Redeploy"**
   - 或者点击 **"Deploy"** 按钮重新部署

---

### 步骤 3：验证配置

重新部署后：

1. **等待部署完成**（约 2-3 分钟）
2. **访问网站**：`https://malaixiya-1xr11111.vercel.app`
3. **测试功能**：
   - 填写用户信息表单
   - 点击"生成膳食计划"
   - 查看是否能正常生成

4. **检查浏览器控制台**：
   - 按 `F12` 打开开发者工具
   - 切换到 **"Console"** 标签
   - 确认没有 CORS 错误
   - 确认没有 Supabase 连接错误

---

## 📋 正确的环境变量格式

在 Vercel 中，`NEXT_PUBLIC_SUPABASE_URL` 应该是：

### ✅ 正确格式：
```
https://wpabckyfygfvghslzjnl.supabase.co
```

**关键点：**
- ✅ 以 `https://` 开头
- ✅ 以 `.supabase.co` 结尾
- ✅ 中间是你的项目 ID（例如：`wpabckyfygfvghslzjnl`）
- ✅ **不包含** `/dashboard`、`/project` 等路径
- ✅ **不包含** `/auth`、`/v1` 等 API 路径

### ❌ 错误格式：
```
https://supabase.com/dashboard/project/wpabckyfygfvghslzjnl
https://supabase.com/dashboard/project/wpabckyfygfvghslzjnl/auth/v1
/supabase.com/dashboard/project/wpabckyfygfvghslzjnl
```

---

## 🔍 如何确认 Supabase URL 是否正确

1. **在 Supabase Dashboard 中查看**
   - Settings → API → Project URL
   - 应该显示：`https://xxxxx.supabase.co`

2. **在浏览器中测试**
   - 访问：`https://xxxxx.supabase.co/rest/v1/`
   - 应该返回 JSON 响应（不是 404）

3. **检查环境变量**
   - 在 Vercel 中确认 URL 格式正确
   - 确认没有多余的前缀或后缀

---

## 🚨 常见错误

### 错误 1：使用了 Dashboard URL
- ❌ `https://supabase.com/dashboard/project/...`
- ✅ `https://xxxxx.supabase.co`

### 错误 2：URL 不完整
- ❌ `/dashboard/project/wpabckyfygfvghslzjnl`
- ✅ `https://wpabckyfygfvghslzjnl.supabase.co`

### 错误 3：包含了 API 路径
- ❌ `https://xxxxx.supabase.co/auth/v1`
- ✅ `https://xxxxx.supabase.co`

### 错误 4：缺少 https://
- ❌ `wpabckyfygfvghslzjnl.supabase.co`
- ✅ `https://wpabckyfygfvghslzjnl.supabase.co`

---

## ✅ 完整的检查清单

- [ ] Supabase Project URL 格式正确：`https://xxxxx.supabase.co`
- [ ] 在 Vercel 中更新了 `NEXT_PUBLIC_SUPABASE_URL`
- [ ] 确保三个环境（Production、Preview、Development）都更新了
- [ ] 重新部署了项目
- [ ] 等待部署完成（2-3 分钟）
- [ ] 测试网站功能正常
- [ ] 浏览器控制台没有错误

---

## 💡 快速修复步骤

**最快的方法：**

1. 打开 Supabase Dashboard → Settings → API
2. 复制 **Project URL**（格式：`https://xxxxx.supabase.co`）
3. 在 Vercel → Settings → Environment Variables 中
4. 找到 `NEXT_PUBLIC_SUPABASE_URL`
5. 点击 Edit，粘贴正确的 URL
6. 保存并重新部署

**完成！** 🎉

---

**更新环境变量后，记得重新部署项目，更改才会生效！**

