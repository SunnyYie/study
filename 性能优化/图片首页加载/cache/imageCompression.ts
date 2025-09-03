/**
 * 图片压缩工具
 * 用于生成低质量版本的图片，支持模糊预览
 */

export interface CompressOptions {
  /** 最大宽度 */
  maxWidth?: number;
  /** 最大高度 */
  maxHeight?: number;
  /** 压缩质量 (0-1) */
  quality?: number;
  /** 输出格式 */
  format?: 'jpeg' | 'webp' | 'png';
  /** 是否应用模糊效果 */
  blur?: boolean;
  /** 模糊半径 */
  blurRadius?: number;
}

/**
 * 压缩图片
 */
export const compressImage = (
  file: File | string,
  options: CompressOptions = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 100,
      maxHeight = 100,
      quality = 0.1,
      format = 'jpeg',
      blur = true,
      blurRadius = 2
    } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('Canvas context not supported'));
      return;
    }

    img.onload = () => {
      try {
        // 计算新的尺寸，保持宽高比
        let { width, height } = img;
        const aspectRatio = width / height;

        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }

        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }

        // 设置canvas尺寸
        canvas.width = width;
        canvas.height = height;

        // 应用模糊效果
        if (blur) {
          ctx.filter = `blur(${blurRadius}px)`;
        }

        // 绘制图片
        ctx.drawImage(img, 0, 0, width, height);

        // 导出为Base64
        const mimeType =
          format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';

        const base64 = canvas.toDataURL(mimeType, quality);
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // 处理不同的输入类型
    if (typeof file === 'string') {
      img.crossOrigin = 'anonymous';
      img.src = file;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    }
  });
};

/**
 * 批量压缩图片
 */
export const compressImages = async (
  images: Array<{ url: string; name: string }>,
  options: CompressOptions = {}
): Promise<Array<{ name: string; original: string; compressed: string }>> => {
  const results = [];

  for (const image of images) {
    try {
      const compressed = await compressImage(image.url, options);
      results.push({
        name: image.name,
        original: image.url,
        compressed
      });
    } catch (error) {
      console.error(`Failed to compress image ${image.name}:`, error);
      // 压缩失败时，使用原图
      results.push({
        name: image.name,
        original: image.url,
        compressed: image.url
      });
    }
  }

  return results;
};

/**
 * 生成CSS内联图片
 */
export const generateInlineCSS = (
  images: Array<{ name: string; compressed: string }>,
  className = 'low-quality-bg'
): string => {
  const cssRules = images
    .map(({ name, compressed }, index) => {
      return `.${className}-${index} {
  background-image: url('${compressed}');
  background-size: cover;
  background-position: center;
  filter: blur(5px);
  transform: scale(1.1);
}`;
    })
    .join('\n\n');

  return cssRules;
};

/**
 * 创建预加载link标签
 */
export const createPreloadLinks = (imageUrls: string[]): void => {
  imageUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * 检测图片格式支持
 */
export const detectImageSupport = (): Promise<{
  webp: boolean;
  avif: boolean;
}> => {
  return new Promise((resolve) => {
    const webpTest =
      'UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    const avifTest =
      'AAAAGGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';

    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 1;

    const results = { webp: false, avif: false };
    let testsCompleted = 0;

    const checkComplete = () => {
      testsCompleted++;
      if (testsCompleted === 2) {
        resolve(results);
      }
    };

    // 测试WebP支持
    const webpImg = new Image();
    webpImg.onload = webpImg.onerror = () => {
      results.webp = webpImg.height === 1;
      checkComplete();
    };
    webpImg.src = 'data:image/webp;base64,' + webpTest;

    // 测试AVIF支持
    const avifImg = new Image();
    avifImg.onload = avifImg.onerror = () => {
      results.avif = avifImg.height === 1;
      checkComplete();
    };
    avifImg.src = 'data:image/avif;base64,' + avifTest;
  });
};

/**
 * 获取最佳图片格式
 */
export const getBestImageFormat = async (): Promise<'avif' | 'webp' | 'jpeg'> => {
  const support = await detectImageSupport();

  if (support.avif) return 'avif';
  if (support.webp) return 'webp';
  return 'jpeg';
};

/**
 * 图片压缩预设配置
 */
export const COMPRESSION_PRESETS = {
  // 超小预览图 (用于模糊背景)
  thumbnail: {
    maxWidth: 50,
    maxHeight: 50,
    quality: 0.1,
    format: 'jpeg' as const,
    blur: true,
    blurRadius: 2
  },

  // 小尺寸预览
  small: {
    maxWidth: 200,
    maxHeight: 150,
    quality: 0.3,
    format: 'webp' as const,
    blur: false
  },

  // 中等尺寸
  medium: {
    maxWidth: 800,
    maxHeight: 600,
    quality: 0.7,
    format: 'webp' as const,
    blur: false
  },

  // 高质量
  high: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.9,
    format: 'webp' as const,
    blur: false
  }
};
