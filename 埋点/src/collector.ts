import { Utils } from './utils';

export class DataCollector {
  private queue: any[] = [];
  private apiEndpoint: string;
  private batchSize: number;
  private flushInterval: number;
  private timer: number | null = null;

  constructor(apiEndpoint: string, batchSize = 10, flushInterval = 5000) {
    this.apiEndpoint = apiEndpoint;
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;
    
    this.startAutoFlush();
    this.bindBeforeUnload();
  }

  /**
   * 添加数据到队列
   */
  collect(data: any): void {
    this.queue.push({
      ...data,
      timestamp: data.timestamp || Date.now()
    });

    // 如果队列达到批量大小，立即发送
    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * 立即发送所有队列中的数据
   */
  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const dataToSend = [...this.queue];
    this.queue = [];

    try {
      await this.sendData(dataToSend);
    } catch (error) {
      console.error('Failed to send analytics data:', error);
      // 发送失败时，可以选择重新加入队列或丢弃
      // this.queue.unshift(...dataToSend);
    }
  }

  /**
   * 发送数据到服务器
   */
  private async sendData(data: any[]): Promise<void> {
    const payload = {
      events: data,
      meta: {
        sdkVersion: '1.0.0',
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      }
    };

    // 优先使用 sendBeacon API（适用于页面卸载时）
    if (navigator.sendBeacon) {
      const success = navigator.sendBeacon(
        this.apiEndpoint,
        JSON.stringify(payload)
      );
      
      if (success) return;
    }

    // 备用方案：使用 fetch
    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true // 保持连接，即使页面关闭
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  /**
   * 开始自动刷新
   */
  private startAutoFlush(): void {
    this.timer = setInterval(() => {
      this.flush();
    }, this.flushInterval) as any;
  }

  /**
   * 停止自动刷新
   */
  private stopAutoFlush(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * 绑定页面卸载事件
   */
  private bindBeforeUnload(): void {
    window.addEventListener('beforeunload', () => {
      this.flush();
    });

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });
  }

  /**
   * 销毁收集器
   */
  destroy(): void {
    this.stopAutoFlush();
    this.flush();
  }
}
