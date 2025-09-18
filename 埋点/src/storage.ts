import { PageViewData, UserVisitData } from './types'

/**
 * 本地存储管理器
 * 负责管理页面访问和用户访问数据的本地存储
 * 支持多用户数据隔离，防止用户切换时数据混乱
 * 支持失败数据缓存和数据完整性保证
 */
export class StorageManager {
  private readonly PV_STORAGE_KEY = 'analytics_pv_data'
  private readonly UV_STORAGE_KEY = 'analytics_uv_data'
  private readonly SESSION_KEY = 'analytics_session_id'
  private readonly DAILY_UV_KEY = 'analytics_daily_uv'
  private readonly CURRENT_USER_KEY = 'analytics_current_user'
  private readonly FAILED_DATA_KEY = 'analytics_failed_data'
  private readonly DATA_VERSION_KEY = 'analytics_data_version'

  private currentUserId: string | null = null
  private readonly DATA_VERSION = '1.0' // 用于数据版本控制

  /**
   * 设置当前用户ID并检查是否需要清理数据
   * @param userId 当前用户ID
   */
  setCurrentUser(userId: string): void {
    const previousUserId = this.getCurrentUser()

    // 如果用户ID发生变化，清理之前用户的数据
    if (previousUserId && previousUserId !== userId) {
      this.clearAllUserData()
      if (console.warn) {
        console.warn(`Analytics SDK: User changed from ${previousUserId} to ${userId}, cleared previous user data`)
      }
    }

    this.currentUserId = userId
    try {
      localStorage.setItem(this.CURRENT_USER_KEY, userId)
    } catch (error) {
      console.warn('Failed to save current user ID:', error)
    }
  }

  /**
   * 获取当前用户ID
   */
  getCurrentUser(): string | null {
    if (this.currentUserId) {
      return this.currentUserId
    }

    try {
      this.currentUserId = localStorage.getItem(this.CURRENT_USER_KEY)
      return this.currentUserId
    } catch (error) {
      console.warn('Failed to get current user ID:', error)
      return null
    }
  }

  /**
   * 检查数据是否属于当前用户
   * @param data 要检查的数据数组
   * @param userId 当前用户ID
   */
  private filterDataByUser<T extends { userId: string }>(data: T[], userId: string): T[] {
    return data.filter(item => item.userId === userId)
  }

  /**
   * 清理所有用户数据（用户切换时调用）
   */
  private clearAllUserData(): void {
    try {
      localStorage.removeItem(this.PV_STORAGE_KEY)
      localStorage.removeItem(this.UV_STORAGE_KEY)
      localStorage.removeItem(this.DAILY_UV_KEY)
      sessionStorage.removeItem(this.SESSION_KEY)
    } catch (error) {
      console.warn('Failed to clear user data:', error)
    }
  }

  /**
   * 获取页面访问数据
   */
  getPageViews(): PageViewData[] {
    try {
      const data = localStorage.getItem(this.PV_STORAGE_KEY)
      const allPageViews: PageViewData[] = data ? JSON.parse(data) : []

      // 只返回当前用户的数据
      const currentUserId = this.getCurrentUser()
      if (currentUserId) {
        return this.filterDataByUser(allPageViews, currentUserId)
      }

      return allPageViews
    } catch (error) {
      console.warn('Failed to get page views from localStorage:', error)
      return []
    }
  }

  /**
   * 保存页面访问数据
   */
  savePageView(pageView: PageViewData): void {
    try {
      // 获取所有数据（包含其他用户的）
      const data = localStorage.getItem(this.PV_STORAGE_KEY)
      const allPageViews: PageViewData[] = data ? JSON.parse(data) : []

      // 添加新数据
      allPageViews.push(pageView)

      localStorage.setItem(this.PV_STORAGE_KEY, JSON.stringify(allPageViews))
    } catch (error) {
      console.warn('Failed to save page view to localStorage:', error)
    }
  }

  /**
   * 获取用户访问数据
   */
  getUserVisits(): UserVisitData[] {
    try {
      const data = localStorage.getItem(this.UV_STORAGE_KEY)
      const allUserVisits: UserVisitData[] = data ? JSON.parse(data) : []

      // 只返回当前用户的数据
      const currentUserId = this.getCurrentUser()
      if (currentUserId) {
        return this.filterDataByUser(allUserVisits, currentUserId)
      }

      return allUserVisits
    } catch (error) {
      console.warn('Failed to get user visits from localStorage:', error)
      return []
    }
  }

