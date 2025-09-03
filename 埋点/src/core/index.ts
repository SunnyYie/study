import Tracker from './tracker'

class AnalyticsSDK {
  private tracker: Tracker

  constructor() {
    this.tracker = new Tracker()
    this.initialize()
  }

  private initialize() {
    // Initialize the SDK, set up event listeners, etc.
    this.tracker.trackPageView(window.location.pathname, 'init', 'anonymous')
  }

  public trackPageView(page: string, source: string = 'manual', userId: string = 'anonymous') {
    this.tracker.trackPageView(page, source, userId)
  }

  public trackEvent(eventName: string, eventData: any) {
    this.tracker.trackEvent(eventName, eventData)
  }

  public getMetrics() {
    return this.tracker.getMetrics()
  }
}

const analyticsSDK = new AnalyticsSDK()
export default analyticsSDK
