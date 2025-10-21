import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent } from './components/ui/card'
import { Button } from './components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Carousel = ({ images = [], showNavigation = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [isTransitioning, setIsTransitioning] = useState(false)
  const debounceTimerRef = useRef(null)

  // 图片预加载函数
  const preloadImage = useCallback(
    src => {
      return new Promise((resolve, reject) => {
        if (loadedImages.has(src)) {
          resolve(src)
          return
        }

        const img = new Image()
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, src]))
          resolve(src)
        }
        img.onerror = reject
        img.src = typeof src === 'string' ? src : src.src
      })
    },
    [loadedImages],
  )

  // 预加载相邻图片
  const preloadAdjacentImages = useCallback(
    index => {
      if (images.length <= 1) return

      const imagesToLoad = []

      // 当前图片
      const currentSrc = typeof images[index] === 'string' ? images[index] : images[index].src
      imagesToLoad.push(currentSrc)

      // 上一张
      const prevIndex = index === 0 ? images.length - 1 : index - 1
      const prevSrc = typeof images[prevIndex] === 'string' ? images[prevIndex] : images[prevIndex].src
      imagesToLoad.push(prevSrc)

      // 下一张
      const nextIndex = index === images.length - 1 ? 0 : index + 1
      const nextSrc = typeof images[nextIndex] === 'string' ? images[nextIndex] : images[nextIndex].src
      imagesToLoad.push(nextSrc)
      console.log(imagesToLoad, 'imagesToLoad')

      // 批量预加载
      imagesToLoad.forEach(src => {
        if (!loadedImages.has(src)) {
          preloadImage(src).catch(console.error)
        }
      })
    },
    [images, loadedImages, preloadImage],
  )

  // 初始化预加载
  useEffect(() => {
    if (images.length > 0) {
      preloadAdjacentImages(currentIndex)
    }
  }, [images, currentIndex, preloadAdjacentImages])

  // 防抖处理函数
  const debounceNavigation = useCallback(
    (callback, delay = 200) => {
      if (isTransitioning) return

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      setIsTransitioning(true)
      callback()

      debounceTimerRef.current = setTimeout(() => {
        setIsTransitioning(false)
      }, delay)
    },
    [isTransitioning],
  )

  // 上一张
  const goToPrevious = useCallback(() => {
    debounceNavigation(() => {
      const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
      setCurrentIndex(newIndex)

      // 预加载上上张图片
      setTimeout(() => {
        const prevPrevIndex = newIndex === 0 ? images.length - 1 : newIndex - 1
        const prevPrevSrc =
          typeof images[prevPrevIndex] === 'string' ? images[prevPrevIndex] : images[prevPrevIndex].src
        preloadImage(prevPrevSrc).catch(console.error)
      }, 100)
    })
  }, [currentIndex, images.length, debounceNavigation, preloadImage])

  // 下一张
  const goToNext = useCallback(() => {
    debounceNavigation(() => {
      const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
      setCurrentIndex(newIndex)

      // 预加载下下张图片
      setTimeout(() => {
        const nextNextIndex = newIndex === images.length - 1 ? 0 : newIndex + 1
        const nextNextSrc =
          typeof images[nextNextIndex] === 'string' ? images[nextNextIndex] : images[nextNextIndex].src
        preloadImage(nextNextSrc).catch(console.error)
      }, 100)
    })
  }, [currentIndex, images.length, debounceNavigation, preloadImage])

  // 鼠标悬停预加载
  const handleMouseEnterPrev = useCallback(() => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    const prevSrc = typeof images[prevIndex] === 'string' ? images[prevIndex] : images[prevIndex].src
    preloadImage(prevSrc).catch(console.error)
  }, [currentIndex, images, preloadImage])

  const handleMouseEnterNext = useCallback(() => {
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    const nextSrc = typeof images[nextIndex] === 'string' ? images[nextIndex] : images[nextIndex].src
    preloadImage(nextSrc).catch(console.error)
  }, [currentIndex, images, preloadImage])

  if (!images.length) {
    return (
      <Card className="w-full h-64 flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">暂无图片</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative w-full max-w-4xl mx-auto overflow-hidden">
      <CardContent className="p-0">
        {/* 图片容器 */}
        <div className="relative h-64 md:h-96">
          {images.map((image, index) => {
            const imageSrc = typeof image === 'string' ? image : image.src
            const imageAlt = typeof image === 'string' ? `轮播图 ${index + 1}` : image.alt
            const isLoaded = loadedImages.has(imageSrc)

            // 只渲染当前图片、已预加载的图片，或相邻的图片
            const shouldRender =
              index === currentIndex ||
              isLoaded ||
              Math.abs(index - currentIndex) <= 1 ||
              (currentIndex === 0 && index === images.length - 1) ||
              (currentIndex === images.length - 1 && index === 0)

            if (!shouldRender) {
              return <div key={index} className="absolute inset-0 opacity-0" />
            }

            return (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {isLoaded ? (
                  <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <img
                      src={imageSrc}
                      alt={imageAlt}
                      className="w-full h-full object-cover opacity-50"
                      onLoad={() => {
                        setLoadedImages(prev => new Set([...prev, imageSrc]))
                      }}
                      onError={() => {
                        console.error(`Failed to load image: ${imageSrc}`)
                      }}
                    />
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="text-gray-400 text-sm">加载中...</div>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* 导航按钮 */}
        {showNavigation && images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white transition-all duration-200 ${
                isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={goToPrevious}
              onMouseEnter={handleMouseEnterPrev}
              disabled={isTransitioning}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white transition-all duration-200 ${
                isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={goToNext}
              onMouseEnter={handleMouseEnterNext}
              disabled={isTransitioning}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// 使用示例
const CarouselDemo = () => {
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      alt: '山景',
    },
    {
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
      alt: '自然风光',
    },
    {
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
      alt: '森林小径',
    },
    {
      src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=400&fit=crop',
      alt: '夜空星辰',
    },
    {
      src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop',
      alt: '雾中山峰',
    },
    {
      src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=400&fit=crop',
      alt: '湖光山色',
    },
    {
      src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=400&fit=crop',
      alt: '草原风光',
    },
    {
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
      alt: '重复的自然风光',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <Carousel images={images} showIndicators={true} showNavigation={true} />
    </div>
  )
}

export default CarouselDemo
