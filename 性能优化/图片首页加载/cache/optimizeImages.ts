/**
 * 图片优化构建脚本
 * 自动生成不同质量和尺寸的图片版本
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { glob } from 'glob';

interface ImageOptimizationOptions {
  inputDir: string;
  outputDir: string;
  formats: Array<'webp' | 'jpg' | 'png' | 'avif'>;
  sizes: Array<{
    suffix: string;
    width?: number;
    height?: number;
    quality: number;
    blur?: number;
  }>;
}

const DEFAULT_CONFIG: ImageOptimizationOptions = {
  inputDir: 'src/assets/images',
  outputDir: 'src/assets/images/optimized',
  formats: ['webp', 'jpg'],
  sizes: [
    {
      suffix: '_thumb',
      width: 50,
      height: 50,
      quality: 10,
      blur: 2
    },
    {
      suffix: '_low',
      width: 200,
      height: 150,
      quality: 30
    },
    {
      suffix: '_medium',
      width: 800,
      height: 600,
      quality: 70
    },
    {
      suffix: '_high',
      width: 1200,
      height: 900,
      quality: 85
    }
  ]
};

/**
 * 图片优化处理器
 */
class ImageOptimizer {
  private config: ImageOptimizationOptions;

  constructor(config: Partial<ImageOptimizationOptions> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * 处理单张图片
   */
  async processImage(inputPath: string): Promise<void> {
    try {
      const { name, ext } = path.parse(inputPath);
      const relativePath = path.relative(this.config.inputDir, path.dirname(inputPath));
      const outputDir = path.join(this.config.outputDir, relativePath);

      // 确保输出目录存在
      await fs.promises.mkdir(outputDir, { recursive: true });

      // 获取原始图片信息
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      console.log(`Processing: ${inputPath}`);
      console.log(
        `Original size: ${metadata.width}x${metadata.height}, format: ${metadata.format}`
      );

      // 为每种尺寸和格式生成图片
      for (const size of this.config.sizes) {
        for (const format of this.config.formats) {
          await this.generateVariant(image, {
            name,
            outputDir,
            size,
            format,
            originalWidth: metadata.width!,
            originalHeight: metadata.height!
          });
        }
      }

      console.log(`✅ Completed: ${name}\n`);
    } catch (error) {
      console.error(`❌ Error processing ${inputPath}:`, error);
    }
  }

  /**
   * 生成图片变体
   */
  private async generateVariant(
    image: sharp.Sharp,
    options: {
      name: string;
      outputDir: string;
      size: (typeof DEFAULT_CONFIG.sizes)[0];
      format: string;
      originalWidth: number;
      originalHeight: number;
    }
  ): Promise<void> {
    const { name, outputDir, size, format, originalWidth, originalHeight } = options;

    let processedImage = image.clone();

    // 计算目标尺寸（保持宽高比）
    let targetWidth = size.width;
    let targetHeight = size.height;

    if (targetWidth && targetHeight) {
      const aspectRatio = originalWidth / originalHeight;
      const targetAspectRatio = targetWidth / targetHeight;

      if (aspectRatio > targetAspectRatio) {
        // 原图更宽，以高度为准
        targetWidth = Math.round(targetHeight * aspectRatio);
      } else {
        // 原图更高，以宽度为准
        targetHeight = Math.round(targetWidth / aspectRatio);
      }
    } else if (targetWidth) {
      targetHeight = Math.round(targetWidth / (originalWidth / originalHeight));
    } else if (targetHeight) {
      targetWidth = Math.round(targetHeight * (originalWidth / originalHeight));
    }

    // 调整尺寸
    if (targetWidth && targetHeight) {
      processedImage = processedImage.resize(targetWidth, targetHeight, {
        fit: 'cover',
        position: 'center'
      });
    }

    // 应用模糊效果
    if (size.blur) {
      processedImage = processedImage.blur(size.blur);
    }

    // 设置格式和质量
    switch (format) {
      case 'webp':
        processedImage = processedImage.webp({ quality: size.quality });
        break;
      case 'jpg':
      case 'jpeg':
        processedImage = processedImage.jpeg({ quality: size.quality });
        break;
      case 'png':
        processedImage = processedImage.png({ quality: size.quality });
        break;
      case 'avif':
        processedImage = processedImage.avif({ quality: size.quality });
        break;
    }

    // 生成输出文件名
    const outputFileName = `${name}${size.suffix}.${format}`;
    const outputPath = path.join(outputDir, outputFileName);

    // 保存文件
    await processedImage.toFile(outputPath);

    const stats = await fs.promises.stat(outputPath);
    console.log(`  Generated: ${outputFileName} (${Math.round(stats.size / 1024)}KB)`);
  }

  /**
   * 批量处理目录中的所有图片
   */
  async processDirectory(): Promise<void> {
    try {
      console.log('🚀 Starting image optimization...\n');

      // 查找所有图片文件
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'];
      const pattern = path.join(this.config.inputDir, '**', `*{${imageExtensions.join(',')}}`);
      const imagePaths = await glob(pattern);

      if (imagePaths.length === 0) {
        console.log('No images found in the input directory.');
        return;
      }

      console.log(`Found ${imagePaths.length} images to process...\n`);

      // 处理每张图片
      for (const imagePath of imagePaths) {
        await this.processImage(imagePath);
      }

      console.log('🎉 Image optimization completed!');
    } catch (error) {
      console.error('❌ Error during batch processing:', error);
    }
  }

  /**
   * 生成图片映射配置文件
   */
  async generateImageMap(): Promise<void> {
    try {
      const imageMap: Record<string, any> = {};
      const pattern = path.join(this.config.outputDir, '**', '*.*');
      const files = await glob(pattern);

      for (const file of files) {
        const relativePath = path.relative(this.config.outputDir, file);
        const { name, ext } = path.parse(file);

        // 解析文件名中的尺寸信息
        const match = name.match(/^(.+)_(thumb|low|medium|high)$/);
        if (match) {
          const [, baseName, size] = match;
          const format = ext.slice(1); // 移除点号

          if (!imageMap[baseName]) {
            imageMap[baseName] = {};
          }
          if (!imageMap[baseName][size]) {
            imageMap[baseName][size] = {};
          }

          imageMap[baseName][size][format] = `/${relativePath.replace(/\\/g, '/')}`;
        }
      }

      // 生成TypeScript配置文件
      const configContent = `/**
 * 自动生成的图片映射配置
 * 请勿手动修改此文件
 */

export const OPTIMIZED_IMAGES = ${JSON.stringify(imageMap, null, 2)} as const;

export type ImageSize = 'thumb' | 'low' | 'medium' | 'high';
export type ImageFormat = 'webp' | 'jpg' | 'png' | 'avif';

/**
 * 获取优化后的图片URL
 */
export function getOptimizedImageUrl(
  imageName: string,
  size: ImageSize = 'medium',
  format: ImageFormat = 'webp'
): string | null {
  return OPTIMIZED_IMAGES[imageName]?.[size]?.[format] || null;
}

/**
 * 获取图片的所有变体
 */
export function getImageVariants(imageName: string) {
  return OPTIMIZED_IMAGES[imageName] || null;
}
`;

      const configPath = path.join('src/config', 'optimizedImages.ts');
      await fs.promises.writeFile(configPath, configContent, 'utf-8');

      console.log('📝 Generated image map configuration file:', configPath);
    } catch (error) {
      console.error('❌ Error generating image map:', error);
    }
  }
}

/**
 * 命令行参数解析
 */
function parseArguments(): Partial<ImageOptimizationOptions> {
  const args = process.argv.slice(2);
  const config: Partial<ImageOptimizationOptions> = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];

    switch (key) {
      case '--input':
        config.inputDir = value;
        break;
      case '--output':
        config.outputDir = value;
        break;
      case '--formats':
        config.formats = value.split(',') as any;
        break;
    }
  }

  return config;
}

/**
 * 主函数
 */
async function main() {
  try {
    const config = parseArguments();
    const optimizer = new ImageOptimizer(config);

    // 检查是否安装了sharp
    try {
      await import('sharp');
    } catch {
      console.error('❌ Sharp is not installed. Please run: npm install sharp --save-dev');
      process.exit(1);
    }

    // 执行优化
    await optimizer.processDirectory();

    // 生成配置文件
    await optimizer.generateImageMap();
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

export { ImageOptimizer, DEFAULT_CONFIG };
