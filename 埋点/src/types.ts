/**
 * SDK配置选项
 */
export interface SDKConfig {
  /** 应用ID */
  appId: string
  /** 用户ID */
  userId: string
  /** 数据上报接口地址，可选，默认为 '/api/analytics' */
  reportUrl?: string
  /** 自动上报间隔时间（毫秒），默认为 5000ms */
  reportInterval?: number
  /** 是否开启调试模式，默认为 false */
  debug?: boolean
}

/**
 * 页面访问（PV）数据
 */
export interface PageViewData {
  /** 应用ID */
  appId: string
  /** 用户ID */
  userId: string
  /** 页面URL */
  url: string
  /** 页面标题 */
  title: string
  /** 访问时间戳 */
  timestamp: number
  /** 用户代理信息 */
  userAgent: string
  /** 来源页面 */
  referrer: string
}

/**
 * 用户访问（UV）数据
 */
export interface UserVisitData {
  /** 应用ID */
  appId: string
  /** 用户ID */
  userId: string
  /** 访问时间戳 */
  timestamp: number
  /** 用户代理信息 */
  userAgent: string
  /** 会话ID */
  sessionId: string
}

/**
 * 上报数据格式
 */
export interface ReportData {
  /** 页面访问数据列表 */
  pageViews: PageViewData[]
  /** 用户访问数据列表 */
  userVisits: UserVisitData[]
}
