# 📤 快速上传到 GitHub

我已经为你创建了自动化脚本，可以一键上传代码到 GitHub！

## 🚀 使用方法

### macOS 用户

**最简单的方法**：直接双击 `上传到GitHub.command` 文件！

系统会自动打开终端并执行脚本。

> 💡 **提示**：如果第一次双击提示"无法打开"，请：
> 1. 右键点击文件 → 选择"打开"
> 2. 或者在终端中执行：`chmod +x 上传到GitHub.command`

## 📋 脚本会做什么？

脚本会自动执行以下操作：

1. ✅ 初始化 Git 仓库（如果还没有）
2. ✅ 添加所有文件到 Git
3. ✅ 提交代码
4. ⚠️ 然后会提示你输入 GitHub 仓库地址

## 🔗 获取 GitHub 仓库地址

在执行脚本之前，你需要：

1. 访问 [github.com](https://github.com) 并登录
2. 点击右上角 `+` → `New repository`
3. 输入仓库名称（例如：`malaysia-meal-planner`）
4. 选择 `Public`（免费用户只能创建公开仓库）
5. **不要勾选** "Initialize this repository with a README"
6. 点击 `Create repository`
7. 复制显示的仓库地址（例如：`https://github.com/你的用户名/仓库名.git`）

## ⚠️ 如果遇到问题

### 问题 1：提示需要登录 GitHub

**解决方案**：
- 使用 GitHub CLI：`gh auth login`
- 或者使用 Personal Access Token

### 问题 2：提示权限被拒绝

**解决方案**：
- 确保你已经登录 GitHub
- 检查仓库地址是否正确
- 尝试使用 SSH 方式：`git@github.com:用户名/仓库名.git`

### 问题 3：双击 .command 文件无法打开

**解决方案**：
1. 右键点击 `上传到GitHub.command` → 选择"打开"
2. 或者在终端中执行：
   ```bash
   cd "/Users/huhaotian/未命名文件夹/malaysia-meal-planner"
   chmod +x 上传到GitHub.command
   ./上传到GitHub.command
   ```

## ✅ 上传成功后

上传成功后，按照 `快速部署指南.md` 中的步骤，在 Vercel 部署你的应用！

---

**需要帮助？** 查看 `快速部署指南.md` 获取详细说明。

