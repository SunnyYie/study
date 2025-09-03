import { Analytics } from '../analytics';
import { Utils } from '../utils';

// 模拟浏览器环境
Object.defineProperty(window, 'location', {
  value: {
    href: 'https://example.com/test',
    pathname: '/test'
  },
  writable: true
});

Object.defineProperty(document, 'title', {
  value: 'Test Page',
  writable: true
});

Object.defineProperty(document, 'referrer', {
  value: 'https://google.com',
  writable: true
});

Object.defineProperty(navigator, 'userAgent', {
  value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  writable: true
});

Object.defineProperty(navigator, 'platform', {
  value: 'Win32',
  writable: true
});

Object.defineProperty(screen, 'width', {
  value: 1920,
  writable: true
});

Object.defineProperty(screen, 'height', {
  value: 1080,
  writable: true
});

// 模拟 localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => store[key] = value.toString(),
    removeItem: (key: string) => delete store[key],
    clear: () => store = {}
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// 模拟 fetch
(window as any).fetch = jest.fn();

describe('Analytics SDK', () => {
  let analytics: Analytics;
  const mockApiEndpoint = 'https://api.example.com/analytics';

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    
    analytics = new Analytics({
      appId: 'test-app',
      apiEndpoint: mockApiEndpoint,
      debug: true,
      batchSize: 1, // 立即发送，方便测试
      flushInterval: 100
    });
  });

  afterEach(() => {
    analytics.destroy();
  });

  describe('Initialization', () => {
    test('should initialize with correct config', () => {
      expect(analytics).toBeInstanceOf(Analytics);
    });

    test('should generate user ID and session ID', () => {
      const userId = localStorage.getItem('analytics_user_id');
      const sessionId = localStorage.getItem('analytics_session_id');
      
      expect(userId).toBeTruthy();
      expect(sessionId).toBeTruthy();
    });
  });

  describe('Utils', () => {
    test('should generate unique IDs', () => {
      const id1 = Utils.generateId();
      const id2 = Utils.generateId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
    });

    test('should generate valid UUID', () => {
      const uuid = Utils.generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      expect(uuidRegex.test(uuid)).toBe(true);
    });

    test('should get device info', () => {
      const deviceInfo = Utils.getDeviceInfo();
      
      expect(deviceInfo).toHaveProperty('platform');
      expect(deviceInfo).toHaveProperty('browser');
      expect(deviceInfo).toHaveProperty('version');
      expect(deviceInfo).toHaveProperty('isMobile');
      expect(deviceInfo).toHaveProperty('screenResolution');
    });

    test('should get page info', () => {
      const pageInfo = Utils.getPageInfo();
      
      expect(pageInfo.url).toBe('https://example.com/test');
      expect(pageInfo.title).toBe('Test Page');
      expect(pageInfo.referrer).toBe('https://google.com');
    });
  });

  describe('Page Tracking', () => {
    test('should track page view', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200
      } as Response);

      analytics.trackPageView();

      // 等待数据发送
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(mockFetch).toHaveBeenCalledWith(
        mockApiEndpoint,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('page_view')
        })
      );
    });

    test('should track custom page view', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200
      } as Response);

      analytics.trackPageView('/custom-page', 'Custom Page');

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(mockFetch).toHaveBeenCalled();
      const callArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(callArgs[1]?.body as string);
      
      expect(requestBody.events[0].data.pageUrl).toBe('/custom-page');
      expect(requestBody.events[0].data.pageTitle).toBe('Custom Page');
    });
  });

  describe('User Action Tracking', () => {
    test('should track user actions', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200
      } as Response);

      analytics.trackAction('click', { button: 'submit' });

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(mockFetch).toHaveBeenCalled();
      const callArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(callArgs[1]?.body as string);
      
      expect(requestBody.events[0].type).toBe('user_action');
      expect(requestBody.events[0].data.actionType).toBe('click');
      expect(requestBody.events[0].data.customData.button).toBe('submit');
    });
  });

  describe('Error Tracking', () => {
    test('should track JavaScript errors', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200
      } as Response);

      const testError = new Error('Test error');
      analytics.trackError(testError);

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(mockFetch).toHaveBeenCalled();
      const callArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(callArgs[1]?.body as string);
      
      expect(requestBody.events[0].type).toBe('error');
      expect(requestBody.events[0].data.message).toBe('Test error');
      expect(requestBody.events[0].data.errorType).toBe('javascript');
    });

    test('should track custom errors', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200
      } as Response);

      analytics.trackError('Custom error message', 'custom');

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(mockFetch).toHaveBeenCalled();
      const callArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(callArgs[1]?.body as string);
      
      expect(requestBody.events[0].data.message).toBe('Custom error message');
      expect(requestBody.events[0].data.errorType).toBe('custom');
    });
  });

  describe('User Management', () => {
    test('should set user ID', () => {
      analytics.setUserId('new-user-123');
      
      const storedUserId = localStorage.getItem('analytics_user_id');
      expect(storedUserId).toBe('new-user-123');
    });

    test('should update user info', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200
      } as Response);

      analytics.setUserInfo({
        customProperties: {
          plan: 'premium',
          vip: true
        }
      });

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('Data Collection', () => {
    test('should flush data immediately', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200
      } as Response);

      analytics.trackAction('custom');
      await analytics.flush();

      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
