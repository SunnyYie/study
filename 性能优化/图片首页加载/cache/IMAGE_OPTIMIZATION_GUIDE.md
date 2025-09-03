# 图片优化使用指南

本项目实现了一套完整的图片优化策略，包括渐进式加载、智能缓存、CDN支持等功能。

## 🎯 主要特性

### 1. 渐进式图片加载

- **模糊预览**: 先显示极小的模糊图片，然后替换为高清图片
- **优先级加载**: 根据重要性分级加载图片
- **智能缓存**: 自动缓存已加载的图片

### 2. 响应式图片适配

- **设备适配**: 根据屏幕尺寸和像素密度选择合适的图片
- **网络感知**: 在慢速网络下自动降低图片质量
- **格式优化**: 优先使用WebP/AVIF等现代格式

### 3. 预加载策略

- **关键图片**: 页面首屏图片优先加载
- **相邻图片**: 轮播图预加载相邻的图片
- **悬停预加载**: 鼠标悬停时预加载相关页面图片

## 📦 核心组件

### ProgressiveImage 组件

用于单张图片的渐进式加载：

```vue
<template>
  <ProgressiveImage
    :high-quality-url="imageUrl"
    :low-quality-url="thumbnailUrl"
    alt="图片描述"
    :priority="'high'"
    @high-quality-load="onImageLoad"
    @error="onImageError"
  />
</template>
```

**属性说明:**

- `high-quality-url`: 高质量图片URL（必需）
- `low-quality-url`: 低质量预览图URL（可选）
- `priority`: 加载优先级 ('high' | 'medium' | 'low')
- `auto-load`: 是否自动开始加载（默认true）
- `timeout`: 加载超时时间（毫秒）

### ProgressiveCarousel 组件

用于图片轮播的渐进式加载：

```vue
<template>
  <ProgressiveCarousel
    :images="backgroundImages"
    :interval="5000"
    :autoplay="true"
    :show-indicators="true"
    @all-images-loaded="onCarouselReady"
  />
</template>

<script setup>
const backgroundImages = ref([
  {
    highQualityUrl: '/images/bg1.jpg',
    lowQualityUrl: '/images/bg1_thumb.jpg'
  },
  {
    highQualityUrl: '/images/bg2.jpg',
    lowQualityUrl: '/images/bg2_thumb.jpg'
  }
]);
</script>
```

## 🛠️ 工具函数

### 图片预加载

```typescript
import { preloadImages, globalImagePreloader } from '@/utils/imageOptimization';

// 批量预加载
await preloadImages(['/images/image1.jpg', '/images/image2.jpg'], {
  maxConcurrent: 3,
  onProgress: (loaded, total) => {
    console.log(`已加载: ${loaded}/${total}`);
  }
});

// 使用预加载管理器
globalImagePreloader.addPreloadQueue('login', ['/images/login-bg.jpg', '/images/login-logo.png']);

await globalImagePreloader.startPreload('login', 'medium');
```

### 图片压缩

```typescript
import { compressImage, COMPRESSION_PRESETS } from '@/utils/imageCompression';

// 压缩单张图片
const compressedUrl = await compressImage('/images/large-image.jpg', {
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.7,
  format: 'webp'
});

// 使用预设配置
const thumbnailUrl = await compressImage('/images/image.jpg', COMPRESSION_PRESETS.thumbnail);
```

### CDN图片优化

```typescript
import { imageUrlGenerator } from '@/config/cdnConfig';

// 生成优化的CDN URL
const optimizedUrl = imageUrlGenerator.generateUrl('/images/photo.jpg', {
  width: 800,
  height: 600,
  quality: 80,
  format: 'webp'
});

// 生成响应式图片URL集合
const responsiveUrls = imageUrlGenerator.generateResponsiveUrls('/images/photo.jpg');
```

## ⚙️ 配置说明

### 环境变量配置

在 `.env` 文件中配置：

