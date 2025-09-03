import analyticsSDK from '../src/index'

// 初始化SDK
analyticsSDK.init({
  // 可以传入一些配置参数
  debug: true,
})

// 示例：手动记录页面访问
document.getElementById('trackButton').addEventListener('click', function () {
  // 记录PV
  analyticsSDK.trackPV()

  // 记录UV
  analyticsSDK.trackUV()

  // 记录页面访问
  analyticsSDK.trackPageVisit('button-click-page')

  // 获取当前指标
  const metrics = analyticsSDK.getMetrics()
  console.log('当前指标:', metrics)
})
