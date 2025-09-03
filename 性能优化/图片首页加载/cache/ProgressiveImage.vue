<template>
  <div
    class="progressive-image"
    :class="{
      'is-loading': state.isLoading,
      'high-quality-loaded': state.isHighQualityLoaded
    }"
    :style="{ width, height }"
  >
    <!-- 低质量图片（模糊背景） -->
    <img
      v-if="lowQualityUrl && state.currentUrl === lowQualityUrl"
      :src="lowQualityUrl"
      :alt="alt"
      class="progressive-image__low-quality"
      :style="imageStyle"
      @load="onLowQualityLoad"
      @error="onImageError"
    />

    <!-- 高质量图片 -->
    <img
      v-if="state.currentUrl === highQualityUrl"
      :src="highQualityUrl"
      :alt="alt"
      class="progressive-image__high-quality"
      :class="{ 'fade-in': state.isHighQualityLoaded }"
      :style="imageStyle"
      @load="onHighQualityLoad"
      @error="onImageError"
    />

    <!-- 加载占位符 -->
    <div
      v-if="state.isLoading && !state.currentUrl"
      class="progressive-image__placeholder"
      :style="placeholderStyle"
    >
      <div class="placeholder-content">
        <slot name="placeholder">
          <div class="placeholder-shimmer"></div>
        </slot>
      </div>
    </div>

    <!-- 错误占位符 -->
    <div
      v-if="state.error && !state.currentUrl"
      class="progressive-image__error"
      :style="placeholderStyle"
    >
      <slot name="error">
        <div class="error-content">
          <svg class="error-icon" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,1H5C3.89,1 3,1.89 3,3V21A2,2 0 0,0 5,23H19A2,2 0 0,0 21,21V9M19,9H14V4H5V21H19V9Z" />
          </svg>
          <span class="error-text">图片加载失败</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProgressiveImage } from '@/utils/imageOptimization';

interface Props {
  /** 低质量图片URL（模糊图） */
  lowQualityUrl?: string;
  /** 高质量图片URL */
  highQualityUrl: string;
  /** 图片描述 */
  alt?: string;
  /** 容器宽度 */
  width?: string;
  /** 容器高度 */
  height?: string;
  /** 图片样式 */
  imageStyle?: Record<string, any>;
  /** 占位符样式 */
  placeholderStyle?: Record<string, any>;
  /** 加载优先级 */
  priority?: 'high' | 'medium' | 'low';
  /** 是否自动开始加载 */
  autoLoad?: boolean;
  /** 加载超时时间 */
  timeout?: number;
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: '100%',
  height: 'auto',
  imageStyle: () => ({}),
  placeholderStyle: () => ({}),
  priority: 'medium',
  autoLoad: true,
  timeout: 10000
});

const emit = defineEmits<{
  load: [url: string];
  error: [error: string];
  lowQualityLoad: [];
  highQualityLoad: [];
}>();

// 使用渐进式图片加载
const { state, loadImage } = useProgressiveImage({
  lowQualityUrl: props.lowQualityUrl,
  highQualityUrl: props.highQualityUrl,
  priority: props.priority,
  timeout: props.timeout
});

// 事件处理
const onLowQualityLoad = () => {
  emit('lowQualityLoad');
  emit('load', props.lowQualityUrl!);
};

const onHighQualityLoad = () => {
  emit('highQualityLoad');
  emit('load', props.highQualityUrl);
};

const onImageError = (event: Event) => {
  const error = `Failed to load image: ${(event.target as HTMLImageElement)?.src}`;
  emit('error', error);
};

// 手动开始加载
const startLoad = () => {
  loadImage();
};

// 暴露方法
defineExpose({
  startLoad,
  state
});

// 自动加载
onMounted(() => {
  if (props.autoLoad) {
    startLoad();
  }
});
</script>

<style lang="scss" scoped>
.progressive-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background-color: #f5f5f5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.progressive-image__low-quality {
  filter: blur(5px);
  transform: scale(1.1);
  transition: opacity 0.3s ease;
}

.progressive-image__high-quality {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.5s ease;

  &.fade-in {
    opacity: 1;
  }
}

.progressive-image__placeholder,
.progressive-image__error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.placeholder-content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.placeholder-shimmer {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #999;
  font-size: 14px;
}

.error-icon {
  width: 32px;
  height: 32px;
  opacity: 0.5;
}

.error-text {
  font-size: 12px;
}

// 响应式调整
@media (max-width: 768px) {
  .error-content {
    font-size: 12px;
  }

  .error-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
