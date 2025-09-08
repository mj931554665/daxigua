// GitHub OAuth 配置
const GITHUB_CONFIG = {
    clientId: 'Ov23liS8Q7uLRb5OsD9s', // 需要替换为实际的 Client ID
    redirectUri: window.location.origin + '/auth-callback.html',
    scope: 'repo',
    repo: 'mj931554665/daxigua' // 您的仓库
};

// 全局变量
let currentUser = null;
let selectedFiles = [];
let accessToken = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// 初始化应用
function initializeApp() {
    // 检查是否已登录
    accessToken = localStorage.getItem('github_access_token');
    const userInfo = localStorage.getItem('github_user_info');
    
    if (accessToken && userInfo) {
        currentUser = JSON.parse(userInfo);
        showUploadSection();
    } else {
        showLoginSection();
    }
}

// 设置事件监听器
function setupEventListeners() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    
    // 拖拽事件
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    
    // 文件选择事件
    fileInput.addEventListener('change', handleFileSelect);
}

// GitHub 登录
function loginGitHub() {
    const authUrl = `https://github.com/login/oauth/authorize?` +
        `client_id=${GITHUB_CONFIG.clientId}&` +
        `redirect_uri=${encodeURIComponent(GITHUB_CONFIG.redirectUri)}&` +
        `scope=${GITHUB_CONFIG.scope}&` +
        `state=${generateRandomState()}`;
    
    // 保存 state 用于验证
    localStorage.setItem('oauth_state', generateRandomState());
    
    // 跳转到 GitHub 授权页面
    window.location.href = authUrl;
}

// 生成随机状态码
function generateRandomState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

// 处理授权回调
async function handleAuthCallback(code, state) {
    try {
        // 验证 state
        const savedState = localStorage.getItem('oauth_state');
        if (state !== savedState) {
            throw new Error('Invalid state parameter');
        }
        
        // 这里需要后端服务来交换 code 获取 access_token
        // 由于是纯前端方案，我们使用 GitHub App 或者让用户手动输入 token
        showTokenInput();
        
    } catch (error) {
        showError('登录失败: ' + error.message);
    }
}

// 显示 Token 输入（临时方案）
function showTokenInput() {
    const token = prompt('请输入您的 GitHub Personal Access Token\n\n' +
        '获取方法：\n' +
        '1. 访问 https://github.com/settings/tokens\n' +
        '2. 点击 "Generate new token (classic)"\n' +
        '3. 选择 "repo" 权限\n' +
        '4. 复制生成的 token');
    
    if (token) {
        validateAndSaveToken(token);
    }
}

// 验证并保存 Token
async function validateAndSaveToken(token) {
    try {
        // 验证 token 并获取用户信息
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Invalid token');
        }
        
        const userInfo = await response.json();
        
        // 保存到本地存储
        localStorage.setItem('github_access_token', token);
        localStorage.setItem('github_user_info', JSON.stringify(userInfo));
        
        accessToken = token;
        currentUser = userInfo;
        
        showUploadSection();
        
    } catch (error) {
        showError('Token 验证失败: ' + error.message);
    }
}

// 显示登录区域
function showLoginSection() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('uploadSection').style.display = 'none';
}

// 显示上传区域
function showUploadSection() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('uploadSection').style.display = 'block';
    
    // 显示用户信息
    document.getElementById('userName').textContent = currentUser.login;
    document.getElementById('userAvatar').src = currentUser.avatar_url;
}

// 退出登录
function logout() {
    localStorage.removeItem('github_access_token');
    localStorage.removeItem('github_user_info');
    localStorage.removeItem('oauth_state');
    
    accessToken = null;
    currentUser = null;
    selectedFiles = [];
    
    showLoginSection();
    resetUploadForm();
}

// 重置上传表单
function resetUploadForm() {
    document.getElementById('fileList').style.display = 'none';
    document.getElementById('uploadBtn').disabled = true;
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('errorSection').style.display = 'none';
}

