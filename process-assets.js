const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { createCanvas } = require('canvas');

// 定义基础目录
const assetsBaseDir = 'assets';

// 素材配置表（只保留文件名和尺寸信息）
const mapping = [
  { source: '1.png', size: 52 },
  { source: '2.png', size: 80 },
  { source: '3.png', size: 108 },
  { source: '4.png', size: 119 },
  { source: '5.png', size: { width: 153, height: 152 } },
  { source: '6.png', size: 183 },
  { source: '7.png', size: 193 },
  { source: '8.png', size: 258 },
  { source: '9.png', size: 308 },
  { source: '10.png', size: { width: 308, height: 309 } },
  { source: '11.png', size: 408 },
  { source: 'background-game.png', size: { width: 720, height: 1280 } },
  { source: 'background_game.png', size: { width: 720, height: 1280 } },
  { source: 'start.png', size: 163 }
];

// 音频文件配置表
const audioMapping = [
  { source: 'down.mp3' },
  { source: 'merge.mp3' }
];

// 检查文件是否存在（异步）
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

// 创建磨砂背景的函数
function createFrostedBackground(canvasSize) {
  const canvas = createCanvas(Math.round(canvasSize), Math.round(canvasSize));
  const ctx = canvas.getContext('2d');
  
  // 创建圆形路径
  ctx.beginPath();
  ctx.arc(canvasSize/2, canvasSize/2, canvasSize/2 - 2, 0, Math.PI * 2);
  ctx.clip(); // 裁剪为圆形
  
  // 创建半透明磨砂背景
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // 半透明白色背景
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  
  // 添加磨砂效果 - 随机噪点
  for (let i = 0; i < canvasSize * canvasSize / 100; i++) {
    const x = Math.random() * canvasSize;
    const y = Math.random() * canvasSize;
    const alpha = Math.random() * 0.2 + 0.1; // 0.1-0.3 的透明度
    
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(x, y, 1, 1);
  }
  
  // 添加一些较大的磨砂颗粒
  for (let i = 0; i < canvasSize * canvasSize / 500; i++) {
    const x = Math.random() * canvasSize;
    const y = Math.random() * canvasSize;
    const size = Math.random() * 2 + 1;
    const alpha = Math.random() * 0.15 + 0.05;
    
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(x, y, size, size);
  }
  
  return canvas;
}

