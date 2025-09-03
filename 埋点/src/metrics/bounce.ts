export class BounceTracker {
  private bounceCount: number = 0
  private totalVisits: number = 0

  constructor() {
    this.init()
  }

  private init() {
    window.addEventListener('beforeunload', () => {
      // 检查是否是单页访问
      if (performance && performance.navigation) {
        const navigationType = performance.navigation.type
        if (navigationType === 0 && document.referrer === '') {
          this.trackBounce()
        }
      }
    })
  }

  public trackBounce() {
    this.bounceCount++
    this.totalVisits++
    this.saveBounceData()
  }

  public calculateBounceRate(): number {
    return this.totalVisits > 0 ? (this.bounceCount / this.totalVisits) * 100 : 0
  }

  private saveBounceData() {
    const bounceData = {
      bounceCount: this.bounceCount,
      totalVisits: this.totalVisits,
      bounceRate: this.calculateBounceRate(),
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bounceData', JSON.stringify(bounceData))
    }
  }
}

export function trackBounce() {
  const tracker = new BounceTracker()
  tracker.trackBounce()
}
