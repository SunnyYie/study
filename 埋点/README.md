# Analytics SDK

一个轻量级的前端埋点SDK，用于收集用户行为数据和页面访问统计。

## 功能特性

- ✅ **PV/UV统计** - 页面访问量和独立用户统计
- ✅ **用户追踪** - 记录用户信息和设备信息
- ✅ **页面访问记录** - 记录用户访问的页面和停留时间
- ✅ **用户操作追踪** - 自动追踪点击、滚动等用户操作
- ✅ **API调用监控** - 自动拦截和记录网络请求
- ✅ **错误监控** - 捕获JavaScript错误和资源加载错误
- ✅ **数据批量上报** - 支持批量发送和自动刷新
- ✅ **会话管理** - 自动管理用户会话

## 安装

```bash
npm install analytics-sdk
```

## 快速开始

### 基础用法

```javascript
import Analytics from 'analytics-sdk';

// 初始化SDK
const analytics = new Analytics({
  appId: 'your-app-id',
  apiEndpoint: 'https://your-api-endpoint.com/analytics',
  debug: true // 开发环境下启用调试
});

// 手动追踪页面访问
analytics.trackPageView();

// 追踪用户操作
analytics.trackAction('custom', { 
  feature: 'search',
  keyword: 'analytics'
});

// 追踪错误
analytics.trackError(new Error('Something went wrong'));
```

### 高级配置

```javascript
const analytics = new Analytics({
  appId: 'your-app-id',
  apiEndpoint: 'https://your-api-endpoint.com/analytics',
  
  // 功能开关
  enablePV: true,              // 启用页面访问追踪
  enableUserTracking: true,    // 启用用户信息追踪
  enableClickTracking: true,   // 启用点击自动追踪
  enableApiTracking: true,     // 启用API调用追踪
  enableErrorTracking: true,   // 启用错误追踪
  
  // 数据上报配置
  batchSize: 10,               // 批量发送大小
  flushInterval: 5000,         // 自动发送间隔（毫秒）
  
  // 用户信息
  userId: 'user-123',          // 自定义用户ID
  customUserInfo: {            // 自定义用户属性
    vip: true,
    plan: 'premium'
  },
  
  debug: false                 // 调试模式
});
```

## API 文档

### 初始化配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `appId` | string | - | 必填，应用ID |
| `apiEndpoint` | string | - | 必填，数据上报接口地址 |
| `enablePV` | boolean | true | 是否启用页面访问追踪 |
| `enableUserTracking` | boolean | true | 是否启用用户信息追踪 |
| `enableClickTracking` | boolean | true | 是否启用点击自动追踪 |
| `enableApiTracking` | boolean | true | 是否启用API调用追踪 |
| `enableErrorTracking` | boolean | true | 是否启用错误追踪 |
| `batchSize` | number | 10 | 批量发送数据条数 |
| `flushInterval` | number | 5000 | 自动发送间隔（毫秒） |
| `userId` | string | auto | 用户ID，不提供时自动生成 |
| `customUserInfo` | object | {} | 自定义用户属性 |
| `debug` | boolean | false | 是否启用调试模式 |

### 方法

#### trackPageView(pageUrl?, pageTitle?)
手动追踪页面访问

```javascript
// 追踪当前页面
analytics.trackPageView();

// 追踪指定页面
analytics.trackPageView('/custom-page', 'Custom Page Title');
```

#### trackAction(actionType, customData?)
追踪用户操作

```javascript
analytics.trackAction('click', { button: 'submit' });
analytics.trackAction('scroll', { position: 100 });
analytics.trackAction('custom', { feature: 'search' });
```

#### trackClick(element, customData?)
手动追踪点击事件

```javascript
const button = document.getElementById('submit-btn');
analytics.trackClick(button, { form: 'login' });
```

#### trackApiCall(apiData)
手动追踪API调用

```javascript
analytics.trackApiCall({
  url: '/api/users',
  method: 'POST',
  status: 200,
  duration: 150
});
```

#### trackError(error, errorType?)
追踪错误

```javascript
// 追踪JavaScript错误
analytics.trackError(new Error('Something went wrong'));

// 追踪自定义错误
analytics.trackError('Custom error message', 'custom');
```

#### setUserId(userId)
设置用户ID

```javascript
analytics.setUserId('new-user-id');
```

#### setUserInfo(userInfo)
更新用户信息

```javascript
analytics.setUserInfo({
  customProperties: {
    plan: 'premium',
    vip: true
  }
});
```

#### flush()
立即发送所有缓存的数据

```javascript
await analytics.flush();
```

#### destroy()
销毁SDK实例

```javascript
analytics.destroy();
```

## 数据格式

### 页面访问数据

```javascript
{
  type: 'page_view',
  data: {
    pageUrl: 'https://example.com/page',
    pageTitle: 'Page Title',
    referrer: 'https://google.com',
    timestamp: 1633024800000,
    duration: 30000, // 页面停留时间（毫秒）
    userId: 'user-123',
    sessionId: 'session-456'
  }
}
```

### 用户操作数据

```javascript
{
  type: 'user_action',
  data: {
    actionType: 'click',
    element: '#submit-btn',
    elementText: 'Submit',
    pageUrl: 'https://example.com/page',
    timestamp: 1633024800000,
    userId: 'user-123',
    sessionId: 'session-456',
    customData: { form: 'login' }
  }
}
```

### API调用数据

```javascript
{
  type: 'api_call',
  data: {
    url: '/api/users',
    method: 'POST',
    status: 200,
    duration: 150,
    timestamp: 1633024800000,
    userId: 'user-123',
    sessionId: 'session-456',
    requestSize: 1024,
    responseSize: 2048
  }
}
```

### 用户信息数据

```javascript
{
  type: 'user_info',
  data: {
    userId: 'user-123',
    sessionId: 'session-456',
    userAgent: 'Mozilla/5.0...',
    deviceInfo: {
      platform: 'Win32',
      browser: 'Chrome',
      version: '91',
      isMobile: false,
      screenResolution: '1920x1080'
    },
    customProperties: {
      plan: 'premium',
      vip: true
    }
  }
}
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 16+

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 运行测试
npm test

# 代码检查
npm run lint
```

## 许可证

MIT
