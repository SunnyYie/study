import { AnalyticsSDK } from './analytics'
import { SDKConfig, PageViewData, UserVisitData, ReportData } from './types'

// 创建全局SDK实例
const analytics = new AnalyticsSDK()

/**
 * 初始化埋点SDK
 * @param config SDK配置选项
 *
 * @example
 * ```typescript
 * // 在 main.ts 中初始化
 * import { init } from 'analytics-sdk';
 *
 * init({
 *   appId: 'your-app-id',
 *   userId: 'user-123',
 *   reportUrl: 'https://your-api.com/analytics', // 可选
 *   reportInterval: 10000, // 可选，默认5秒
 *   debug: true // 可选，默认false
 * });
 * ```
 */
export function init(config: SDKConfig): void {
  analytics.init(config)
}

/**
 * 手动记录页面访问
 * @param url 页面URL，可选，默认为当前页面URL
 * @param title 页面标题，可选，默认为当前页面标题
 *
 * @example
 * ```typescript
 * import { trackPageView } from 'analytics-sdk';
 *
 * // 自动记录当前页面
 * trackPageView();
 *
 * // 记录指定页面
 * trackPageView('/custom-page', 'Custom Page Title');
 * ```
 */
export function trackPageView(url?: string, title?: string): void {
  analytics.trackPageView(url, title)
}

/**
 * 手动上报数据
 * @returns Promise<boolean> 上报是否成功
 *
 * @example
 * ```typescript
 * import { report } from 'analytics-sdk';
 *
 * const success = await report();
 * console.log('Report success:', success);
 * ```
 */
export async function report(): Promise<boolean> {
  return analytics.report()
}

/**
 * 销毁SDK实例
 * 通常在应用卸载时调用
 *
 * @example
 * ```typescript
 * import { destroy } from 'analytics-sdk';
 *
 * // 在应用卸载时调用
 * destroy();
 * ```
 */
export function destroy(): void {
  analytics.destroy()
}

/**
 * 获取当前SDK配置
 * @returns SDKConfig | null 当前配置或null（未初始化）
 */
export function getConfig(): SDKConfig | null {
  return analytics.getConfig()
}

// 导出类型定义
export type { SDKConfig, PageViewData, UserVisitData, ReportData }

// 导出核心类（高级用法）
export { AnalyticsSDK }

// 默认导出（便于某些场景使用）
export default {
  init,
  trackPageView,
  report,
  destroy,
  getConfig,
}
