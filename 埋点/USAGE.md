# 前端埋点 SDK 使用示例

## 基本使用

在你的项目的 `main.ts` 文件中进行初始化：

```typescript
import { init } from 'analytics-sdk'

// 初始化SDK
init({
  appId: 'your-app-id', // 必填：你的应用ID
  userId: 'user-123', // 必填：当前用户ID
  reportUrl: 'https://your-api.com/analytics', // 可选：数据上报接口
  reportInterval: 10000, // 可选：自动上报间隔(毫秒)，默认5000
  debug: true, // 可选：开启调试模式，默认false
})
```

## 自动功能

SDK 初始化后会自动：

1. **记录用户访问（UV）**：每天每个用户只记录一次
2. **记录页面访问（PV）**：每次页面访问都会记录
3. **监听路由变化**：支持 SPA 应用的路由切换
4. **定时上报数据**：按设定间隔自动上报数据
5. **页面卸载时上报**：确保数据不丢失
6. **用户切换检测**：自动处理用户登录切换，清理上一用户数据

## 手动操作

```typescript
import { trackPageView, report, destroy } from 'analytics-sdk'

// 手动记录页面访问
trackPageView()

// 手动记录指定页面
trackPageView('/custom-page', 'Custom Page Title')

// 手动上报数据
const success = await report()
console.log('上报结果:', success)

// 销毁SDK（通常在应用卸载时）
destroy()
```

## 数据格式

### 页面访问数据（PV）

```typescript
{
  appId: string // 应用ID
  userId: string // 用户ID
  url: string // 页面URL
  title: string // 页面标题
  timestamp: number // 访问时间戳
  userAgent: string // 用户代理
  referrer: string // 来源页面
}
```

### 用户访问数据（UV）

```typescript
{
  appId: string // 应用ID
  userId: string // 用户ID
  timestamp: number // 访问时间戳
  userAgent: string // 用户代理
  sessionId: string // 会话ID
}
```

### 上报数据格式

```typescript
{
  pageViews: PageViewData[];  // 页面访问数据数组
  userVisits: UserVisitData[]; // 用户访问数据数组
}
```

## 服务端接口

你的后端需要提供一个接收埋点数据的接口：

```javascript
// Express.js 示例
app.post('/api/analytics', (req, res) => {
  const { pageViews, userVisits } = req.body

  // 处理页面访问数据
  if (pageViews && pageViews.length > 0) {
    // 保存PV数据到数据库
    console.log('收到PV数据:', pageViews.length, '条')
  }

  // 处理用户访问数据
  if (userVisits && userVisits.length > 0) {
    // 保存UV数据到数据库
    console.log('收到UV数据:', userVisits.length, '条')
  }

  res.json({ success: true })
})
```

## 特性

- 🚀 **轻量级**：打包后体积小，不影响页面性能
- 📱 **支持 SPA**：自动监听路由变化，支持 Vue/React 等 SPA 应用
- 💾 **本地存储**：数据先存储在本地，定时批量上报
- 🔄 **自动重试**：网络失败时自动重试上报
- 🎯 **精准去重**：UV 数据按天去重，避免重复统计
- 🛡️ **可靠上报**：页面卸载时确保数据上报
- 🐛 **调试模式**：开发环境可开启调试日志

## 注意事项

1. **初始化时机**：请在应用启动时尽早调用 `init()` 方法
2. **用户 ID**：确保传入有效的用户 ID，这是数据统计的关键
3. **接口地址**：确保上报接口地址正确且支持 CORS
4. **数据安全**：建议在生产环境关闭 debug 模式
