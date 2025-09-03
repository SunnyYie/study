export interface Metrics {
  pv: number
  uv: number
  averageDuration: number
  bounceRate: number
  pageVisitCounts: Record<string, number>
  source: string
  isNewUser: boolean
  visitFrequency: number
  firstVisitTime?: number
  pagesMetrics?: Record<string, PageMetrics>
  user?: UserMetrics
}

export interface PageMetrics {
  pv: number
  uv: number
  averageDuration: number
  visits: number
}

export interface UserMetrics {
  userId: string
  isNewUser: boolean
}

export interface ITracker {
  trackPageView: (page: string, source?: string, userId?: string) => void
  trackEvent: (event: string, data?: Record<string, any>) => void
  getMetrics: () => Metrics
}

export interface IStorage {
  setItem: (key: string, value: any) => void
  getItem: (key: string) => any
  removeItem: (key: string) => void
}
