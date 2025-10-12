// 防抖
const debounce = (func, wait) => {
  let timeout
  return function (...args) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

// 节流
const throttle = (func, wait) => {
  let lastTime = 0
  return function (...args) {
    const context = this
    const now = Date.now()
    if (now - lastTime >= wait) {
      lastTime = now
      func.apply(context, args)
    }
  }
}

// 重试
const retry = (func, retries) => {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      func()
        .then(resolve)
        .catch(err => {
          if (retries === 0) {
            reject(err)
          } else {
            retries--
            attempt()
          }
        })
    }
    attempt()
  })
}

// 图片懒加载
const lazyLoadImage = (imgSelector, options = {}) => {
  const {
    threshold = 0, // 触发加载的阈值
    rootMargin = '0px', // 根容器的边距
  } = options

  const images = document.querySelectorAll(imgSelector)

  const observer = new IntersectionObserver(
    // 当观察的元素进入/离开视口时执行
    (entries, observer) => {
      entries.forEach(entry => {
        // 元素是否与视口相交
        if (entry.isIntersecting) {
          const img = entry.target
          const src = img.dataset.src

          if (src) {
            // 创建新的图片对象来预加载
            const imageLoader = new Image()

            // 图片已经下载完成并缓存在浏览器中
            imageLoader.onload = () => {
              // 更新页面上的图片
              img.src = src
            }

            imageLoader.onerror = () => {
              console.error(`图片加载失败: ${src}`)
            }
            // 后台预先下载图片数据
            imageLoader.src = src
          }

          observer.unobserve(img)
        }
      })
    },
    {
      threshold,
      rootMargin,
    },
  )

  images.forEach(img => {
    // 监听每个图片元素是否进入视口
    observer.observe(img)
  })

  // 返回 observer 实例，方便外部控制
  return observer
}