// 拖拽处理
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
}

// 文件选择处理
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    handleFiles(files);
}

// 处理选择的文件
function handleFiles(files) {
    selectedFiles = files.filter(file => {
        return file.type.startsWith('image/') || file.type.startsWith('audio/');
    });
    
    if (selectedFiles.length === 0) {
        showError('请选择有效的图片或音频文件');
        return;
    }
    
    displayFileList();
    validateFiles();
}

// 显示文件列表
function displayFileList() {
    const fileList = document.getElementById('fileList');
    const fileItems = document.getElementById('fileItems');
    
    fileItems.innerHTML = '';
    
    selectedFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span>${file.name}</span>
            <span>${formatFileSize(file.size)}</span>
        `;
        fileItems.appendChild(fileItem);
    });
    
    fileList.style.display = 'block';
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 验证文件
function validateFiles() {
    const required = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', 
                     '7.png', '8.png', '9.png', '10.png', '11.png'];
    
    const uploaded = selectedFiles.map(f => f.name.toLowerCase());
    const missing = required.filter(name => !uploaded.includes(name));
    
    const uploadBtn = document.getElementById('uploadBtn');
    
    if (missing.length > 0) {
        uploadBtn.disabled = true;
        showError(`缺少必要素材: ${missing.join(', ')}`);
    } else {
        uploadBtn.disabled = false;
        hideError();
    }
}

// 生成 UUID
function generateUUID() {
    return 'pack-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 主要的处理和上传函数
async function processAndUpload() {
    try {
        // 生成唯一 ID
        const packId = generateUUID();
        
        // 显示进度
        showProgress('开始处理素材...', 0);
        
        // 处理所有文件
        const processedFiles = new Map();
        const totalFiles = selectedFiles.length;
        
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            showProgress(`正在处理 ${file.name}...`, (i / totalFiles) * 50);
            
            const processed = await processFile(file);
            processedFiles.set(file.name, processed);
        }
        
        // 生成 favicon
        if (processedFiles.has('11.png')) {
            showProgress('生成 favicon...', 60);
            const favicon = await generateFavicon(processedFiles.get('11.png'));
            processedFiles.set('favicon.png', favicon);
        }
        
        // 上传到 GitHub
        showProgress('上传到 GitHub...', 70);
        await uploadToGitHub(processedFiles, packId);
        
        // 显示结果
        showProgress('完成!', 100);
        showResult(packId);
        
    } catch (error) {
        showError('上传失败: ' + error.message);
        hideProgress();
    }
}

// 处理单个文件
async function processFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            if (file.type.startsWith('image/')) {
                const processed = await processImage(e.target.result, file.name);
                resolve(processed);
            } else {
                // 音频文件直接返回
                resolve(file);
            }
        };
        reader.readAsDataURL(file);
    });
}

// 图片处理函数（完整版）
async function processImage(dataUrl, fileName) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 获取目标尺寸
            const targetSize = getTargetSize(fileName);

            // 特殊处理不同类型的图片
            if (fileName === 'start.png') {
                // start.png 保持透明背景，等比缩放
                canvas.width = targetSize.width;
                canvas.height = targetSize.height;

                const scale = Math.min(targetSize.width / img.width, targetSize.height / img.height);
                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;
                const x = (targetSize.width - scaledWidth) / 2;
                const y = (targetSize.height - scaledHeight) / 2;

                ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

            } else if (fileName === 'background-game.png' || fileName === 'background_game.png') {
                // 背景图片处理
                canvas.width = targetSize.width;
                canvas.height = targetSize.height;

                // 填充并模糊
                ctx.filter = 'blur(8px)';
                ctx.drawImage(img, 0, 0, targetSize.width, targetSize.height);
                ctx.filter = 'none';

            } else {
                // 水果图片 - 添加圆形处理和磨砂背景
                const size = Math.max(targetSize.width, targetSize.height);
                canvas.width = size;
                canvas.height = size;

                // 创建圆形裁剪路径
                ctx.beginPath();
                ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2);
                ctx.clip();

                // 添加磨砂背景
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(0, 0, size, size);

                // 绘制图片
                const scale = size / Math.max(img.width, img.height);
                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;
                const x = (size - scaledWidth) / 2;
                const y = (size - scaledHeight) / 2;

                ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

                // 添加圆形边框
                ctx.beginPath();
                ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            canvas.toBlob(resolve, 'image/png');
        };
        img.src = dataUrl;
    });
}

// 获取目标尺寸
function getTargetSize(fileName) {
    const sizeMap = {
        '1.png': { width: 52, height: 52 },
        '2.png': { width: 80, height: 80 },
        '3.png': { width: 108, height: 108 },
        '4.png': { width: 119, height: 119 },
        '5.png': { width: 153, height: 152 },
        '6.png': { width: 183, height: 183 },
        '7.png': { width: 193, height: 193 },
        '8.png': { width: 258, height: 258 },
        '9.png': { width: 308, height: 308 },
        '10.png': { width: 308, height: 309 },
        '11.png': { width: 408, height: 408 },
        'background-game.png': { width: 720, height: 1280 },
        'background_game.png': { width: 720, height: 1280 },
        'start.png': { width: 163, height: 163 }
    };
    
    return sizeMap[fileName] || { width: 100, height: 100 };
}

// 生成 favicon
async function generateFavicon(imageBlob) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = 32;
            canvas.height = 32;
            
            ctx.drawImage(img, 0, 0, 32, 32);
            canvas.toBlob(resolve, 'image/png');
        };
        img.src = URL.createObjectURL(imageBlob);
    });
}

// 上传到 GitHub
async function uploadToGitHub(processedFiles, packId) {
    const totalFiles = processedFiles.size;
    let uploadedFiles = 0;
    
    for (const [fileName, blob] of processedFiles) {
        const base64Content = await blobToBase64(blob);
        
        await uploadSingleFile(fileName, base64Content, packId);
        
        uploadedFiles++;
        const progress = 70 + (uploadedFiles / totalFiles) * 25;
        showProgress(`上传 ${fileName}...`, progress);
    }
}

// 上传单个文件到 GitHub
async function uploadSingleFile(fileName, base64Content, packId) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.repo}/contents/assets/${packId}/${fileName}`;
    
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            message: `Add ${packId} asset: ${fileName}`,
            content: base64Content,
            branch: 'main'
        })
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to upload ${fileName}: ${error.message}`);
    }
}

// Blob 转 Base64
function blobToBase64(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function() {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.readAsDataURL(blob);
    });
}

// 显示进度
function showProgress(text, percent) {
    const progressSection = document.getElementById('progressSection');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressSection.style.display = 'block';
    progressFill.style.width = percent + '%';
    progressText.textContent = text;
    
    document.getElementById('uploadBtn').disabled = true;
}

// 隐藏进度
function hideProgress() {
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('uploadBtn').disabled = false;
}

// 显示结果
function showResult(packId) {
    const gameUrl = `${window.location.origin}/index.html?assets=${packId}`;
    
    document.getElementById('packId').textContent = packId;
    document.getElementById('gameLink').href = gameUrl;
    document.getElementById('resultSection').style.display = 'block';
    
    hideProgress();
    hideError();
}

// 复制游戏链接
function copyGameLink() {
    const gameLink = document.getElementById('gameLink').href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(gameLink).then(() => {
            alert('链接已复制到剪贴板！');
        });
    } else {
        // 兼容旧浏览器
        const textArea = document.createElement('textarea');
        textArea.value = gameLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('链接已复制到剪贴板！');
    }
}

// 显示错误
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorSection').style.display = 'block';
}

// 隐藏错误
function hideError() {
    document.getElementById('errorSection').style.display = 'none';
}
