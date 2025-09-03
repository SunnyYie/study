import { Utils } from './utils';
import { DataCollector } from './collector';
import { 
  AnalyticsConfig, 
  UserInfo, 
  PageViewData, 
  UserActionData, 
  ApiCallData, 
  ErrorData 
} from './types';

export class Analytics {
  private config: AnalyticsConfig;
  private collector: DataCollector;
  private userInfo: UserInfo;
  private currentPageStartTime: number = Date.now();
  private originalFetch?: typeof fetch;
  private originalXMLHttpRequest?: typeof XMLHttpRequest;

  constructor(config: AnalyticsConfig) {
    this.config = {
      enablePV: true,
      enableUserTracking: true,
      enableClickTracking: true,
      enableApiTracking: true,
      enableErrorTracking: true,
      batchSize: 10,
      flushInterval: 5000,
      debug: false,
      ...config
    };

    this.collector = new DataCollector(
      this.config.apiEndpoint,
      this.config.batchSize,
      this.config.flushInterval
    );

    this.userInfo = this.initUserInfo();
    this.init();
  }

  /**
   * 初始化用户信息
   */
  private initUserInfo(): UserInfo {
    const deviceInfo = Utils.getDeviceInfo();
    
    return {
      userId: this.config.userId || Utils.getOrCreateUserId(),
      sessionId: Utils.getOrCreateSessionId(),
      userAgent: navigator.userAgent,
      deviceInfo,
      customProperties: this.config.customUserInfo || {}
    };
  }

  /**
   * 初始化SDK
   */
  private init(): void {
    if (this.config.debug) {
      console.log('Analytics SDK initialized with config:', this.config);
    }

    // 初始化各种追踪功能
    if (this.config.enablePV) {
      this.trackPageView();
      this.bindPageVisibilityChange();
    }

    if (this.config.enableClickTracking) {
      this.bindClickTracking();
    }

    if (this.config.enableApiTracking) {
      this.interceptNetworkRequests();
    }

    if (this.config.enableErrorTracking) {
      this.bindErrorTracking();
    }

    // 发送用户信息
    if (this.config.enableUserTracking) {
      this.trackUser();
    }
  }

  /**
   * 追踪页面访问
   */
  trackPageView(pageUrl?: string, pageTitle?: string): void {
    const pageInfo = Utils.getPageInfo();
    
    const data: PageViewData = {
      pageUrl: pageUrl || pageInfo.url,
      pageTitle: pageTitle || pageInfo.title,
      referrer: pageInfo.referrer,
      timestamp: Date.now(),
      userId: this.userInfo.userId,
      sessionId: this.userInfo.sessionId
    };

    this.collector.collect({
      type: 'page_view',
      data
    });

    this.currentPageStartTime = Date.now();

    if (this.config.debug) {
      console.log('Page view tracked:', data);
    }
  }

  /**
   * 追踪用户信息
   */
  trackUser(): void {
    this.collector.collect({
      type: 'user_info',
      data: this.userInfo
    });

    if (this.config.debug) {
      console.log('User info tracked:', this.userInfo);
    }
  }

  /**
   * 追踪用户操作
   */
  trackAction(actionType: UserActionData['actionType'], customData?: Record<string, any>): void {
    const pageInfo = Utils.getPageInfo();
    
    const data: UserActionData = {
      actionType,
      pageUrl: pageInfo.url,
      timestamp: Date.now(),
      userId: this.userInfo.userId,
      sessionId: this.userInfo.sessionId,
      customData
    };

    this.collector.collect({
      type: 'user_action',
      data
    });

    if (this.config.debug) {
      console.log('User action tracked:', data);
    }
  }

  /**
   * 追踪点击事件
   */
  trackClick(element: Element, customData?: Record<string, any>): void {
    const pageInfo = Utils.getPageInfo();
    
    const data: UserActionData = {
      actionType: 'click',
      element: Utils.getElementSelector(element),
      elementText: element.textContent?.trim() || '',
      pageUrl: pageInfo.url,
      timestamp: Date.now(),
      userId: this.userInfo.userId,
      sessionId: this.userInfo.sessionId,
      customData
    };

    this.collector.collect({
      type: 'user_action',
      data
    });

    if (this.config.debug) {
      console.log('Click tracked:', data);
    }
  }

  /**
   * 追踪API调用
   */
  trackApiCall(apiData: Partial<ApiCallData>): void {
    const data: ApiCallData = {
      url: '',
      method: 'GET',
      status: 200,
      duration: 0,
      timestamp: Date.now(),
      userId: this.userInfo.userId,
      sessionId: this.userInfo.sessionId,
      ...apiData
    };

    this.collector.collect({
      type: 'api_call',
      data
    });

    if (this.config.debug) {
      console.log('API call tracked:', data);
    }
  }

  /**
   * 追踪错误
   */
  trackError(error: Error | string, errorType: ErrorData['errorType'] = 'javascript'): void {
    const pageInfo = Utils.getPageInfo();
    
    const data: ErrorData = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      pageUrl: pageInfo.url,
      timestamp: Date.now(),
      userId: this.userInfo.userId,
      sessionId: this.userInfo.sessionId,
      errorType
    };

