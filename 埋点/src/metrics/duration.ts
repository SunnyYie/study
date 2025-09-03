export class DurationTracker {
  private static instance: DurationTracker
  private startTime: number | null = null
  private totalDuration: number = 0
  private visitCount: number = 0
  private pageStartTimes: Map<string, number> = new Map()
  private pageDurations: Map<string, number> = new Map()

  constructor() {
    if (typeof window !== 'undefined') {
      // 页面加载时开始计时
      this.startTracking()
      // 页面卸载时结束计时
      window.addEventListener('beforeunload', () => this.stopTracking())

      // 加载之前的数据
      this.loadDurationData()
    }
  }

  public static getInstance(): DurationTracker {
    if (!DurationTracker.instance) {
      DurationTracker.instance = new DurationTracker()
    }
    return DurationTracker.instance
  }

  private loadDurationData() {
    if (typeof localStorage !== 'undefined') {
      const savedData = localStorage.getItem('durationData')
      if (savedData) {
        try {
          const data = JSON.parse(savedData)
          this.totalDuration = data.totalDuration || 0
          this.visitCount = data.visitCount || 0

          // 加载每个页面的停留时间
          if (data.pageDurations) {
            this.pageDurations = new Map(Object.entries(data.pageDurations))
          }
        } catch (e) {
          console.error('Error parsing duration data:', e)
        }
      }
    }
  }

  public startTracking(page?: string) {
    this.startTime = performance?.now() || Date.now()

    if (page) {
      this.startTrackingPage(page)
    }
  }

  public startTrackingPage(page: string) {
    this.pageStartTimes.set(page, performance?.now() || Date.now())
  }

  public stopTrackingPage(page: string) {
    const startTime = this.pageStartTimes.get(page)
    if (startTime) {
      const now = performance?.now() || Date.now()
      const duration = now - startTime

      // 更新页面停留时间
      const currentDuration = this.pageDurations.get(page) || 0
      this.pageDurations.set(page, currentDuration + duration)

      // 删除开始时间记录
      this.pageStartTimes.delete(page)

      this.saveDurationData()
      return duration
    }
    return 0
  }

  public stopTracking() {
    if (this.startTime !== null) {
      const now = performance?.now() || Date.now()
      const duration = now - this.startTime
      this.totalDuration += duration
      this.visitCount++
      this.startTime = null
      this.saveDurationData()
      return duration
    }
    return 0
  }

  public getAverageDuration(): number {
    return this.visitCount > 0 ? this.totalDuration / this.visitCount : 0
  }

  public getCurrentSessionDuration(): number {
    if (this.startTime === null) return 0
    const now = performance?.now() || Date.now()
    return now - this.startTime
  }

  public getPageAverageDuration(page: string): number {
    // 获取某个页面的平均停留时间
    const totalPages = localStorage.getItem(`pageVisits_${page}_count`)
    const pageDuration = this.pageDurations.get(page) || 0

    const pageCount = totalPages ? parseInt(totalPages, 10) : 0
    return pageCount > 0 ? pageDuration / pageCount : 0
  }

  private saveDurationData() {
    const durationData = {
      totalDuration: this.totalDuration,
      visitCount: this.visitCount,
      averageDuration: this.getAverageDuration(),
      pageDurations: Object.fromEntries(this.pageDurations),
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('durationData', JSON.stringify(durationData))
    }
  }

  public trackDuration() {
    // 可以在这里添加额外的持续时间跟踪逻辑
    return this.getAverageDuration()
  }
}
