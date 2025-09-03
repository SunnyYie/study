import { UserInfo } from './types';

export class Utils {
  /**
   * 生成唯一ID
   */
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 生成UUID
   */
  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * 获取设备信息
   */
  static getDeviceInfo() {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    
    // 检测浏览器
    let browser = 'Unknown';
    let version = 'Unknown';
    
    if (ua.indexOf('Chrome') > -1) {
      browser = 'Chrome';
      const match = ua.match(/Chrome\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (ua.indexOf('Firefox') > -1) {
      browser = 'Firefox';
      const match = ua.match(/Firefox\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (ua.indexOf('Safari') > -1) {
      browser = 'Safari';
      const match = ua.match(/Version\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (ua.indexOf('Edge') > -1) {
      browser = 'Edge';
      const match = ua.match(/Edge\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    }

    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    return {
      platform,
      browser,
      version,
      isMobile,
      screenResolution: `${screen.width}x${screen.height}`
    };
  }

  /**
   * 获取当前页面信息
   */
  static getPageInfo() {
    return {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer || ''
    };
  }

  /**
   * 获取元素选择器
   */
  static getElementSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      return `.${element.className.replace(/\s+/g, '.')}`;
    }
    
    let selector = element.tagName.toLowerCase();
    const parent = element.parentElement;
    
    if (parent) {
      const siblings = Array.from(parent.children);
      const index = siblings.indexOf(element);
      if (index > 0) {
        selector += `:nth-child(${index + 1})`;
      }
    }
    
    return selector;
  }

  /**
   * 深度克隆对象
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime()) as any;
    }
    
    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item)) as any;
    }
    
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }
    
    return cloned;
  }

  /**
   * 防抖函数
   */
  static debounce(func: Function, wait: number): Function {
    let timeout: number;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait) as any;
    };
  }

  /**
   * 节流函数
   */
  static throttle(func: Function, limit: number): Function {
    let inThrottle: boolean;
    return function executedFunction(...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * 安全的JSON字符串化
   */
  static safeStringify(obj: any): string {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      return JSON.stringify({ error: 'Failed to stringify object' });
    }
  }

  /**
   * 获取或创建用户ID
   */
  static getOrCreateUserId(): string {
    const key = 'analytics_user_id';
    let userId = localStorage.getItem(key);
    
    if (!userId) {
      userId = this.generateUUID();
      localStorage.setItem(key, userId);
    }
    
    return userId;
  }

  /**
   * 获取或创建会话ID
   */
  static getOrCreateSessionId(): string {
    const key = 'analytics_session_id';
    const timeKey = 'analytics_session_time';
    const sessionTimeout = 30 * 60 * 1000; // 30分钟会话超时
    
    const now = Date.now();
    const lastTime = parseInt(localStorage.getItem(timeKey) || '0');
    
    let sessionId = localStorage.getItem(key);
    
    if (!sessionId || (now - lastTime) > sessionTimeout) {
      sessionId = this.generateUUID();
      localStorage.setItem(key, sessionId);
    }
    
    localStorage.setItem(timeKey, now.toString());
    
    return sessionId;
  }
}
