class Limmiter {
  constructor(N, Count) {
    this.N = N * 60 * 1000 // 转换为毫秒
    this.Count = Count
    this.accessMap = new Map() // 存储每个url的访问时间戳
  }

  // 访问url
  visit(url) {
    const now = Date.now()
    if (!this.accessMap.has(url)) {
      this.accessMap.set(url, [])
    }
    const timestamps = this.accessMap.get(url)

    // 移除过期的时间戳
    while (timestamps.length > 0 && now - timestamps[0] > this.N) {
      timestamps.shift()
    }
    timestamps.push(now)
  }

  allow(url) {
    const now = Date.now()
    if (!this.accessMap.has(url)) {
      this.accessMap.set(url, [])
    }
    const timestamps = this.accessMap.get(url)

    // 移除过期的时间戳
    while (timestamps.length > 0 && now - timestamps[0] > this.N) {
      timestamps.shift()
    }
    if (timestamps.length < this.Count) {
      timestamps.push(now)
      return true // 允许访问
    }
    return false // 已超限
  }
}