async function processImage(item, assetPackDir) {
  try {
    const { source: sourceFile, size } = item;
    const sourcePath = path.join(assetPackDir, sourceFile);
    
    // 检查源文件是否存在
    if (!await fileExists(sourcePath)) {
      console.log(`  [跳过] ${sourceFile} 不存在于 ${assetPackDir}`);
      return;
    }

    // 兼容性处理：background-game.png 改名为 background_game.png
    const outputFileName = sourceFile === 'background-game.png' ? 'background_game.png' : sourceFile;
    const targetPath = path.join(assetPackDir, outputFileName);
    
    // 如果输入和输出是同一个文件，使用临时文件处理
    let actualTargetPath = targetPath;
    let needsRename = false;
    if (sourcePath === targetPath) {
      const ext = path.extname(targetPath);
      const baseName = path.basename(targetPath, ext);
      const dirName = path.dirname(targetPath);
      actualTargetPath = path.join(dirName, `${baseName}_tmp${ext}`);
      needsRename = true;
    }
    
    await fs.mkdir(path.dirname(targetPath), { recursive: true });

    const image = sharp(sourcePath);

    // 特殊处理 start.png
    if (sourceFile === 'start.png') {
        let resizeOptions = {};
        const background = { r: 0, g: 0, b: 0, alpha: 0 };
        const fit = 'contain';

        if (typeof size === 'number') {
            resizeOptions = { width: size, height: size, fit, background };
        } else {
            resizeOptions = { width: size.width, height: size.height, fit, background };
        }
        await image.resize(resizeOptions).toFile(actualTargetPath);
        
        // 如果使用了临时文件，重命名回原文件
        if (needsRename) {
          await fs.rename(actualTargetPath, targetPath);
        }
        
        console.log(`  [OK] start.png: ${sourceFile} -> ${outputFileName}`);
        return;
    }
    
    // 背景图片处理
    if (sourceFile === 'background-game.png' || sourceFile === 'background_game.png') {
      let finalImage = image.resize(size.width, size.height, { fit: 'cover', position: 'center' }).blur(8);
      let logoAdded = false;

      try {
        // 在根目录寻找 logo.png
        const logoPath = '../logo.png';
        if (await fileExists(logoPath)) {
          const logoBuffer = await sharp(logoPath).resize({ width: 600 }).toBuffer();
          finalImage = finalImage.composite([{ input: logoBuffer, top: 150, left: 60 }]);
          logoAdded = true;
        } else {
          console.log('  [注意] logo.png 未找到，背景图将不添加 logo。');
        }
      } catch (logoErr) {
        console.error('  [错误] 添加 logo 时出错:', logoErr);
      }
      
      await finalImage.toFile(actualTargetPath);
      
      // 如果使用了临时文件，重命名回原文件
      if (needsRename) {
        await fs.rename(actualTargetPath, targetPath);
      }
      
      console.log(`  [OK] ${sourceFile}: ${sourceFile} -> ${outputFileName}${logoAdded ? ' (已添加 logo)' : ''}`);
      return;
    }

    // 其他图片处理
    const metadata = await image.metadata();
    const canvasSize = typeof size === 'number' ? size : Math.max(size.width, size.height);
    const scale = canvasSize / Math.max(metadata.width, metadata.height);
    const scaledWidth = Math.round(metadata.width * scale);
    const scaledHeight = Math.round(metadata.height * scale);
    const left = Math.floor((canvasSize - scaledWidth) / 2);
    const top = Math.floor((canvasSize - scaledHeight) / 2);

    const frostedBuffer = createFrostedBackground(canvasSize).toBuffer('image/png');
    
    // 创建圆形边框的 Canvas
    const borderCanvas = createCanvas(canvasSize, canvasSize);
    const borderCtx = borderCanvas.getContext('2d');
    borderCtx.beginPath();
    borderCtx.arc(canvasSize/2, canvasSize/2, canvasSize/2 - 2, 0, Math.PI * 2);
    borderCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    borderCtx.lineWidth = 2;
    borderCtx.stroke();
    const circleBuffer = borderCanvas.toBuffer('image/png');

    // 创建圆形遮罩
    const maskCanvas = createCanvas(canvasSize, canvasSize);
    const maskCtx = maskCanvas.getContext('2d');
    maskCtx.beginPath();
    maskCtx.arc(canvasSize/2, canvasSize/2, canvasSize/2 - 2, 0, Math.PI * 2);
    maskCtx.fillStyle = 'black';
    maskCtx.fill();
    const maskBuffer = maskCanvas.toBuffer('image/png');

    const imageBuffer = await image.resize(scaledWidth, scaledHeight, { fit: 'fill' }).toBuffer();

    await sharp({
        create: {
            width: canvasSize,
            height: canvasSize,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    }).composite([
        { input: frostedBuffer, blend: 'over' },
        { input: imageBuffer, blend: 'over', left, top },
        { input: maskBuffer, blend: 'dest-in' },
        { input: circleBuffer, blend: 'over' }
    ]).toFile(actualTargetPath);
    
    // 如果使用了临时文件，重命名回原文件
    if (needsRename) {
      await fs.rename(actualTargetPath, targetPath);
    }
      
    console.log(`  [OK] ${sourceFile}: ${sourceFile} -> ${outputFileName}`);
  } catch (err) {
    console.error(`  [错误] 处理 ${item.source} 时出错:`, err);
  }
}

async function processAudio(item, assetPackDir) {
  try {
    const { source: sourceFile } = item;
    const sourcePath = path.join(assetPackDir, sourceFile);
    
    // 检查源文件是否存在
    if (!await fileExists(sourcePath)) {
      console.log(`  [跳过] ${sourceFile} 不存在于 ${assetPackDir}`);
      return;
    }

    console.log(`  [OK] ${sourceFile}: 音频文件无需处理`);
  } catch (err) {
    console.error(`  [错误] 处理音频 ${item.source} 时出错:`, err);
  }
}

async function createFavicon(assetPackDir) {
  try {
    const sourcePath = path.join(assetPackDir, '11.png');
    if (await fileExists(sourcePath)) {
      const faviconTargetPath = path.join(assetPackDir, 'favicon.png');
      
      // 使用 sharp 将 11.png 转换为 favicon.png
      await sharp(sourcePath)
        .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toFormat('png')
        .toFile(faviconTargetPath);
      
      console.log(`  [OK] favicon.png: 11.png -> favicon.png`);
    } else {
      console.log(`  [跳过] 11.png 不存在，无法创建 favicon.png`);
    }
  } catch (err) {
    console.error(`  [错误] 创建 favicon.png 时出错:`, err);
  }
}

async function main() {
    let packsToProcess = [];
    const packArg = process.argv[2];

    if (packArg) {
        packsToProcess.push(packArg);
        console.log(`指定处理素材包: ${packArg}`);
    } else {
        console.log(`未指定素材包，将处理 "${assetsBaseDir}" 目录下的所有素材包...`);
        try {
            const entries = await fs.readdir(assetsBaseDir, { withFileTypes: true });
            packsToProcess = entries
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
        } catch (error) {
            console.error(`错误: 无法读取素材目录 "${assetsBaseDir}"。请确保该目录存在。`);
            return;
        }
    }

    if (packsToProcess.length === 0) {
        console.log('未找到可处理的素材包。');
        return;
    }

    for (const packName of packsToProcess) {
        console.log(`\n--- 开始处理素材包: ${packName} ---`);
        const assetPackDir = path.join(assetsBaseDir, packName);

        // 处理所有映射内的图片
        for (const item of mapping) {
            await processImage(item, assetPackDir);
        }

        // 处理所有映射内的音频
        for (const item of audioMapping) {
            await processAudio(item, assetPackDir);
        }

        // 创建 favicon.png
        await createFavicon(assetPackDir);

        console.log(`--- 素材包处理完成: ${packName} ---`);
    }

    console.log('\n所有任务处理完毕。');
}

main().catch(err => {
    console.error("发生严重错误:", err);
});
