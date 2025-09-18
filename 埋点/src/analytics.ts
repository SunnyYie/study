import { SDKConfig, PageViewData, UserVisitData, ReportData } from './types'
import { StorageManager } from './storage'
import { NetworkManager } from './network'

/**
 * 前端埋点SDK
 * 用于收集和上报页面访问（PV）和用户访问（UV）数据
 */
export class AnalyticsSDK {
  private config!: SDKConfig
  private storage: StorageManager
  private network: NetworkManager
  private reportTimer: number | null = null
  private retryTimer: number | null = null // 失败数据重试定时器
  private isInitialized = false

  constructor() {
    this.storage = new StorageManager()
    this.network = new NetworkManager()
  }

  /**
   * 初始化SDK
   */
  init(config: SDKConfig): void {
    this.config = {
      reportUrl: '/api/analytics',
      reportInterval: 5000,
      debug: false,
      ...config,
    }

    this.network = new NetworkManager(this.config.reportUrl!, this.config.debug)

    // 设置当前用户，这会自动处理用户切换的情况
    this.storage.setCurrentUser(this.config.userId)

    this.isInitialized = true

    if (this.config.debug) {
      console.log('Analytics SDK initialized with config:', this.config)
    }

    // 恢复失败的数据
    this.recoverFailedData()

    // 设置网络状态监听
    this.setupNetworkListener()

    // 记录用户访问（UV）
    this.trackUserVisit()

    // 记录页面访问（PV）
    this.trackPageView()

    // 监听页面变化（SPA路由变化）
    this.setupPageChangeListener()

    // 设置定时上报
    this.startReporting()

    // 设置失败数据重试
    this.startRetryFailedData()

    // 监听页面卸载事件，确保数据上报
    this.setupUnloadListener()
  }

  /**
   * 手动记录页面访问
   */
  trackPageView(url?: string, title?: string): void {
    if (!this.isInitialized) {
      console.warn('Analytics SDK not initialized. Call init() first.')
      return
    }

    const pageView: PageViewData = {
      appId: this.config.appId,
      userId: this.config.userId,
      url: url || window.location.href,
      title: title || document.title,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    }

    this.storage.savePageView(pageView)
  }

  /**
   * 记录用户访问（UV）
   */
  private trackUserVisit(): void {
    // 检查今天是否已记录UV
    if (this.storage.isTodayUVRecorded(this.config.userId)) {
      return
    }

    const userVisit: UserVisitData = {
      appId: this.config.appId,
      userId: this.config.userId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      sessionId: this.storage.getSessionId(),
    }

    this.storage.saveUserVisit(userVisit)
    this.storage.markTodayUVRecorded(this.config.userId)
  }

  /**
   * 设置页面变化监听器（支持SPA）
   */
  private setupPageChangeListener(): void {
    // 监听 history.pushState 和 history.replaceState
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = (...args) => {
      originalPushState.apply(history, args)
      setTimeout(() => this.trackPageView(), 0)
    }

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args)
      setTimeout(() => this.trackPageView(), 0)
    }

    // 监听 popstate 事件（浏览器前进后退）
    window.addEventListener('popstate', () => {
      setTimeout(() => this.trackPageView(), 0)
    })

    // 监听 hashchange 事件（hash路由）
    window.addEventListener('hashchange', () => {
      this.trackPageView()
    })
  }

  /**
   * 开始定时上报
   */
  private startReporting(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer)
    }

    this.reportTimer = window.setInterval(() => {
      this.reportStoredData()
    }, this.config.reportInterval!)
  }

  /**
   * 上报存储的数据
   */
  private async reportStoredData(): Promise<void> {
    const pageViews = this.storage.getPageViews()
    const userVisits = this.storage.getUserVisits()

    if (pageViews.length === 0 && userVisits.length === 0) {
      return
    }

    const reportData: ReportData = {
      pageViews,
      userVisits,
    }

    const result = await this.network.reportDataWithRetry(reportData, 3, this.storage)

    if (result.success) {
      // 上报成功后清空本地数据
      this.storage.clearPageViews()
      this.storage.clearUserVisits()
    }
  }

  /**
   * 恢复失败的数据
   */
  private async recoverFailedData(): Promise<void> {
    try {
      if (this.config.debug) {
        console.log('Analytics SDK: Recovering failed data...')
      }

      // 延迟一段时间后开始恢复，确保网络已稳定
      setTimeout(async () => {
        await this.network.retryFailedData(this.storage)
      }, 5000)
    } catch (error) {
      console.error('Analytics SDK: Error recovering failed data:', error)
    }
  }

  /**
   * 设置网络状态监听
   */
  private setupNetworkListener(): void {
    // 监听网络状态变化
    window.addEventListener('online', () => {
      if (this.config.debug) {
        console.log('Analytics SDK: Network is back online, retrying failed data')
      }

      // 网络恢复时立即尝试重试失败数据
      setTimeout(async () => {
        await this.network.retryFailedData(this.storage)
      }, 1000)
    })

    window.addEventListener('offline', () => {
      if (this.config.debug) {
        console.log('Analytics SDK: Network is offline')
      }
    })
  }

  /**
   * 开始失败数据重试定时器
   */
  private startRetryFailedData(): void {
    if (this.retryTimer) {
      clearInterval(this.retryTimer)
    }

    // 每10分钟尝试重试一次失败数据
    this.retryTimer = window.setInterval(async () => {
      try {
        await this.network.retryFailedData(this.storage)
      } catch (error) {
        if (this.config.debug) {
          console.warn('Analytics SDK: Error in retry timer:', error)
        }
      }
    }, 10 * 60 * 1000) // 10分钟
  }

  /**
   * 设置页面卸载监听器
   */
  private setupUnloadListener(): void {
    // 使用 beforeunload 事件确保数据上报
    window.addEventListener('beforeunload', () => {
      this.flushData()
    })

    // 使用 visibilitychange 事件处理页面隐藏
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushData()
      }
    })

    // 使用 pagehide 事件（更可靠）
    window.addEventListener('pagehide', () => {
      this.flushData()
    })
  }

  /**
   * 立即上报数据（同步方式）
   * 在页面卸载等紧急情况下使用
   */
  private flushData(): void {
    const pageViews = this.storage.getPageViews()
    const userVisits = this.storage.getUserVisits()

    if (pageViews.length === 0 && userVisits.length === 0) {
      return
    }

    const reportData: ReportData = {
      pageViews,
      userVisits,
    }

    // 使用同步方式上报（sendBeacon + 图片方式）
    const success = this.network.reportDataSync(reportData)

    if (success) {
      // 清空本地数据
      this.storage.clearPageViews()
      this.storage.clearUserVisits()
    }

    if (this.config.debug) {
      console.log('Analytics SDK: Flush data completed, success:', success)
    }
  }

  /**
   * 手动上报数据
   */
  async report(): Promise<boolean> {
    if (!this.isInitialized) {
      console.warn('Analytics SDK not initialized. Call init() first.')
      return false
    }

    await this.reportStoredData()
    return true
  }

  /**
   * 销毁SDK实例
   */
  destroy(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer)
      this.reportTimer = null
    }

    if (this.retryTimer) {
      clearInterval(this.retryTimer)
      this.retryTimer = null
    }

    // 最后一次数据上报
    this.flushData()

    this.isInitialized = false

    if (this.config?.debug) {
      console.log('Analytics SDK destroyed')
    }
  }

  /**
   * 获取当前配置
   */
  getConfig(): SDKConfig | null {
    return this.isInitialized ? { ...this.config } : null
  }
}
