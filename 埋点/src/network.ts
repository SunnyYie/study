import { ReportData } from './types'

/**
 * 网络请求管理器
 * 负责将埋点数据上报到服务端
 * 优先使用 navigator.sendBeacon，失败时降级到 fetch 和图片方式
 * 支持接口健康检查、智能重试和失败数据缓存
 */
export class NetworkManager {
  private reportUrl: string
  private debug: boolean
  private healthCheckUrl: string
  private lastHealthCheckTime: number = 0
  private healthCheckInterval: number = 30000 // 30秒检查一次
  private apiHealthy: boolean = true
  private consecutiveFailures: number = 0

  constructor(reportUrl: string = '/api/analytics', debug: boolean = false) {
    this.reportUrl = reportUrl
    this.debug = debug
    this.healthCheckUrl = reportUrl.replace('/analytics', '/health') // 健康检查接口
  }

  /**
   * 检查接口健康状态
   */
  async checkApiHealth(): Promise<boolean> {
    try {
      const now = Date.now()

      // 避免频繁检查
      if (now - this.lastHealthCheckTime < this.healthCheckInterval) {
        return this.apiHealthy
      }

      this.lastHealthCheckTime = now

      if (this.debug) {
        console.log('Analytics SDK: Checking API health...')
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时

      const response = await fetch(this.healthCheckUrl, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-cache',
      })

      clearTimeout(timeoutId)

      this.apiHealthy = response.ok

      if (this.apiHealthy) {
        this.consecutiveFailures = 0
        if (this.debug) {
          console.log('Analytics SDK: API is healthy')
        }
      } else {
        this.consecutiveFailures++
        if (this.debug) {
          console.warn(`Analytics SDK: API health check failed, status: ${response.status}`)
        }
      }

      return this.apiHealthy
    } catch (error) {
      this.apiHealthy = false
      this.consecutiveFailures++

      if (this.debug) {
        console.warn('Analytics SDK: API health check error:', error)
      }

      return false
    }
  }

  /**
   * 获取智能重试延迟时间
   */
  private getRetryDelay(retryCount: number): number {
    // 基于连续失败次数调整延迟
    const baseDelay = Math.pow(2, retryCount) * 1000 // 指数退避
    const jitter = Math.random() * 1000 // 添加随机抖动
    const failureMultiplier = Math.min(this.consecutiveFailures / 5, 3) // 连续失败越多，延迟越长

    return Math.min(baseDelay * (1 + failureMultiplier) + jitter, 60000) // 最大60秒
  }

  /**
   * 判断错误是否为暂时性错误（可重试）
   */
  private isRetriableError(error: any): boolean {
    if (!error) return false

    // 网络错误
    if (error.name === 'NetworkError' || error.name === 'TypeError') return true

    // HTTP状态码错误
    if (error.status) {
      // 5xx服务器错误和部分4xx错误可重试
      return (
        error.status >= 500 ||
        error.status === 408 || // Request Timeout
        error.status === 429 || // Too Many Requests
        error.status === 502 || // Bad Gateway
        error.status === 503 || // Service Unavailable
        error.status === 504
      ) // Gateway Timeout
    }

    return true // 默认可重试
  }

  /**
   * 检查是否支持 sendBeacon
   */
  private isSendBeaconSupported(): boolean {
    return typeof navigator !== 'undefined' && 'sendBeacon' in navigator
  }

  /**
   * 使用 sendBeacon 上报数据
   */
  private reportDataByBeacon(data: ReportData): boolean {
    try {
      if (!this.isSendBeaconSupported()) {
        if (this.debug) {
          console.log('Analytics SDK: sendBeacon not supported')
        }
        return false
      }

      if (this.debug) {
        console.log('Analytics SDK: Reporting data by sendBeacon:', data)
      }

      const blob = new Blob([JSON.stringify(data)], {
        type: 'application/json',
      })

      const success = navigator.sendBeacon(this.reportUrl, blob)

      if (this.debug) {
        console.log('Analytics SDK: sendBeacon result:', success)
      }

      return success
    } catch (error) {
      console.error('Analytics SDK: Failed to report data by sendBeacon:', error)
      return false
    }
  }