  /**
   * 保存用户访问数据
   */
  saveUserVisit(userVisit: UserVisitData): void {
    try {
      // 获取所有数据（包含其他用户的）
      const data = localStorage.getItem(this.UV_STORAGE_KEY)
      const allUserVisits: UserVisitData[] = data ? JSON.parse(data) : []

      // 添加新数据
      allUserVisits.push(userVisit)

      localStorage.setItem(this.UV_STORAGE_KEY, JSON.stringify(allUserVisits))
    } catch (error) {
      console.warn('Failed to save user visit to localStorage:', error)
    }
  }

  /**
   * 清空页面访问数据（只清空当前用户的）
   */
  clearPageViews(): void {
    try {
      const data = localStorage.getItem(this.PV_STORAGE_KEY)
      if (!data) return

      const allPageViews: PageViewData[] = JSON.parse(data)
      const currentUserId = this.getCurrentUser()

      if (currentUserId) {
        // 保留其他用户的数据，只清空当前用户的
        const otherUsersData = allPageViews.filter(item => item.userId !== currentUserId)
        localStorage.setItem(this.PV_STORAGE_KEY, JSON.stringify(otherUsersData))
      } else {
        // 如果没有当前用户，清空所有数据
        localStorage.removeItem(this.PV_STORAGE_KEY)
      }
    } catch (error) {
      console.warn('Failed to clear page views from localStorage:', error)
    }
  }

  /**
   * 清空用户访问数据（只清空当前用户的）
   */
  clearUserVisits(): void {
    try {
      const data = localStorage.getItem(this.UV_STORAGE_KEY)
      if (!data) return

      const allUserVisits: UserVisitData[] = JSON.parse(data)
      const currentUserId = this.getCurrentUser()

      if (currentUserId) {
        // 保留其他用户的数据，只清空当前用户的
        const otherUsersData = allUserVisits.filter(item => item.userId !== currentUserId)
        localStorage.setItem(this.UV_STORAGE_KEY, JSON.stringify(otherUsersData))
      } else {
        // 如果没有当前用户，清空所有数据
        localStorage.removeItem(this.UV_STORAGE_KEY)
      }
    } catch (error) {
      console.warn('Failed to clear user visits from localStorage:', error)
    }
  }

  /**
   * 获取或生成会话ID
   */
  getSessionId(): string {
    try {
      let sessionId = sessionStorage.getItem(this.SESSION_KEY)
      if (!sessionId) {
        sessionId = this.generateSessionId()
        sessionStorage.setItem(this.SESSION_KEY, sessionId)
      }
      return sessionId
    } catch (error) {
      console.warn('Failed to get/set session ID:', error)
      return this.generateSessionId()
    }
  }

  /**
   * 检查今天是否已记录UV
   */
  isTodayUVRecorded(userId: string): boolean {
    try {
      const today = new Date().toDateString()
      const dailyUV = localStorage.getItem(this.DAILY_UV_KEY)
      if (!dailyUV) return false

      const uvData = JSON.parse(dailyUV)
      return uvData.date === today && uvData.userId === userId
    } catch (error) {
      console.warn('Failed to check daily UV record:', error)
      return false
    }
  }

