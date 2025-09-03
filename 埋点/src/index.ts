import Tracker from './core/tracker'
import Storage from './core/storage'
import { trackPV } from './metrics/pv'
import { UVTracker } from './metrics/uv'
import { DurationTracker } from './metrics/duration'
import { BounceTracker, trackBounce } from './metrics/bounce'
import { PageVisit, trackPageVisit } from './metrics/pageVisit'
import { trackSource } from './metrics/source'
import UserTracker from './metrics/user'
import { generateUUID } from './utils/uuid'
import { getCurrentTimestamp } from './utils/time'
import { config } from './config'
import { Metrics } from './types/index'

class AnalyticsSDK {
  private tracker: Tracker
  private storage: Storage
  private durationTracker: DurationTracker
  private pageVisitTracker: PageVisit
  private bounceTracker: BounceTracker
  private userTracker: UserTracker
  private uvTracker: UVTracker
  private pageSpecificMetrics: Map<string, any>
  private firstVisitTime: number
  private visitCount: number

  constructor() {
    this.storage = new Storage()
    this.tracker = new Tracker()
    this.durationTracker = DurationTracker.getInstance()
    this.pageVisitTracker = new PageVisit()
    this.bounceTracker = new BounceTracker()
    this.userTracker = new UserTracker()
    this.uvTracker = UVTracker.getInstance()
    this.pageSpecificMetrics = new Map()
    this.visitCount = this.getVisitCount()
    this.firstVisitTime = this.getFirstVisitTime()

    // 自动初始化
    if (typeof window !== 'undefined') {
      this.init()
    }
  }

  init(options = {}) {
    const page = window.location.pathname
    const source = document.referrer || 'direct'
    const userId = this.storage.getItem('userId') || generateUUID()

    // 存储用户ID
    this.storage.setItem('userId', userId)

    // 记录访问频次
    this.incrementVisitCount()

    // 记录首次访问时间（如果不存在）
    this.recordFirstVisitIfNeeded()

    // 开始追踪
    this.tracker.trackPageView(page, source, userId)
    this.durationTracker.startTracking()
    this.pageVisitTracker.trackPageVisit(page)
    this.trackSource(source)

    // 追踪特定页面的指标
    this.initPageSpecificMetrics(page)

    // 添加页面卸载时的事件
    window.addEventListener('beforeunload', () => {
      this.durationTracker.stopTracking()
      if (this.isQuickBounce()) {
        this.trackBounce()
      }
    })

    return this
  }

  trackPV(page = window.location.pathname) {
    trackPV(page)
    this.incrementPageSpecificMetric(page, 'pv')
    return this
  }

  trackUV() {
    const userId = this.storage.getItem('userId')
    if (userId) {
      this.uvTracker.trackUV(userId)
      this.incrementPageSpecificMetric(window.location.pathname, 'uv', userId)
    }
    return this
  }

  trackDuration() {
    const duration = this.durationTracker.getAverageDuration()
    this.updatePageSpecificMetric(window.location.pathname, 'duration', duration)
    return duration
  }

  trackBounce() {
    trackBounce()
    return this
  }

  trackPageVisit(page = window.location.pathname) {
    trackPageVisit(page)
    return this
  }

  trackSource(source = document.referrer || 'direct') {
    trackSource(source)
    return this
  }

  trackUser() {
    return this.userTracker.trackUser()
  }

  getVisitFrequency() {
    return this.visitCount
  }

  private getVisitCount(): number {
    return this.storage.getItem('visitCount') || 0
  }

  private incrementVisitCount() {
    const currentCount = this.getVisitCount()
    this.visitCount = currentCount + 1
    this.storage.setItem('visitCount', this.visitCount)
    return this.visitCount
  }

  private getFirstVisitTime(): number {
    return this.storage.getItem('firstVisitTime') || 0
  }

