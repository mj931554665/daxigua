# 🔧 您的部署配置

## 📋 当前配置信息

### GitHub 仓库信息
- **仓库地址**: `git@github.com:mj931554665/daxigua.git`
- **GitHub Pages 地址**: `https://mj931554665.github.io/daxigua/`
- **用户名**: `mj931554665`
- **仓库名**: `daxigua`

### OAuth App 配置
- **Client ID**: `Ov23liS8Q7uLRb5OsD9s`
- **Client Secret**: `ea85624a69cdaad2da9d5d947e29b4d9c85bd493`
- **授权回调 URL**: `https://mj931554665.github.io/daxigua/auth-callback.html`

## 🎯 线上地址

### 主要页面
- **游戏主页**: https://mj931554665.github.io/daxigua/index.html
- **素材上传页面**: https://mj931554665.github.io/daxigua/upload.html
- **OAuth 回调页面**: https://mj931554665.github.io/daxigua/auth-callback.html

### 测试链接
```
# 默认游戏
https://mj931554665.github.io/daxigua/index.html

# 指定素材包（示例）
https://mj931554665.github.io/daxigua/index.html?assets=pack-12345678-abcd-4efg-hijk-123456789012
```

## 📁 文件结构差异

### 本地开发环境
```
daxigua-onefile/
├── index.html
├── upload.html
├── auth-callback.html
├── upload.js
├── assets/
└── src/
```

### 线上部署环境
```
daxigua/
├── index.html          # 对应本地的 daxigua-onefile/index.html
├── upload.html         # 对应本地的 daxigua-onefile/upload.html
├── auth-callback.html  # 对应本地的 daxigua-onefile/auth-callback.html
├── upload.js           # 对应本地的 daxigua-onefile/upload.js
├── assets/             # 素材存储目录
└── src/                # 游戏源码
```

## ⚙️ 配置已更新

### upload.js 配置
```javascript
const GITHUB_CONFIG = {
    clientId: 'Ov23liS8Q7uLRb5OsD9s',
    redirectUri: window.location.origin + '/auth-callback.html',
    scope: 'repo',
    repo: 'mj931554665/daxigua'
};
```

### 路径映射
- **素材上传路径**: `/assets/{pack-id}/` （去掉了 daxigua-onefile 前缀）
- **游戏链接**: `/index.html?assets={pack-id}` （去掉了 daxigua-onefile 前缀）
- **回调地址**: `/auth-callback.html` （去掉了 daxigua-onefile 前缀）

## 🚀 部署步骤

### 1. 上传文件到 GitHub
```bash
# 将 daxigua-onefile 目录下的文件上传到仓库根目录
git add .
git commit -m "Deploy upload system"
git push origin main
```

### 2. GitHub Pages 设置
- 仓库设置 → Pages
- Source: Deploy from a branch
- Branch: main
- Folder: / (root)

### 3. OAuth App 设置确认
在 https://github.com/settings/applications 中确认：
- **Homepage URL**: `https://mj931554665.github.io/daxigua`
- **Authorization callback URL**: `https://mj931554665.github.io/daxigua/auth-callback.html`

## 🧪 测试流程

### 1. 基础功能测试
- [ ] 访问 https://mj931554665.github.io/daxigua/upload.html
- [ ] 点击"登录 GitHub"按钮
- [ ] 完成 GitHub 授权
- [ ] 上传测试素材文件

### 2. 完整流程测试
- [ ] 准备素材文件（1.png ~ 11.png）
- [ ] 拖拽上传到页面
- [ ] 点击"处理并上传素材"
- [ ] 等待处理完成
- [ ] 获得游戏链接并测试

## 🔍 故障排查

### 常见问题
1. **OAuth 授权失败**
   - 检查回调 URL 是否正确
   - 确认 Client ID 配置正确

2. **文件上传失败**
   - 检查 Personal Access Token 权限
   - 确认仓库名称正确

3. **游戏无法加载素材**
   - 检查素材包 ID 是否正确
   - 确认文件已成功上传到 GitHub

## 📞 支持信息

如果遇到问题，可以检查：
- 浏览器开发者工具的控制台错误
- GitHub API 响应状态
- 网络连接状态

---

**配置完成！** 🎉

您的素材上传系统现在已经配置为适配您的实际部署环境：
- 本地开发：`daxigua-onefile/` 目录
- 线上部署：`https://mj931554665.github.io/daxigua/`