```bash
# CDN服务类型 (qiniu|aliyun|tencent|local)
VITE_CDN_SERVICE=qiniu

# CDN域名
VITE_CDN_DOMAIN=https://your-bucket.qiniucdn.com

# 是否启用图片优化
VITE_IMAGE_OPTIMIZATION=true

# 默认图片质量
VITE_DEFAULT_IMAGE_QUALITY=80
```

### 图片资源组织

在 `src/config/imageResources.ts` 中配置图片资源：

```typescript
export const DC_STATIC_IMAGES = {
  critical: {
    title: {
      original: () => import('@/assets/images/dc/static_title.png'),
      lowQuality: () => import('@/assets/images/dc/static_title_low.png')
    }
  },
  backgrounds: {
    bg1: {
      original: () => import('@/assets/images/dc/static_bg_2.JPEG'),
      lowQuality: () => import('@/assets/images/dc/static_bg_2_low.jpg')
    }
  }
};
```

## 🚀 最佳实践

### 1. 图片命名规范

```
images/
├── dc/
│   ├── static_title.png          # 原始高质量图片
│   ├── static_title_low.png      # 低质量预览图
│   ├── static_title_thumb.jpg    # 缩略图
│   └── ...
```

### 2. 加载优先级策略

```typescript
// 首屏关键图片 - 立即加载
priority: 'high';

// 重要但非首屏图片 - 适中优先级
priority: 'medium';

// 懒加载图片 - 低优先级
priority: 'low';
```

### 3. 预加载策略

```typescript
// 页面初始化时预加载关键图片
onMounted(async () => {
  await globalImageLoader.preloadCriticalImages();
});

// 用户交互时预加载相关图片
const handleButtonHover = () => {
  globalImagePreloader.startPreload('nextPage', 'medium');
};
```

### 4. 错误处理

```typescript
// 组件级错误处理
<ProgressiveImage
  :high-quality-url="imageUrl"
  @error="handleImageError"
>
  <template #error>
    <div class="image-error">
      <span>图片加载失败</span>
    </div>
  </template>
</ProgressiveImage>

// 全局错误处理
const handleImageError = (error: string) => {
  console.warn('Image load failed:', error);
  // 可以上报错误信息或使用备用图片
};
```

## 📊 性能监控

### 加载性能指标

```typescript
// 监控图片加载时间
const startTime = performance.now();

await preloadImage(imageUrl);

const loadTime = performance.now() - startTime;
console.log(`Image loaded in ${loadTime}ms`);
```

### 缓存效率

```typescript
// 检查缓存命中率
const cacheSize = globalImagePreloader.getCacheSize();
console.log(`Current cache size: ${cacheSize} images`);
```

## 🔧 开发调试

### 开发模式下的调试信息

开发环境会显示额外的调试信息：

- 预加载进度提示
- 图片加载时间统计
- 缓存命中率显示

### 性能分析

使用浏览器开发者工具的Network面板：

1. 查看图片加载顺序
2. 检查图片大小和格式
3. 分析加载时间分布

## 🎨 自定义样式

### 加载状态样式

```scss
.progressive-image {
  &.is-loading {
    .placeholder-shimmer {
      animation: shimmer 1.5s infinite;
    }
  }

  &.high-quality-loaded {
    .progressive-image__high-quality {
      opacity: 1;
    }
  }
}
```

### 响应式适配

```scss
@media (max-width: 768px) {
  .progressive-image {
    .title-image {
      max-width: 70%;
      max-height: 150px;
    }
  }
}
```

## 📝 注意事项

1. **低质量图片生成**: 需要使用图片压缩工具生成对应的低质量版本
2. **CDN配置**: 根据使用的CDN服务调整配置参数
3. **浏览器兼容性**: WebP格式在旧版浏览器可能不支持，需要提供备用格式
4. **内存管理**: 大量图片缓存可能占用较多内存，适时清理缓存

## 🔄 后续优化建议

1. **自动化图片处理**: 集成构建工具自动生成多种规格的图片
2. **智能预测**: 基于用户行为预测需要预加载的图片
3. **离线缓存**: 使用Service Worker实现图片离线缓存
4. **A/B测试**: 测试不同加载策略的效果

通过以上优化策略，可以显著提升图片加载性能和用户体验。