  private recordFirstVisitIfNeeded() {
    if (!this.firstVisitTime) {
      this.firstVisitTime = getCurrentTimestamp()
      this.storage.setItem('firstVisitTime', this.firstVisitTime)
    }
  }

  private isQuickBounce(): boolean {
    // 用户停留时间少于15秒视为跳出
    const visitDuration = this.durationTracker.getCurrentSessionDuration()
    return visitDuration < 15000 // 15秒
  }

  private initPageSpecificMetrics(page: string) {
    // 确保每个页面都有自己的指标存储
    if (!this.pageSpecificMetrics.has(page)) {
      const storedMetrics = this.storage.getItem(`page_metrics_${page}`) || {
        pv: 0,
        uv: new Set(),
        duration: 0,
        visits: 0,
      }

      // 将存储的UV集合字符串转回Set对象
      if (storedMetrics.uv && Array.isArray(storedMetrics.uv)) {
        storedMetrics.uv = new Set(storedMetrics.uv)
      } else {
        storedMetrics.uv = new Set()
      }

      this.pageSpecificMetrics.set(page, storedMetrics)
    }

    // 增加页面访问次数
    this.incrementPageSpecificMetric(page, 'visits')
  }

  private incrementPageSpecificMetric(page: string, metric: string, value?: any) {
    if (!this.pageSpecificMetrics.has(page)) {
      this.initPageSpecificMetrics(page)
    }

    const pageMetrics = this.pageSpecificMetrics.get(page)

    if (metric === 'uv' && value) {
      // 特殊处理UV，它是一个Set
      pageMetrics.uv.add(value)
    } else {
      // 其他数值型指标，直接增加
      pageMetrics[metric] = (pageMetrics[metric] || 0) + 1
    }

    this.savePageSpecificMetrics(page, pageMetrics)
    return pageMetrics[metric]
  }

  private updatePageSpecificMetric(page: string, metric: string, value: any) {
    if (!this.pageSpecificMetrics.has(page)) {
      this.initPageSpecificMetrics(page)
    }

    const pageMetrics = this.pageSpecificMetrics.get(page)
    pageMetrics[metric] = value

    this.savePageSpecificMetrics(page, pageMetrics)
    return value
  }

  private savePageSpecificMetrics(page: string, metrics: any) {
    // 将UV集合转为数组以便存储
    const metricsToStore = { ...metrics }
    if (metricsToStore.uv instanceof Set) {
      metricsToStore.uv = Array.from(metricsToStore.uv)
    }

    this.storage.setItem(`page_metrics_${page}`, metricsToStore)
  }

  getPageSpecificMetrics(page: string) {
    if (!this.pageSpecificMetrics.has(page)) {
      this.initPageSpecificMetrics(page)
    }

    const metrics = this.pageSpecificMetrics.get(page)
    return {
      pv: metrics.pv || 0,
      uv: metrics.uv instanceof Set ? metrics.uv.size : 0,
      averageDuration: metrics.visits > 0 ? metrics.duration / metrics.visits : 0,
      visits: metrics.visits || 0,
    }
  }

  getAllPagesMetrics() {
    const result: Record<string, any> = {}

    this.pageSpecificMetrics.forEach((metrics, page) => {
      result[page] = this.getPageSpecificMetrics(page)
    })

    return result
  }

  getMetrics(): Metrics {
    return {
      pv: this.storage.getItem('pv') || 0,
      uv: this.uvTracker.getUVCount(),
      averageDuration: this.durationTracker.getAverageDuration(),
      bounceRate: this.bounceTracker.calculateBounceRate(),
      pageVisitCounts: this.pageVisitTracker.getAllPageVisits(),
      source: this.storage.getItem('source') || 'unknown',
      isNewUser: this.userTracker.trackUser().isNewUser,
      visitFrequency: this.getVisitFrequency(),
      pagesMetrics: this.getAllPagesMetrics(),
    }
  }
}

const analyticsSDK = new AnalyticsSDK()
export default analyticsSDK
