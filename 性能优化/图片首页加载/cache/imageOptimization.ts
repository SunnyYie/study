/**
 * 图片优化工具类
 * 支持渐进式加载、预加载、缓存等功能
 */

export interface ImageLoadOptions {
  /** 低质量图片URL（模糊图） */
  lowQualityUrl?: string;
  /** 高质量图片URL */
  highQualityUrl: string;
  /** 加载优先级 */
  priority?: 'high' | 'medium' | 'low';
  /** 是否启用缓存 */
  cache?: boolean;
  /** 加载超时时间（毫秒） */
  timeout?: number;
}

export interface ProgressiveImageState {
  isLoading: boolean;
  isHighQualityLoaded: boolean;
  currentUrl: string;
  error: string | null;
}

// 图片缓存
const imageCache = new Map<string, HTMLImageElement>();

/**
 * 预加载单张图片
 */
export const preloadImage = (src: string, timeout = 10000): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    // 检查缓存
    if (imageCache.has(src)) {
      resolve(imageCache.get(src)!);
      return;
    }

    const img = new Image();
    let timeoutId: number;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
    };

    img.onload = () => {
      cleanup();
      imageCache.set(src, img);
      resolve(img);
    };

    img.onerror = () => {
      cleanup();
      reject(new Error(`Failed to load image: ${src}`));
    };

    // 设置超时
    timeoutId = setTimeout(() => {
      reject(new Error(`Image load timeout: ${src}`));
    }, timeout);

    img.src = src;
  });
};

/**
 * 批量预加载图片
 */
export const preloadImages = async (
  urls: string[],
  options?: {
    maxConcurrent?: number;
    timeout?: number;
    onProgress?: (loaded: number, total: number) => void;
  }
): Promise<HTMLImageElement[]> => {
  const { maxConcurrent = 3, timeout = 10000, onProgress } = options || {};
  const results: HTMLImageElement[] = [];
  let loadedCount = 0;

  // 分批加载，控制并发数
  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent);
    const batchPromises = batch.map((url) =>
      preloadImage(url, timeout).catch((error) => {
        console.warn(`Failed to preload image: ${url}`, error);
        return null;
      })
    );

    const batchResults = await Promise.allSettled(batchPromises);

    batchResults.forEach((result, index) => {
      loadedCount++;
      if (result.status === 'fulfilled' && result.value) {
        results.push(result.value);
      }
      onProgress?.(loadedCount, urls.length);
    });
  }

  return results;
};

/**
 * 渐进式图片加载 Hook
 */
export const useProgressiveImage = (options: ImageLoadOptions) => {
  const state = reactive<ProgressiveImageState>({
    isLoading: true,
    isHighQualityLoaded: false,
    currentUrl: options.lowQualityUrl || '',
    error: null
  });

  const loadImage = async () => {
    try {
      state.isLoading = true;
      state.error = null;

      // 如果有低质量图片，先显示
      if (options.lowQualityUrl) {
        state.currentUrl = options.lowQualityUrl;
        // 不等待低质量图片加载完成，直接开始加载高质量图片
        preloadImage(options.lowQualityUrl, 3000).catch(() => {
          // 低质量图片加载失败，直接加载高质量图片
        });
      }

      // 加载高质量图片
      await preloadImage(options.highQualityUrl, options.timeout || 10000);

      // 高质量图片加载完成，切换显示
      state.currentUrl = options.highQualityUrl;
      state.isHighQualityLoaded = true;
      state.isLoading = false;
    } catch (error) {
      state.error = (error as Error).message;
      state.isLoading = false;

      // 如果高质量图片加载失败，但有低质量图片，继续显示低质量图片
      if (options.lowQualityUrl && !state.currentUrl) {
        state.currentUrl = options.lowQualityUrl;
      }
    }
  };

  return {
    state: readonly(state),
    loadImage
  };
};

/**
 * 图片预加载管理器
 */
export class ImagePreloadManager {
  private preloadQueues: Map<string, string[]> = new Map();
  private isPreloading: Map<string, boolean> = new Map();

  /**
   * 添加预加载队列
   */
  addPreloadQueue(queueName: string, urls: string[]) {
    this.preloadQueues.set(queueName, urls);
  }

  /**
   * 开始预加载指定队列
   */
  async startPreload(queueName: string, priority: 'high' | 'medium' | 'low' = 'medium') {
    if (this.isPreloading.get(queueName)) {
      return;
    }

    const urls = this.preloadQueues.get(queueName);
    if (!urls) {
      return;
    }

    this.isPreloading.set(queueName, true);

    try {
      const maxConcurrent = priority === 'high' ? 5 : priority === 'medium' ? 3 : 1;
      await preloadImages(urls, { maxConcurrent });
    } finally {
      this.isPreloading.set(queueName, false);
    }
  }

  /**
   * 清除缓存
   */
  clearCache() {
    imageCache.clear();
  }

  /**
   * 获取缓存大小
   */
  getCacheSize() {
    return imageCache.size;
  }
}

// 全局预加载管理器
export const globalImagePreloader = new ImagePreloadManager();

/**
 * 生成不同质量的图片URL（如果使用CDN）
 */
export const generateImageUrls = (
  baseUrl: string,
  options?: {
    sizes?: Array<'small' | 'medium' | 'large'>;
    formats?: Array<'webp' | 'jpg' | 'png'>;
    quality?: number;
  }
) => {
  const { sizes = ['small', 'large'], formats = ['webp', 'jpg'], quality = 80 } = options || {};

  const urls: Record<string, string> = {};

  // 如果是本地图片，直接返回
  if (!baseUrl.includes('http')) {
    urls.original = baseUrl;
    return urls;
  }

  // CDN 图片处理示例（需要根据实际CDN服务调整）
  sizes.forEach((size) => {
    formats.forEach((format) => {
      const sizeParams = {
        small: 'w_400,h_300',
        medium: 'w_800,h_600',
        large: 'w_1200,h_900'
      };

      // 示例CDN参数，实际需要根据CDN服务调整
      urls[`${size}_${format}`] = `${baseUrl}?w=${sizeParams[size]}&f=${format}&q=${quality}`;
    });
  });

  return urls;
};

/**
 * 获取设备适合的图片尺寸
 */
export const getOptimalImageSize = () => {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const screenWidth = window.innerWidth * devicePixelRatio;

  if (screenWidth <= 768) {
    return 'small';
  } else if (screenWidth <= 1200) {
    return 'medium';
  } else {
    return 'large';
  }
};