  /**
   * 使用 fetch 上报数据（备用方案）
   */
  private async reportDataByFetch(data: ReportData): Promise<boolean> {
    try {
      if (this.debug) {
        console.log('Analytics SDK: Reporting data by fetch:', data)
      }

      const response = await fetch(this.reportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        keepalive: true, // 重要：确保在页面卸载时也能发送
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (this.debug) {
        console.log('Analytics SDK: Data reported successfully by fetch')
      }

      return true
    } catch (error) {
      console.error('Analytics SDK: Failed to report data by fetch:', error)
      if (this.debug) {
        console.error('Analytics SDK: Fetch error details:', data)
      }
      return false
    }
  }

  /**
   * 主要上报方法：优先使用 sendBeacon，失败时降级到 fetch
   */
  async reportData(data: ReportData): Promise<boolean> {
    try {
      // 检查是否有数据需要上报
      if (data.pageViews.length === 0 && data.userVisits.length === 0) {
        if (this.debug) {
          console.log('Analytics SDK: No data to report')
        }
        return true
      }

      // 优先尝试 sendBeacon
      if (this.isSendBeaconSupported()) {
        const beaconSuccess = this.reportDataByBeacon(data)
        if (beaconSuccess) {
          if (this.debug) {
            console.log('Analytics SDK: Data reported successfully by sendBeacon')
          }
          return true
        }

        if (this.debug) {
          console.log('Analytics SDK: sendBeacon failed, falling back to fetch')
        }
      }

      // sendBeacon 失败或不支持时，使用 fetch
      const fetchSuccess = await this.reportDataByFetch(data)
      if (fetchSuccess) {
        return true
      }

      // 两种方法都失败时返回 false
      if (this.debug) {
        console.log('Analytics SDK: Both sendBeacon and fetch failed')
      }
      return false
    } catch (error) {
      console.error('Analytics SDK: Failed to report data:', error)
      if (this.debug) {
        console.error('Analytics SDK: Report data details:', data)
      }
      return false
    }
  }

  /**
   * 增强的重试上报机制
   * 支持多种上报方式的降级策略和失败数据缓存
   */
  async reportDataWithRetry(
    data: ReportData,
    maxRetries: number = 3,
    storageManager?: any,
  ): Promise<{ success: boolean; reason?: string }> {
    let retries = 0
    let lastError: any = null

    // 数据完整性检查
    if (storageManager && !storageManager.validateDataIntegrity(data)) {
      const reason = 'Data integrity validation failed'
      if (this.debug) {
        console.error('Analytics SDK:', reason)
      }
      return { success: false, reason }
    }

    // 检查接口健康状态
    const isHealthy = await this.checkApiHealth()
    if (!isHealthy && this.consecutiveFailures > 5) {
      // 接口连续失败多次，直接缓存数据
      const reason = `API unhealthy, consecutive failures: ${this.consecutiveFailures}`
      if (storageManager) {
        storageManager.saveFailedData(data, reason)
      }
      return { success: false, reason }
    }

    while (retries < maxRetries) {
      try {
        const success = await this.reportData(data)
        if (success) {
          this.consecutiveFailures = 0 // 重置失败计数
          return { success: true }
        }
      } catch (error) {
        lastError = error
        if (this.debug) {
          console.warn(`Analytics SDK: Report attempt ${retries + 1} failed:`, error)
        }
      }

      retries++

      // 判断是否应该继续重试
      if (retries < maxRetries && this.isRetriableError(lastError)) {
        const delay = this.getRetryDelay(retries)
        await new Promise(resolve => setTimeout(resolve, delay))

        if (this.debug) {
          console.log(`Analytics SDK: Retrying report (${retries}/${maxRetries}) after ${delay}ms`)
        }
      } else {
        break // 不可重试的错误或达到最大重试次数
      }
    }

    // 所有重试都失败后，尝试图片方式上报
    try {
      if (this.debug) {
        console.log('Analytics SDK: All retries failed, trying final image method')
      }
      this.reportDataByImage(data)
    } catch (imageError) {
      if (this.debug) {
        console.warn('Analytics SDK: Image method also failed:', imageError)
      }
    }

    // 保存失败数据到缓存
    const reason = lastError ? lastError.message || 'Unknown error' : 'All retry attempts failed'
    if (storageManager) {
      storageManager.saveFailedData(data, reason)
    }

    return { success: false, reason }
  }

  /**
   * 重试失败的缓存数据
   */
  async retryFailedData(storageManager: any): Promise<void> {
    try {
      const failedDataList = storageManager.getFailedData()

      if (failedDataList.length === 0) {
        return
      }

      if (this.debug) {
        console.log(`Analytics SDK: Retrying ${failedDataList.length} failed data items`)
      }

      // 检查接口健康状态
      const isHealthy = await this.checkApiHealth()
      if (!isHealthy) {
        if (this.debug) {
          console.log('Analytics SDK: API still unhealthy, skipping retry')
        }
        return
      }

      for (const failedItem of failedDataList) {
        try {
          // 检查重试次数限制
          if ((failedItem.retryCount || 0) >= 5) {
            if (this.debug) {
              console.log(`Analytics SDK: Skipping data ${failedItem.id}, max retries reached`)
            }
            continue
          }

          // 更新重试次数
          storageManager.updateFailedDataRetryCount(failedItem.id)

          // 尝试上报
          const result = await this.reportDataWithRetry(failedItem.data, 2, storageManager)

          if (result.success) {
            // 上报成功，从缓存中删除
            storageManager.removeFailedData(failedItem.id)

            if (this.debug) {
              console.log(`Analytics SDK: Successfully retried failed data ${failedItem.id}`)
            }
          }

          // 添加延迟，避免过于频繁的请求
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error) {
          if (this.debug) {
            console.warn(`Analytics SDK: Failed to retry data ${failedItem.id}:`, error)
          }
        }
      }

      // 清理过期数据
      storageManager.cleanupExpiredFailedData()
    } catch (error) {
      console.error('Analytics SDK: Error in retryFailedData:', error)
    }
  }

  /**
   * 即时上报（用于页面卸载等紧急情况）
   * 只使用 sendBeacon 和图片方式，不使用异步的 fetch
   */
  reportDataSync(data: ReportData): boolean {
    try {
      // 检查是否有数据需要上报
      if (data.pageViews.length === 0 && data.userVisits.length === 0) {
        if (this.debug) {
          console.log('Analytics SDK: No data to report sync')
        }
        return true
      }

      if (this.debug) {
        console.log('Analytics SDK: Sync reporting data:', data)
      }

      // 优先尝试 sendBeacon（同步且可靠）
      if (this.isSendBeaconSupported()) {
        const beaconSuccess = this.reportDataByBeacon(data)
        if (beaconSuccess) {
          if (this.debug) {
            console.log('Analytics SDK: Data reported successfully by sendBeacon (sync)')
          }
          return true
        }
      }

      // sendBeacon 失败时，使用图片方式（同步）
      if (this.debug) {
        console.log('Analytics SDK: sendBeacon failed, using image method (sync)')
      }
      this.reportDataByImage(data)
      return true // 图片方式无法确认是否成功，但已尽力
    } catch (error) {
      console.error('Analytics SDK: Failed to report data sync:', error)
      return false
    }
  }

  /**
   * 使用图片请求方式上报数据（最后的备用方案）
   * 这种方式最可靠，不会被页面跳转中断，但无法确认是否成功
   */
  reportDataByImage(data: ReportData): void {
    try {
      if (this.debug) {
        console.log('Analytics SDK: Reporting data by image:', data)
      }

      // 检查是否有数据需要上报
      if (data.pageViews.length === 0 && data.userVisits.length === 0) {
        if (this.debug) {
          console.log('Analytics SDK: No data to report by image')
        }
        return
      }

      const img = new Image()

      // 使用 GET 请求，将数据编码到 URL 中
      const params = new URLSearchParams({
        data: JSON.stringify(data),
        t: Date.now().toString(), // 防止缓存
        method: 'image', // 标识这是图片方式上报
      })

      img.src = `${this.reportUrl}?${params.toString()}`

      // 监听事件（可选，用于调试）
      img.onload = () => {
        if (this.debug) {
          console.log('Analytics SDK: Data reported successfully by image')
        }
      }

      img.onerror = () => {
        console.error('Analytics SDK: Failed to report data by image')
        if (this.debug) {
          console.error('Analytics SDK: Image method failed for data:', data)
        }
      }

      // 设置超时清理
      setTimeout(() => {
        img.onload = null
        img.onerror = null
      }, 5000)
    } catch (error) {
      console.error('Analytics SDK: Failed to report data by image:', error)
    }
  }

  /**
   * 获取网络状态信息（用于调试和错误分析）
   */
  getNetworkInfo(): { online: boolean; effectiveType?: string } {
    const info: { online: boolean; effectiveType?: string } = {
      online: navigator.onLine,
    }

    // 检查网络连接类型（如果支持）
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection && connection.effectiveType) {
        info.effectiveType = connection.effectiveType
      }
    }

    return info
  }
}
