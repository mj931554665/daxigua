# GitHub 素材上传系统部署指南

## 🎯 概述

这个系统允许用户通过网页上传游戏素材，自动处理后提交到您的 GitHub 仓库，实现自动化的素材管理。

## 📋 准备工作

### 1. GitHub 仓库设置

#### 创建或准备仓库
```bash
# 如果还没有仓库，创建一个新的
# 1. 访问 https://github.com/new
# 2. 仓库名称：例如 "watermelon-game"
# 3. 设置为 Public（如果要使用 GitHub Pages）
# 4. 勾选 "Add a README file"
# 5. 点击 "Create repository"
```

#### 上传现有代码
```bash
# 在本地项目目录执行
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. GitHub OAuth App 设置

#### 创建 OAuth App
1. 访问 https://github.com/settings/applications/new
2. 填写应用信息：
   ```
   Application name: 大西瓜素材上传工具
   Homepage URL: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME
   Application description: 用户上传游戏素材的工具
   Authorization callback URL: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/daxigua-onefile/auth-callback.html
   ```
3. 点击 "Register application"
4. 记录 **Client ID** 和 **Client Secret**

### 3. 配置代码

#### 修改 upload.js 配置
```javascript
// 在 daxigua-onefile/upload.js 中修改这些配置
const GITHUB_CONFIG = {
    clientId: 'YOUR_GITHUB_CLIENT_ID',        // 替换为您的 Client ID
    redirectUri: 'https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/daxigua-onefile/auth-callback.html',
    scope: 'repo',
    repo: 'YOUR_USERNAME/YOUR_REPO_NAME'      // 替换为您的仓库
};
```

#### 示例配置
```javascript
// 假设您的 GitHub 用户名是 "johndoe"，仓库名是 "watermelon-game"
const GITHUB_CONFIG = {
    clientId: 'Iv1.a1b2c3d4e5f6g7h8',
    redirectUri: 'https://johndoe.github.io/watermelon-game/daxigua-onefile/auth-callback.html',
    scope: 'repo',
    repo: 'johndoe/watermelon-game'
};
```

## 🚀 部署方案

### 方案 1: GitHub Pages（推荐，免费）

#### 启用 GitHub Pages
1. 进入仓库设置页面：`https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/settings`
2. 滚动到 "Pages" 部分
3. Source 选择 "Deploy from a branch"
4. Branch 选择 "main"
5. Folder 选择 "/ (root)"
6. 点击 "Save"

#### 访问地址
```
游戏地址: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/daxigua-onefile/
上传工具: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/daxigua-onefile/upload.html
```

### 方案 2: Vercel 部署

#### 连接 GitHub
1. 访问 https://vercel.com
2. 点击 "New Project"
3. 选择您的 GitHub 仓库
4. 点击 "Deploy"

#### 配置域名
- Vercel 会自动分配域名：`your-repo-name.vercel.app`
- 可以绑定自定义域名

### 方案 3: Netlify 部署

#### 连接 GitHub
1. 访问 https://netlify.com
2. 点击 "New site from Git"
3. 选择 GitHub 并授权
4. 选择您的仓库
5. 点击 "Deploy site"

## 🔧 OAuth 流程说明

### 当前实现（简化版）
由于纯前端限制，当前使用简化的 OAuth 流程：

1. **用户点击登录** → 跳转到 GitHub 授权页面
2. **用户授权** → 跳转回 auth-callback.html
3. **提示用户输入 Token** → 用户手动输入 Personal Access Token
4. **验证 Token** → 保存到本地存储
5. **开始上传** → 使用 Token 调用 GitHub API

### Personal Access Token 获取方法
用户需要：
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 设置 Token 名称：`大西瓜游戏素材上传`
4. 选择权限：勾选 `repo` (Full control of private repositories)
5. 点击 "Generate token"
6. 复制生成的 Token

## 🎮 使用流程

### 用户使用步骤
1. **访问上传页面**：`https://your-site.com/daxigua-onefile/upload.html`
2. **登录 GitHub**：点击登录按钮，完成授权
3. **上传素材**：拖拽或选择素材文件（1.png ~ 11.png 等）
4. **自动处理**：系统自动调整尺寸、添加效果
5. **获得链接**：上传完成后获得游戏链接

### 支持的素材文件
```
必需文件：
- 1.png ~ 11.png (水果图片)

可选文件：
- background-game.png (游戏背景)
- start.png (开始按钮)
- down.mp3 (下落音效)
- merge.mp3 (合成音效)
- background.mp3 (背景音乐)
```

## 📁 文件结构

部署后的文件结构：
```
your-repo/
├── daxigua-onefile/
│   ├── index.html              # 游戏主页
│   ├── upload.html             # 素材上传页面
│   ├── upload.js               # 上传逻辑
│   ├── auth-callback.html      # OAuth 回调页面
│   ├── assets/                 # 素材存储目录
│   │   ├── pack-uuid-1/        # 用户上传的素材包
│   │   ├── pack-uuid-2/
│   │   └── ...
│   └── src/
│       └── project.js          # 游戏逻辑
└── README.md
```

## 🔒 安全考虑

### Token 安全
- Token 存储在用户浏览器本地
- 用户可以随时撤销 Token
- Token 只能访问用户有权限的仓库

### 仓库权限
- 建议创建专门的仓库用于素材上传
- 可以设置分支保护规则
- 定期清理无用的素材包

## 🐛 常见问题

### Q: OAuth 授权失败
A: 检查 OAuth App 的回调 URL 是否正确配置

### Q: 上传失败
A: 检查 Token 权限是否包含 `repo`，仓库名称是否正确

### Q: 游戏无法加载素材
A: 检查素材包 ID 是否正确，文件是否成功上传

### Q: 如何删除素材包
A: 直接在 GitHub 仓库中删除对应的文件夹

## 📞 技术支持

如果遇到问题，可以：
1. 检查浏览器控制台错误信息
2. 验证 GitHub API 响应
3. 确认文件上传状态

## 🎉 完成！

按照以上步骤配置完成后，您就拥有了一个完整的素材上传系统！

用户可以通过简单的网页操作上传素材，系统会自动处理并生成可玩的游戏链接。
