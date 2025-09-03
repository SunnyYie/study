export class PageVisit {
  private pageVisits: { [key: string]: number } = {}

  constructor() {
    // 尝试从本地存储加载页面访问数据
    this.loadPageVisits()
  }

  private loadPageVisits() {
    if (typeof localStorage !== 'undefined') {
      const savedData = localStorage.getItem('pageVisits')
      if (savedData) {
        try {
          this.pageVisits = JSON.parse(savedData)
        } catch (e) {
          console.error('Error parsing page visit data:', e)
        }
      }
    }
  }

  trackPageVisit(page: string): void {
    if (this.pageVisits[page]) {
      this.pageVisits[page]++
    } else {
      this.pageVisits[page] = 1
    }
    this.savePageVisit()
  }

  private savePageVisit(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('pageVisits', JSON.stringify(this.pageVisits))
    }
  }

  getPageVisitCount(page: string): number {
    return this.pageVisits[page] || 0
  }

  getAllPageVisits(): { [key: string]: number } {
    return this.pageVisits
  }
}

export function trackPageVisit(page = window.location.pathname) {
  const tracker = new PageVisit()
  tracker.trackPageVisit(page)
}
