// 基础类型定义
export interface UserInfo {
  userId: string;
  sessionId: string;
  userAgent: string;
  ip?: string;
  location?: {
    country?: string;
    city?: string;
  };
  deviceInfo: {
    platform: string;
    browser: string;
    version: string;
    isMobile: boolean;
    screenResolution: string;
  };
  customProperties?: Record<string, any>;
}

// 页面访问数据
export interface PageViewData {
  pageUrl: string;
  pageTitle: string;
  referrer: string;
  timestamp: number;
  duration?: number; // 页面停留时间
  userId: string;
  sessionId: string;
}

// 用户操作数据
export interface UserActionData {
  actionType: 'click' | 'scroll' | 'input' | 'api_call' | 'custom';
  element?: string; // 元素选择器或描述
  elementText?: string; // 元素文本内容
  pageUrl: string;
  timestamp: number;
  userId: string;
  sessionId: string;
  customData?: Record<string, any>;
}

// API调用数据
export interface ApiCallData {
  url: string;
  method: string;
  status: number;
  duration: number;
  timestamp: number;
  userId: string;
  sessionId: string;
  requestSize?: number;
  responseSize?: number;
}

// 错误数据
export interface ErrorData {
  message: string;
  stack?: string;
  pageUrl: string;
  timestamp: number;
  userId: string;
  sessionId: string;
  errorType: 'javascript' | 'resource' | 'api' | 'custom';
}

// SDK配置
export interface AnalyticsConfig {
  appId: string;
  apiEndpoint: string;
  enablePV?: boolean;
  enableUserTracking?: boolean;
  enableClickTracking?: boolean;
  enableApiTracking?: boolean;
  enableErrorTracking?: boolean;
  batchSize?: number;
  flushInterval?: number; // 数据上报间隔（毫秒）
  debug?: boolean;
  userId?: string;
  customUserInfo?: Record<string, any>;
}
