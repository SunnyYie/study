import { useState, useEffect, useCallback, useRef } from 'react'

function useThrottle(func, delay) {
  const timeoutRef = useRef(null)
  const lastExecutedRef = useRef(0)

  const throttledFunc = useCallback(
    (...args) => {
      const now = Date.now()
      const elapsedTime = now - lastExecutedRef.current

      if (elapsedTime >= delay) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }

        func(...args)
        lastExecutedRef.current = now 
      } else if (!timeoutRef.current) {
        // 如果不足 delay 且没有待执行的定时器，则设置一个定时器
        // 确保在剩余时间结束后执行最后一次调用
        const remainingTime = delay - elapsedTime

        timeoutRef.current = setTimeout(() => {
          func(...args)
          lastExecutedRef.current = Date.now() // 更新上次执行时间
          timeoutRef.current = null // 清空定时器 ID
        }, remainingTime)
      }
    },
    [func, delay],
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [delay])

  return throttledFunc
}

export default useThrottle