  /**
   * 标记今天的UV已记录
   */
  markTodayUVRecorded(userId: string): void {
    try {
      const today = new Date().toDateString()
      const uvData = { date: today, userId }
      localStorage.setItem(this.DAILY_UV_KEY, JSON.stringify(uvData))
    } catch (error) {
      console.warn('Failed to mark daily UV record:', error)
    }
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  /**
   * 保存失败的数据到缓存
   * @param data 失败的数据
   * @param reason 失败原因
   */
  saveFailedData(data: { pageViews: any[]; userVisits: any[] }, reason: string): void {
    try {
      const failedData = this.getFailedData()
      const failedItem = {
        id: this.generateDataId(),
        data,
        reason,
        timestamp: Date.now(),
        retryCount: 0,
        userId: this.getCurrentUser(),
        version: this.DATA_VERSION,
      }

      failedData.push(failedItem)

      // 限制缓存数量，避免无限增长（最多保留100条）
      if (failedData.length > 100) {
        failedData.splice(0, failedData.length - 100)
      }

      localStorage.setItem(this.FAILED_DATA_KEY, JSON.stringify(failedData))

      if (console.warn) {
        console.warn(`Analytics SDK: Cached failed data, reason: ${reason}`)
      }
    } catch (error) {
      console.error('Failed to save failed data to cache:', error)
    }
  }

  /**
   * 获取失败的数据缓存
   */
  getFailedData(): any[] {
    try {
      const data = localStorage.getItem(this.FAILED_DATA_KEY)
      const allFailedData = data ? JSON.parse(data) : []

      // 只返回当前用户的失败数据
      const currentUserId = this.getCurrentUser()
      if (currentUserId) {
        return allFailedData.filter((item: any) => item.userId === currentUserId && item.version === this.DATA_VERSION)
      }

      return allFailedData.filter((item: any) => item.version === this.DATA_VERSION)
    } catch (error) {
      console.warn('Failed to get failed data from cache:', error)
      return []
    }
  }

  /**
   * 删除已成功上报的失败数据
   * @param dataId 数据ID
   */
  removeFailedData(dataId: string): void {
    try {
      const data = localStorage.getItem(this.FAILED_DATA_KEY)
      if (!data) return

      const allFailedData = JSON.parse(data)
      const filteredData = allFailedData.filter((item: any) => item.id !== dataId)

      localStorage.setItem(this.FAILED_DATA_KEY, JSON.stringify(filteredData))
    } catch (error) {
      console.warn('Failed to remove failed data from cache:', error)
    }
  }

  /**
   * 更新失败数据的重试次数
   * @param dataId 数据ID
   */
  updateFailedDataRetryCount(dataId: string): void {
    try {
      const data = localStorage.getItem(this.FAILED_DATA_KEY)
      if (!data) return

      const allFailedData = JSON.parse(data)
      const item = allFailedData.find((item: any) => item.id === dataId)

      if (item) {
        item.retryCount = (item.retryCount || 0) + 1
        item.lastRetryTime = Date.now()
        localStorage.setItem(this.FAILED_DATA_KEY, JSON.stringify(allFailedData))
      }
    } catch (error) {
      console.warn('Failed to update retry count for failed data:', error)
    }
  }

  /**
   * 清理过期的失败数据（超过7天）
   */
  cleanupExpiredFailedData(): void {
    try {
      const data = localStorage.getItem(this.FAILED_DATA_KEY)
      if (!data) return

      const allFailedData = JSON.parse(data)
      const now = Date.now()
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000

      const validData = allFailedData.filter(
        (item: any) => item.timestamp > sevenDaysAgo && (item.retryCount || 0) < 10, // 重试超过10次的也清理掉
      )

      if (validData.length !== allFailedData.length) {
        localStorage.setItem(this.FAILED_DATA_KEY, JSON.stringify(validData))
        if (console.log) {
          console.log(`Analytics SDK: Cleaned up ${allFailedData.length - validData.length} expired failed data items`)
        }
      }
    } catch (error) {
      console.warn('Failed to cleanup expired failed data:', error)
    }
  }

  /**
   * 验证数据完整性
   * @param data 要验证的数据
   */
  validateDataIntegrity(data: any): boolean {
    try {
      if (!data || typeof data !== 'object') return false

      // 检查必需的字段
      if (!data.pageViews || !Array.isArray(data.pageViews)) return false
      if (!data.userVisits || !Array.isArray(data.userVisits)) return false

      // 验证每个PV数据项
      for (const pv of data.pageViews) {
        if (!pv.appId || !pv.userId || !pv.url || !pv.timestamp) return false
        if (typeof pv.timestamp !== 'number' || pv.timestamp <= 0) return false
      }

      // 验证每个UV数据项
      for (const uv of data.userVisits) {
        if (!uv.appId || !uv.userId || !uv.timestamp || !uv.sessionId) return false
        if (typeof uv.timestamp !== 'number' || uv.timestamp <= 0) return false
      }

      return true
    } catch (error) {
      console.warn('Data integrity validation failed:', error)
      return false
    }
  }

  /**
   * 获取存储空间使用情况
   */
  getStorageInfo(): { used: number; limit: number; available: number } {
    try {
      let used = 0
      let limit = 5 * 1024 * 1024 // 假设5MB限制

      // 计算已使用空间
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith('analytics_')) {
          used += localStorage[key].length
        }
      }

      return {
        used,
        limit,
        available: limit - used,
      }
    } catch (error) {
      console.warn('Failed to get storage info:', error)
      return { used: 0, limit: 0, available: 0 }
    }
  }

  /**
   * 生成唯一数据ID
   */
  private generateDataId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
