# 🚀 部署检查清单

## 📋 部署前准备

### ✅ 1. GitHub 仓库准备
- [ ] 创建 GitHub 仓库（公开仓库用于 GitHub Pages）
- [ ] 上传所有代码文件到仓库
- [ ] 确认 `daxigua-onefile` 文件夹结构完整

### ✅ 2. GitHub OAuth App 设置
- [ ] 访问 https://github.com/settings/applications/new
- [ ] 创建新的 OAuth App
- [ ] 记录 Client ID 和 Client Secret
- [ ] 设置正确的回调 URL

### ✅ 3. 代码配置
- [ ] 修改 `upload.js` 中的 `GITHUB_CONFIG`
- [ ] 替换 `YOUR_GITHUB_CLIENT_ID` 为实际的 Client ID
- [ ] 替换 `YOUR_USERNAME/YOUR_REPO_NAME` 为实际的仓库路径
- [ ] 更新回调 URL 为实际的部署地址

## 🌐 部署步骤

### GitHub Pages 部署（推荐）

#### ✅ 1. 启用 GitHub Pages
- [ ] 进入仓库 Settings 页面
- [ ] 找到 Pages 设置
- [ ] Source 选择 "Deploy from a branch"
- [ ] Branch 选择 "main"，Folder 选择 "/ (root)"
- [ ] 点击 Save

#### ✅ 2. 等待部署完成
- [ ] 等待 GitHub Pages 构建完成（通常 1-5 分钟）
- [ ] 访问 `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`
- [ ] 确认网站可以正常访问

#### ✅ 3. 测试功能
- [ ] 访问游戏页面：`/daxigua-onefile/index.html`
- [ ] 访问上传页面：`/daxigua-onefile/upload.html`
- [ ] 测试 GitHub 登录功能
- [ ] 测试文件上传功能

## 🔧 配置示例

### 实际配置示例
假设您的信息如下：
- GitHub 用户名：`johndoe`
- 仓库名称：`watermelon-game`
- OAuth App Client ID：`Iv1.a1b2c3d4e5f6g7h8`

#### upload.js 配置：
```javascript
const GITHUB_CONFIG = {
    clientId: 'Iv1.a1b2c3d4e5f6g7h8',
    redirectUri: 'https://johndoe.github.io/watermelon-game/daxigua-onefile/auth-callback.html',
    scope: 'repo',
    repo: 'johndoe/watermelon-game'
};
```

#### OAuth App 设置：
```
Application name: 大西瓜素材上传工具
Homepage URL: https://johndoe.github.io/watermelon-game
Authorization callback URL: https://johndoe.github.io/watermelon-game/daxigua-onefile/auth-callback.html
```

## 🧪 测试清单

### ✅ 基础功能测试
- [ ] 游戏页面正常加载
- [ ] 默认素材显示正确
- [ ] URL 参数切换素材包功能正常

### ✅ 上传功能测试
- [ ] 上传页面正常显示
- [ ] GitHub 登录按钮可以跳转
- [ ] 授权流程可以完成
- [ ] 文件拖拽上传功能正常
- [ ] 文件验证功能正常
- [ ] 图片处理功能正常
- [ ] GitHub API 上传功能正常

### ✅ 用户体验测试
- [ ] 移动端适配正常
- [ ] 错误提示清晰明确
- [ ] 进度显示正常
- [ ] 成功后链接可以正常访问

## 🐛 常见问题排查

### 问题 1: OAuth 授权失败
**症状**：点击登录后无法正常跳转或授权失败

**排查步骤**：
- [ ] 检查 OAuth App 的回调 URL 是否与实际部署地址一致
- [ ] 确认 Client ID 配置正确
- [ ] 检查浏览器控制台是否有错误信息

### 问题 2: 文件上传失败
**症状**：文件处理完成但上传到 GitHub 失败

**排查步骤**：
- [ ] 检查用户的 Personal Access Token 权限
- [ ] 确认仓库名称配置正确
- [ ] 检查网络连接和 GitHub API 状态

### 问题 3: 游戏无法加载素材
**症状**：上传成功但游戏中看不到新素材

**排查步骤**：
- [ ] 确认素材包 ID 正确
- [ ] 检查文件是否成功上传到 GitHub
- [ ] 验证 GitHub Pages 是否已更新

## 📊 性能优化

### ✅ 优化建议
- [ ] 启用 GitHub Pages 的 CDN 加速
- [ ] 压缩图片文件大小
- [ ] 使用 Service Worker 缓存静态资源
- [ ] 优化移动端加载速度

## 🔒 安全检查

### ✅ 安全措施
- [ ] 确认 OAuth App 权限最小化
- [ ] 检查 Token 存储安全性
- [ ] 验证文件上传限制
- [ ] 确认没有敏感信息泄露

## 📈 监控和维护

### ✅ 监控设置
- [ ] 设置 GitHub Pages 状态监控
- [ ] 监控仓库存储空间使用
- [ ] 定期清理无用的素材包
- [ ] 关注用户反馈和错误报告

## 🎉 部署完成确认

### ✅ 最终检查
- [ ] 所有功能测试通过
- [ ] 用户可以正常使用完整流程
- [ ] 文档和说明完整
- [ ] 备份和恢复方案就绪

## 📞 上线后支持

### 用户支持准备
- [ ] 准备用户使用说明
- [ ] 设置问题反馈渠道
- [ ] 准备常见问题解答
- [ ] 制定问题处理流程

---

## 🎯 快速部署命令

```bash
# 1. 克隆或下载代码
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# 2. 修改配置文件
# 编辑 daxigua-onefile/upload.js 中的 GITHUB_CONFIG

# 3. 提交更改
git add .
git commit -m "Configure OAuth settings"
git push origin main

# 4. 启用 GitHub Pages
# 在 GitHub 仓库设置中启用 Pages

# 5. 访问网站
# https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/daxigua-onefile/upload.html
```

完成以上所有步骤后，您的素材上传系统就可以正式上线使用了！🎉