    this.collector.collect({
      type: 'error',
      data
    });

    if (this.config.debug) {
      console.log('Error tracked:', data);
    }
  }

  /**
   * 绑定点击事件追踪
   */
  private bindClickTracking(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as Element;
      if (target) {
        this.trackClick(target);
      }
    }, true);
  }

  /**
   * 绑定页面可见性变化
   */
  private bindPageVisibilityChange(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // 页面隐藏时记录停留时间
        const duration = Date.now() - this.currentPageStartTime;
        const pageInfo = Utils.getPageInfo();
        
        const data: PageViewData = {
          pageUrl: pageInfo.url,
          pageTitle: pageInfo.title,
          referrer: pageInfo.referrer,
          timestamp: this.currentPageStartTime,
          duration,
          userId: this.userInfo.userId,
          sessionId: this.userInfo.sessionId
        };

        this.collector.collect({
          type: 'page_duration',
          data
        });
      }
    });
  }

  /**
   * 拦截网络请求
   */
  private interceptNetworkRequests(): void {
    // 拦截 fetch
    if (window.fetch) {
      this.originalFetch = window.fetch;
      window.fetch = this.createFetchInterceptor();
    }

    // 拦截 XMLHttpRequest
    if (window.XMLHttpRequest) {
      this.originalXMLHttpRequest = window.XMLHttpRequest;
      window.XMLHttpRequest = this.createXHRInterceptor();
    }
  }

  /**
   * 创建 fetch 拦截器
   */
  private createFetchInterceptor(): typeof fetch {
    return async (input: RequestInfo | URL, init?: RequestInit) => {
      const startTime = Date.now();
      const url = input.toString();
      const method = init?.method || 'GET';

      try {
        const response = await this.originalFetch!(input, init);
        const duration = Date.now() - startTime;

        this.trackApiCall({
          url,
          method,
          status: response.status,
          duration,
          requestSize: init?.body ? new Blob([init.body as any]).size : 0
        });

        return response;
      } catch (error) {
        const duration = Date.now() - startTime;
        
        this.trackApiCall({
          url,
          method,
          status: 0,
          duration
        });

        this.trackError(error as Error, 'api');
        throw error;
      }
    };
  }

  /**
   * 创建 XMLHttpRequest 拦截器
   */
  private createXHRInterceptor(): typeof XMLHttpRequest {
    const analytics = this;
    
    return class extends analytics.originalXMLHttpRequest! {
      private _url: string = '';
      private _method: string = 'GET';
      private _startTime: number = 0;

      open(method: string, url: string | URL, async: boolean = true, user?: string | null, password?: string | null): void {
        this._method = method;
        this._url = url.toString();
        this._startTime = Date.now();
        
        super.open(method, url, async, user, password);
      }

      send(body?: Document | XMLHttpRequestBodyInit | null): void {
        this.addEventListener('loadend', () => {
          const duration = Date.now() - this._startTime;
          
          analytics.trackApiCall({
            url: this._url,
            method: this._method,
            status: this.status,
            duration,
            requestSize: body ? new Blob([body as any]).size : 0
          });
        });

        this.addEventListener('error', () => {
          analytics.trackError(new Error(`XHR request failed: ${this._url}`), 'api');
        });

        super.send(body);
      }
    };
  }

  /**
   * 绑定错误追踪
   */
  private bindErrorTracking(): void {
    // JavaScript 错误
    window.addEventListener('error', (event) => {
      this.trackError(event.error || event.message, 'javascript');
    });

    // Promise 拒绝错误
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(
        new Error(`Unhandled promise rejection: ${event.reason}`),
        'javascript'
      );
    });

    // 资源加载错误
    window.addEventListener('error', (event) => {
      const target = event.target as HTMLElement;
      if (target && target !== (window as any) && target.tagName) {
        this.trackError(
          new Error(`Resource failed to load: ${(target as any).src || (target as any).href}`),
          'resource'
        );
      }
    }, true);
  }

  /**
   * 更新用户信息
   */
  setUserInfo(userInfo: Partial<UserInfo>): void {
    this.userInfo = {
      ...this.userInfo,
      ...userInfo
    };

    if (this.config.enableUserTracking) {
      this.trackUser();
    }
  }

  /**
   * 更新用户ID
   */
  setUserId(userId: string): void {
    this.userInfo.userId = userId;
    localStorage.setItem('analytics_user_id', userId);

    if (this.config.enableUserTracking) {
      this.trackUser();
    }
  }

  /**
   * 立即发送所有数据
   */
  flush(): Promise<void> {
    return this.collector.flush();
  }

  /**
   * 销毁SDK实例
   */
  destroy(): void {
    // 恢复原始网络请求方法
    if (this.originalFetch) {
      window.fetch = this.originalFetch;
    }

    if (this.originalXMLHttpRequest) {
      window.XMLHttpRequest = this.originalXMLHttpRequest;
    }

    this.collector.destroy();
  }
}
