<template>
  <div class="progressive-carousel" :class="{ 'is-loading': isLoading }">
    <!-- 背景轮播容器 -->
    <div class="carousel-container">
      <ProgressiveImage
        v-for="(image, index) in imageList"
        :key="`bg-${index}`"
        :low-quality-url="image.lowQualityUrl"
        :high-quality-url="image.highQualityUrl"
        :alt="`背景图 ${index + 1}`"
        :class="[
          'carousel-slide',
          {
            'active': index === currentIndex,
            'next': index === getNextIndex(),
            'prev': index === getPrevIndex()
          }
        ]"
        :priority="index === 0 ? 'high' : index === 1 ? 'medium' : 'low'"
        :auto-load="index <= 1"
        :image-style="slideImageStyle"
        @high-quality-load="onImageLoad(index)"
        @error="onImageError(index, 'image_error')"
        ref="imageRefs"
      />
    </div>

    <!-- 加载进度指示器 -->
    <div v-if="showProgress && isLoading" class="loading-progress">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${loadProgress}%` }"
        ></div>
      </div>
      <div class="progress-text">
        正在加载图片... {{ Math.round(loadProgress) }}%
      </div>
    </div>

    <!-- 轮播指示点 -->
    <div v-if="showIndicators && !isLoading" class="carousel-indicators">
      <button
        v-for="(_, index) in imageList"
        :key="`indicator-${index}`"
        class="indicator"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
        :aria-label="`切换到第 ${index + 1} 张图片`"
      >
        <span class="indicator-dot"></span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressiveImage from '@/components/ProgressiveImage.vue';

interface CarouselImage {
  highQualityUrl: string;
  lowQualityUrl?: string;
}

interface Props {
  /** 图片列表 */
  images: CarouselImage[];
  /** 轮播间隔时间（毫秒） */
  interval?: number;
  /** 是否自动播放 */
  autoplay?: boolean;
  /** 是否显示指示器 */
  showIndicators?: boolean;
  /** 是否显示加载进度 */
  showProgress?: boolean;
  /** 图片样式 */
  slideImageStyle?: Record<string, any>;
  /** 预加载数量 */
  preloadCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  interval: 5000,
  autoplay: true,
  showIndicators: true,
  showProgress: true,
  slideImageStyle: () => ({}),
  preloadCount: 2
});

const emit = defineEmits<{
  slideChange: [index: number];
  allImagesLoaded: [];
  imageLoadError: [index: number, error: string];
}>();

// 响应式数据
const currentIndex = ref(0);
const isLoading = ref(true);
const loadedImages = ref(new Set<number>());
const imageRefs = ref<InstanceType<typeof ProgressiveImage>[]>([]);
let autoplayTimer: number | null = null;

// 计算属性
const imageList = computed(() => props.images);

const loadProgress = computed(() => {
  if (imageList.value.length === 0) return 0;
  return (loadedImages.value.size / imageList.value.length) * 100;
});

// 方法
const getNextIndex = () => {
  return (currentIndex.value + 1) % imageList.value.length;
};

const getPrevIndex = () => {
  return (currentIndex.value - 1 + imageList.value.length) % imageList.value.length;
};

const goToSlide = (index: number) => {
  if (index >= 0 && index < imageList.value.length) {
    currentIndex.value = index;
    emit('slideChange', index);

    // 预加载相邻图片
    preloadAdjacentImages(index);
  }
};

const nextSlide = () => {
  goToSlide(getNextIndex());
};

const prevSlide = () => {
  goToSlide(getPrevIndex());
};

// 预加载相邻图片
const preloadAdjacentImages = (centerIndex: number) => {
  const toPreload = [];

  // 预加载前后几张图片
  for (let i = 1; i <= props.preloadCount; i++) {
    const nextIdx = (centerIndex + i) % imageList.value.length;
    const prevIdx = (centerIndex - i + imageList.value.length) % imageList.value.length;

    toPreload.push(nextIdx, prevIdx);
  }

  // 触发预加载
  toPreload.forEach(index => {
    const imageRef = imageRefs.value[index];
    if (imageRef && !loadedImages.value.has(index)) {
      imageRef.startLoad();
    }
  });
};

// 自动播放控制
const startAutoplay = () => {
  if (!props.autoplay || imageList.value.length <= 1) return;

  stopAutoplay();
  autoplayTimer = window.setInterval(nextSlide, props.interval);
};

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
};

// 事件处理
const onImageLoad = (index: number) => {
  loadedImages.value.add(index);

  // 检查是否所有关键图片都已加载
  const criticalCount = Math.min(2, imageList.value.length);
  const criticalLoaded = Array.from(loadedImages.value).filter(i => i < criticalCount).length;

  if (criticalLoaded >= criticalCount) {
    isLoading.value = false;
    emit('allImagesLoaded');

    // 开始自动播放
    if (props.autoplay) {
      nextTick(() => {
        startAutoplay();
      });
    }
  }

  // 预加载相邻图片
  if (index === currentIndex.value) {
    preloadAdjacentImages(index);
  }
};

const onImageError = (index: number, error: string) => {
  console.warn(`Failed to load carousel image ${index}:`, error);
  emit('imageLoadError', index, error);
};

// 键盘导航
const handleKeydown = (event: KeyboardEvent) => {
  if (isLoading.value) return;

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      prevSlide();
      break;
    case 'ArrowRight':
      event.preventDefault();
      nextSlide();
      break;
  }
};

// 暴露方法
defineExpose({
  nextSlide,
  prevSlide,
  goToSlide,
  startAutoplay,
  stopAutoplay,
  currentIndex: readonly(currentIndex),
  isLoading: readonly(isLoading)
});

// 生命周期
onMounted(() => {
  // 立即开始加载前两张图片
  nextTick(() => {
    if (imageRefs.value.length > 0) {
      imageRefs.value[0]?.startLoad();
      if (imageRefs.value.length > 1) {
        imageRefs.value[1]?.startLoad();
      }
    }
  });

  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  stopAutoplay();
  window.removeEventListener('keydown', handleKeydown);
});

// 监听鼠标悬停停止自动播放
const handleMouseEnter = () => {
  stopAutoplay();
};

const handleMouseLeave = () => {
  if (props.autoplay && !isLoading.value) {
    startAutoplay();
  }
};
</script>

<style lang="scss" scoped>
.progressive-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: scale(1.05);
  transition: opacity 1s ease-in-out, transform 1s ease-in-out;
  will-change: opacity, transform;

  &.active {
    opacity: 1;
    transform: scale(1);
    z-index: 2;
  }

  &.next {
    z-index: 1;
  }

  &.prev {
    z-index: 1;
  }
}

.loading-progress {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  text-align: center;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.progress-bar {
  width: 200px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 500;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 3;
}

.indicator {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }
}

.indicator-dot {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;

  .indicator.active & {
    background-color: white;
    transform: scale(1.2);
  }
}

// 响应式调整
@media (max-width: 768px) {
  .loading-progress {
    .progress-bar {
      width: 150px;
    }

    .progress-text {
      font-size: 12px;
    }
  }

  .carousel-indicators {
    bottom: 15px;
    gap: 8px;
  }

  .indicator-dot {
    width: 6px;
    height: 6px;
  }
}

// 性能优化
@media (prefers-reduced-motion: reduce) {
  .carousel-slide {
    transition: opacity 0.3s ease;
  }
}
</style>
