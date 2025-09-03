<script setup lang="ts">
import { getFileByDir } from '@/utils';
import ProgressiveCarousel from '@/components/ProgressiveCarousel.vue';
import ProgressiveImage from '@/components/ProgressiveImage.vue';
import { globalImageLoader, DC_STATIC_IMAGES, LOGIN_PAGE_IMAGES } from '@/config/imageResources';
import { globalImagePreloader } from '@/utils/imageOptimization';

const router = useRouter();

// 获取图片资源
const images = getFileByDir('dc');

// 响应式数据
const isPageReady = ref(false);
const isPreloadingLogin = ref(false);
const backgroundImages = ref<Array<{ highQualityUrl: string; lowQualityUrl?: string }>>([]);
const uiImages = ref<Record<string, string>>({});
const preloadProgress = ref(0);

// 开发环境检测
const isDev = ref(import.meta.env.DEV);

// 检测设备类型
const isMobile = ref(false);

const checkDevice = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 初始化图片资源
const initializeImages = async () => {
  try {
    // 1. 首先加载关键UI图片（优先级最高）
    const criticalImages = await globalImageLoader.loadImages({
      title: DC_STATIC_IMAGES.critical.title.original,
      button1: DC_STATIC_IMAGES.critical.button1.original,
      button2: DC_STATIC_IMAGES.critical.button2.original,
      gov: () => import('@/assets/images/hexin/gov.png')
    });

    uiImages.value = criticalImages;

    // 2. 准备背景图片配置（包含低质量和高质量版本）
    const backgroundConfigs = [
      {
        highQualityUrl: (await import('@/assets/images/dc/static_bg_2.JPEG')).default,
        lowQualityUrl: undefined // 可以添加低质量版本
      },
      {
        highQualityUrl: (await import('@/assets/images/dc/static_bg.png')).default,
        lowQualityUrl: undefined // 可以添加低质量版本
      }
    ];

    backgroundImages.value = backgroundConfigs;

    // 3. 页面准备就绪
    isPageReady.value = true;

    // 4. 在后台预加载登录页图片队列
    setupLoginPreload();
  } catch (error) {
    console.error('Failed to initialize images:', error);
    // 即使失败也要显示页面，使用备用图片
    isPageReady.value = true;
  }
};

// 设置登录页预加载
const setupLoginPreload = () => {
  // 添加登录页图片到预加载队列
  const loginImageUrls: string[] = [];

  // 这里需要根据实际登录页需要的图片来配置
  // 示例：添加一些常用的登录页图片
  Promise.all([
    import('@/assets/images/hexin/background.jpg').catch(() => null),
    import('@/assets/images/hexin/background2.png').catch(() => null),
    import('@/assets/images/hexin/jinanniuLogo.png').catch(() => null)
  ]).then((modules) => {
    modules.forEach((module, index) => {
      if (module) {
        loginImageUrls.push(module.default);
      }
    });

    if (loginImageUrls.length > 0) {
      globalImagePreloader.addPreloadQueue('login', loginImageUrls);
    }
  });
};

// 开始预加载登录页图片
const startLoginPreload = async () => {
  if (isPreloadingLogin.value) return;

  isPreloadingLogin.value = true;
  try {
    await globalImagePreloader.startPreload('login', 'medium');
    console.log('Login page images preloaded successfully');
  } catch (error) {
    console.warn('Failed to preload login images:', error);
  } finally {
    isPreloadingLogin.value = false;
  }
};

// 按钮点击事件
const handleButton1Click = () => {
  window.location.href = 'https://teacher.dcjzjk.com/login';
};

const handleButton2Click = () => {
  console.log('按钮2被点击，但暂不可用');
};

// 鼠标悬停事件 - 预加载登录页图片
const handleButton1Hover = () => {
  startLoginPreload();
};

// 轮播图加载完成事件
const onCarouselReady = () => {
  console.log('Background carousel is ready');
};

const onCarouselError = (index: number, error: string) => {
  console.warn(`Carousel image ${index} failed to load:`, error);
};

onMounted(async () => {
  checkDevice();
  window.addEventListener('resize', checkDevice);

  // 开始初始化图片
  await initializeImages();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkDevice);
});
</script>

