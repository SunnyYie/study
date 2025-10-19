// 接口监控
;(function () {
  const originFetch = window.fetch
  window.fetch = (url, options = {}) => {
    return originFetch(url, options)
      .then(res => {
        if (!res.ok) {
          const errorInfo = {}
        }
        return res
      })
      .catch(err => {
        const error = {}

        throw err
      })
  }
})()

// 数据上报
class ReportQueue {
  constructor() {
    this.queue = []
    this.sending = false
    // 定时发送
    this.batchSize = 10 // 批量上报阈值
    this.delay = 3000 // 延迟上报时间（毫秒）
    // 上报失败重试
    this.retryLimit = 3 // 重试次数
    this.retryDelay = 1000 // 重试延迟时间（毫秒）

    // 防抖
    this.timer = null
  }

  add(report) {
    this.queue.push(report)
    this.schedule()
  }

  // 调度
  schedule() {
    if (this.sending || this.queue.length === 0) return
    if (this.queue.length >= this.batchSize) {
      this.sendNext()
    } else {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.sendNext()
      }, this.delay)
    }
  }

  sendNext() {
    if (this.sending || this.queue.length === 0) return
    this.sending = true

    const batch = this.queue.splice(0, this.batchSize) // 取出一批数据
    const data = JSON.stringify(batch)

    try {
      const success = navigator.sendBeacon('/report-endpoint', data)
      if (!success) {
        // 处理发送失败的情况
        throw new Error('Send beacon failed')
      }
    } catch (e) {
      // 缓存失败的数据以便重试
      this.saveQueue(data)

      // 重试
      batch.forEach(item => item.retryCount = (item.retryCount || 0) + 1)
      this.queue.unshift(...batch.filter(item => item.retryCount <= this.retryLimit))

      // 延时重试
      setTimeout(() => this.schedule(), this.retryDelay)
    } finally {
      this.sending = false
      if (this.queue.length > 0) {
        this.schedule()
      }
    }
  }

  saveQueue(data) {
    localStorage.setItem('reportQueue', data)
  }
}
