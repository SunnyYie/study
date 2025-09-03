/**
 * 图片资源配置
 * 按加载优先级和使用场景组织
 */

// 图片加载优先级配置
export const IMAGE_PRIORITIES = {
  CRITICAL: 'high' as const, // 首屏关键图片
  IMPORTANT: 'medium' as const, // 重要但非首屏图片
  LAZY: 'low' as const // 懒加载图片
};

// DC静态页面图片配置
export const DC_STATIC_IMAGES = {
  // 关键图片 - 优先加载
  critical: {
    title: {
      original: () => import('@/assets/images/dc/static_title.png'),
      lowQuality: () => import('@/assets/images/dc/static_title_low.png') // 需要生成低质量版本
    },
    button1: {
      original: () => import('@/assets/images/dc/static_btn1.png')
    },
    button2: {
      original: () => import('@/assets/images/dc/static_btn2.png')
    }
  },

  // 背景图片 - 渐进式加载
  backgrounds: {
    bg1: {
      original: () => import('@/assets/images/dc/static_bg_2.JPEG'),
      lowQuality: () => import('@/assets/images/dc/static_bg_2_low.jpg') // 需要生成低质量版本
    },
    bg2: {
      original: () => import('@/assets/images/dc/static_bg.png'),
      lowQuality: () => import('@/assets/images/dc/static_bg_low.png') // 需要生成低质量版本
    }
  }
};

// 登录页图片配置 - 预加载配置
export const LOGIN_PAGE_IMAGES = {
  // 预先配置登录页需要的图片
  backgrounds: [
    () => import('@/assets/images/login/bg1.jpg'),
    () => import('@/assets/images/login/bg2.jpg')
  ],
  logos: [() => import('@/assets/images/login/logo.png')],
  icons: [
    () => import('@/assets/images/login/icon1.png'),
    () => import('@/assets/images/login/icon2.png')
  ]
};

// 公共图片配置
export const COMMON_IMAGES = {
  gov: () => import('@/assets/images/hexin/gov.png')
  // 添加其他公共图片
};

/**
 * 图片资源加载器
 */
export class ImageResourceLoader {
  private loadedResources = new Map<string, string>();
  private loadingPromises = new Map<string, Promise<string>>();

  /**
   * 加载单个图片资源
   */
  async loadImage(importFn: () => Promise<any>, key: string): Promise<string> {
    // 检查是否已加载
    if (this.loadedResources.has(key)) {
      return this.loadedResources.get(key)!;
    }

    // 检查是否正在加载
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key)!;
    }

    // 开始加载
    const loadPromise = importFn()
      .then((module) => {
        const url = module.default;
        this.loadedResources.set(key, url);
        this.loadingPromises.delete(key);
        return url;
      })
      .catch((error) => {
        this.loadingPromises.delete(key);
        throw error;
      });

    this.loadingPromises.set(key, loadPromise);
    return loadPromise;
  }

  /**
   * 批量加载图片资源
   */
  async loadImages(config: Record<string, () => Promise<any>>): Promise<Record<string, string>> {
    const results: Record<string, string> = {};

    const loadPromises = Object.entries(config).map(async ([key, importFn]) => {
      try {
        const url = await this.loadImage(importFn, key);
        results[key] = url;
      } catch (error) {
        console.warn(`Failed to load image: ${key}`, error);
        results[key] = '';
      }
    });

    await Promise.allSettled(loadPromises);
    return results;
  }

  /**
   * 预加载关键图片
   */
  async preloadCriticalImages() {
    const criticalImages: Record<string, () => Promise<any>> = {};

    // 添加关键图片
    Object.entries(DC_STATIC_IMAGES.critical).forEach(([key, config]) => {
      criticalImages[key] = config.original;
    });

    return this.loadImages(criticalImages);
  }

  /**
   * 预加载登录页图片
   */
  async preloadLoginImages() {
    const loginImages: Record<string, () => Promise<any>> = {};

    // 添加登录页图片
    LOGIN_PAGE_IMAGES.backgrounds.forEach((importFn, index) => {
      loginImages[`login_bg_${index}`] = importFn;
    });

    LOGIN_PAGE_IMAGES.logos.forEach((importFn, index) => {
      loginImages[`login_logo_${index}`] = importFn;
    });

    LOGIN_PAGE_IMAGES.icons.forEach((importFn, index) => {
      loginImages[`login_icon_${index}`] = importFn;
    });

    return this.loadImages(loginImages);
  }

  /**
   * 获取已加载的图片URL
   */
  getImageUrl(key: string): string | null {
    return this.loadedResources.get(key) || null;
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.loadedResources.clear();
    this.loadingPromises.clear();
  }
}

// 全局图片资源加载器
export const globalImageLoader = new ImageResourceLoader();

/**
 * 图片压缩配置
 * 用于生成不同质量的图片版本
 */
export const IMAGE_COMPRESSION_CONFIG = {
  // 低质量图片配置（用于模糊预览）
  lowQuality: {
    maxWidth: 50,
    maxHeight: 50,
    quality: 0.1,
    format: 'jpeg'
  },

  // 中等质量图片配置
  mediumQuality: {
    maxWidth: 800,
    maxHeight: 600,
    quality: 0.7,
    format: 'webp'
  },

  // 高质量图片配置
  highQuality: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.9,
    format: 'webp'
  }
};

/**
 * 根据设备特性获取最佳图片配置
 */
export const getOptimalImageConfig = () => {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const connection = (navigator as any).connection;
  const isSlowNetwork =
    connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';
  const isLowEndDevice = devicePixelRatio < 2;

  if (isSlowNetwork || isLowEndDevice) {
    return IMAGE_COMPRESSION_CONFIG.mediumQuality;
  }

  return IMAGE_COMPRESSION_CONFIG.highQuality;
};