<template>
  <div class="static-page" :class="{ 'is-mobile': isMobile }">
    <!-- 渐进式轮播背景 -->
    <ProgressiveCarousel
      v-if="isPageReady && backgroundImages.length > 0"
      :images="backgroundImages"
      :interval="5000"
      :autoplay="true"
      :show-indicators="false"
      :show-progress="false"
      class="carousel-background"
      @all-images-loaded="onCarouselReady"
      @image-load-error="onCarouselError"
    />

    <!-- 备用背景（如果轮播组件未就绪） -->
    <div v-else class="fallback-background"></div>

    <!-- 内容容器 -->
    <div v-if="isPageReady" class="content-container">
      <!-- 标题区域 -->
      <div class="title-section" style="margin-top: auto">
        <ProgressiveImage
          v-if="uiImages.title"
          :high-quality-url="uiImages.title"
          alt="标题"
          class="title-image"
          :priority="'high'"
          :image-style="{ objectFit: 'contain' }"
        />

        <div class="subtitle-text">河南名师编写 更懂河南考情</div>

        <div class="button-section">
          <button
            class="action-btn btn-primary"
            @click="handleButton1Click"
            @mouseenter="handleButton1Hover"
            @focus="handleButton1Hover"
          >
            <ProgressiveImage
              v-if="uiImages.button1"
              :high-quality-url="uiImages.button1"
              alt="按钮1"
              class="btn-image"
              :priority="'high'"
              :image-style="{ objectFit: 'contain' }"
            />
          </button>

          <button class="action-btn btn-disabled" :disabled="true" @click="handleButton2Click">
            <ProgressiveImage
              v-if="uiImages.button2"
              :high-quality-url="uiImages.button2"
              alt="按钮2"
              class="btn-image"
              :priority="'medium'"
              :image-style="{ objectFit: 'contain', filter: 'grayscale(0.5)' }"
            />
          </button>
        </div>
      </div>

      <!-- 底部版权信息 -->
      <div style="margin-top: auto; color: white; margin-bottom: 20px">
        <span style="display: flex; align-items: center">
          ©{{ new Date().getFullYear() }}河南鼎成教育科技有限公司 &nbsp;&nbsp;&nbsp;&nbsp;
          <ProgressiveImage
            v-if="uiImages.gov"
            :high-quality-url="uiImages.gov"
            alt="政府备案"
            :priority="'low'"
            :image-style="{ width: '0.8vw', height: '0.8vw', objectFit: 'contain' }"
          />
          &nbsp;
          <a
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=豫公网安备41019702003679号"
            target="_blank"
          >
            豫公网安备41019702003679号
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a href="https://beian.miit.gov.cn/" target="_blank">豫ICP备2024064528号</a>
        </span>
      </div>
    </div>

    <!-- 全局加载状态 -->
    <div v-else class="page-loading">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载页面...</div>
      </div>
    </div>

    <!-- 预加载提示（开发环境可见） -->
    <div v-if="isPreloadingLogin && isDev" class="preload-indicator">
      <span>正在预加载登录页资源...</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$bg-color: #d70c18;

.static-page {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.carousel-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.fallback-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1;
}

.page-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto 20px;
}

.loading-text {
  font-size: 16px;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.content-container {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
}

.title-section {
  text-align: center;

  .title-image {
    max-width: 90%;
    height: auto;
    margin-bottom: 1.5rem;
    width: auto;
    max-height: 200px;
  }

  .subtitle-text {
    font-size: 2vw;
    color: white;
    font-weight: 400;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    margin-bottom: 1.5rem;
  }
}

.button-section {
  display: flex;
  width: 100%;
  gap: 2rem;
  justify-content: center;
  align-items: center;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  position: relative;

  .btn-image {
    width: 100%;
    height: 100%;
    display: block;
    transition:
      transform 0.3s ease,
      filter 0.3s ease;
  }

  &.btn-primary {
    &:hover .btn-image {
      transform: scale(1.05);
      filter: brightness(1.1);
    }

    &:focus {
      outline: 2px solid rgba(255, 255, 255, 0.5);
      outline-offset: 4px;
    }
  }

  &.btn-disabled {
    cursor: not-allowed;
    opacity: 0.6;

    .btn-image {
      filter: grayscale(0.8);
    }
  }
}

.preload-indicator {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
  animation: fadeInOut 2s infinite;
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

// PC端样式调整
@media (min-width: 769px) {
  .title-section {
    max-width: 800px;

    .title-image {
      max-width: 800px;
      max-height: 250px;
    }

    .subtitle-text {
      font-size: 2.5vw;
    }
  }
}

// 平板端样式调整
@media (max-width: 768px) {
  .title-section {
    .title-image {
      max-width: 70%;
      max-height: 150px;
    }

    .subtitle-text {
      font-size: 1.1rem;
    }
  }

  .button-section {
    flex-direction: row;
    gap: 1.5rem;

    .action-btn {
      display: flex;
      justify-content: center;
      max-width: 180px;

      .btn-image {
        width: 180px;
        height: 50px;
        object-fit: contain;
      }
    }
  }

  .preload-indicator {
    top: 10px;
    right: 10px;
    font-size: 10px;
    padding: 6px 12px;
  }
}

// 性能优化：减少动画效果（如果用户偏好）
@media (prefers-reduced-motion: reduce) {
  .action-btn .btn-image {
    transition: none;
  }

  .loading-spinner {
    animation: none;
  }

  .preload-indicator {
    animation: none;
    opacity: 0.8;
  }
}
</style>
