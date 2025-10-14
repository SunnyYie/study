// 初始化性能监控器
class PerformanceMonitor {
  constructor() {
    this.results = {}
    this.initObservers()
  }

  // 初始化各种性能观察者
  initObservers() {
    // 1. 监控页面加载关键性能指标
    this.observePageLoad()

    // 2. 监控资源加载性能
    this.observeResources()

    // 3. 监控长任务（Long Tasks）- 检测页面卡顿
    this.observeLongTasks()

    // 4. 监控首次内容绘制等关键渲染指标
    this.observePaintMetrics()
  }

  // 场景1: 监控页面加载性能
  observePageLoad() {
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        this.results[entry.name] = {
          type: entry.entryType,
          startTime: entry.startTime.toFixed(2),
          duration: entry.duration.toFixed(2),
        }

        // 记录关键的页面加载事件
        if (entry.entryType === 'navigation') {
          console.log('页面导航性能:', {
            domContentLoaded: entry.domContentLoadedEventEnd.toFixed(2),
            loadEvent: entry.loadEventEnd.toFixed(2),
            totalDuration: entry.duration.toFixed(2),
          })
        }
      }
      this.updateUI()
    })

    observer.observe({
      entryTypes: ['navigation', 'loadEvent'],
    })
  }

  // 场景2: 监控资源加载性能（脚本、样式、图片等）
  observeResources() {
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        // 只记录我们关心的资源类型
        const interestedTypes = ['script', 'link', 'img', 'fetch', 'xmlhttprequest']
        if (interestedTypes.includes(entry.initiatorType)) {
          const key = `resource_${entry.name}`
          this.results[key] = {
            type: entry.initiatorType,
            name: entry.name,
            startTime: entry.startTime.toFixed(2),
            duration: entry.duration.toFixed(2),
            size: entry.transferSize ? entry.transferSize : 'N/A',
          }

          // 检测资源加载缓慢的情况
          if (entry.duration > 1000) {
            console.warn(`资源加载缓慢: ${entry.name}，耗时: ${entry.duration.toFixed(2)}ms`)
          }
        }
      }
      this.updateUI()
    })

    observer.observe({
      entryTypes: ['resource'],
    })
  }

  // 场景3: 监控长任务（Long Tasks）- 检测页面卡顿
  observeLongTasks() {
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        // 长任务通常指执行时间超过50ms的任务
        const key = `longtask_${Date.now()}`
        this.results[key] = {
          type: 'longtask',
          startTime: entry.startTime.toFixed(2),
          duration: entry.duration.toFixed(2),
        }

        // 记录长任务警告
        console.warn(`检测到长任务: 耗时 ${entry.duration.toFixed(2)}ms`)
      }
      this.updateUI()
    })

    observer.observe({
      entryTypes: ['longtask'],
    })
  }

  // 场景4: 监控首次绘制等渲染指标
  observePaintMetrics() {
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        this.results[entry.name] = {
          type: entry.entryType,
          startTime: entry.startTime.toFixed(2),
          duration: entry.duration.toFixed(2),
        }

        // 记录关键渲染时间点
        console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`)
      }
      this.updateUI()
    })

    observer.observe({
      entryTypes: ['paint'],
    })
  }

  // 场景5: 监控用户交互响应时间
  trackUserInteraction(interactionName) {
    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime

      const key = `interaction_${interactionName}_${Date.now()}`
      this.results[key] = {
        type: 'user-interaction',
        name: interactionName,
        startTime: startTime.toFixed(2),
        duration: duration.toFixed(2),
      }

      console.log(`${interactionName} 响应时间: ${duration.toFixed(2)}ms`)

      // 如果响应时间过长，发出警告
      if (duration > 100) {
        console.warn(`${interactionName} 响应缓慢: ${duration.toFixed(2)}ms`)
      }

      this.updateUI()
    }
  }

  // 更新UI显示性能数据
  updateUI() {
    const container = document.getElementById('performance-results')
    if (!container) return

    // 清空现有内容
    container.innerHTML = ''

    // 按开始时间排序
    const sortedEntries = Object.entries(this.results).sort(
      (a, b) => parseFloat(a[1].startTime) - parseFloat(b[1].startTime),
    )

    // 创建表格
    const table = document.createElement('table')
    table.className = 'min-w-full bg-white border border-gray-200'

    // 表头
    const thead = document.createElement('thead')
    thead.className = 'bg-gray-50'
    thead.innerHTML = `
                    <tr>
                        <th class="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">类型</th>
                        <th class="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">名称</th>
                        <th class="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">开始时间(ms)</th>
                        <th class="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">耗时(ms)</th>
                        <th class="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">状态</th>
                    </tr>
                `
    table.appendChild(thead)

    // 表体
    const tbody = document.createElement('tbody')

    sortedEntries.forEach(([key, entry]) => {
      const row = document.createElement('tr')
      row.className = 'hover:bg-gray-50'

      // 状态指示
      let statusClass = 'text-green-600'
      let statusText = '正常'

      if (entry.type === 'longtask' && parseFloat(entry.duration) > 50) {
        statusClass = 'text-yellow-600'
        statusText = '需要优化'
      }

      if ((entry.type === 'resource' || entry.type === 'user-interaction') && parseFloat(entry.duration) > 1000) {
        statusClass = 'text-red-600'
        statusText = '性能问题'
      }

      row.innerHTML = `
                        <td class="py-2 px-4 border-b text-sm text-gray-600">${this.formatType(entry.type)}</td>
                        <td class="py-2 px-4 border-b text-sm text-gray-600 truncate max-w-xs">${entry.name || key}</td>
                        <td class="py-2 px-4 border-b text-sm text-gray-600">${entry.startTime}</td>
                        <td class="py-2 px-4 border-b text-sm text-gray-600">${entry.duration}</td>
                        <td class="py-2 px-4 border-b text-sm ${statusClass}">${statusText}</td>
                    `
      tbody.appendChild(row)
    })

    table.appendChild(tbody)
    container.appendChild(table)
  }

  // 格式化类型显示
  formatType(type) {
    const typeMap = {
      navigation: '页面导航',
      loadEvent: '加载事件',
      resource: '资源加载',
      longtask: '长任务',
      paint: '绘制事件',
      'user-interaction': '用户交互',
    }
    return typeMap[type] || type
  }
}

// 页面加载完成后初始化监控器
document.addEventListener('DOMContentLoaded', () => {
  // 初始化性能监控
  const perfMonitor = new PerformanceMonitor()

  // 为演示添加一些交互事件监控
  document.getElementById('heavy-operation-btn').addEventListener('click', () => {
    // 记录这个交互的响应时间
    const endTracking = perfMonitor.trackUserInteraction('复杂计算操作')

    // 模拟一个耗时操作
    simulateHeavyOperation().then(() => {
      // 结束计时
      endTracking()
      alert('复杂计算完成！')
    })
  })

  // 模拟图片加载
  document.getElementById('load-image-btn').addEventListener('click', () => {
    const endTracking = perfMonitor.trackUserInteraction('加载大型图片')
    const img = new Image()
    img.src = 'https://picsum.photos/1200/800?random=' + Math.random()
    img.alt = '示例图片'
    img.onload = () => {
      endTracking()
      document.getElementById('image-container').appendChild(img)
    }
  })
})

// 模拟一个耗时的操作（用于演示长任务监控）
function simulateHeavyOperation() {
  return new Promise(resolve => {
    // 使用setTimeout避免完全阻塞UI
    let iterations = 0
    const totalIterations = 10000000

    function process() {
      // 每次处理一部分工作
      const chunk = Math.min(100000, totalIterations - iterations)
      for (let i = 0; i < chunk; i++) {
        // 一些无意义的计算，仅用于消耗CPU
        Math.sqrt(Math.random() * iterations)
        iterations++
      }

      if (iterations < totalIterations) {
        setTimeout(process, 0)
      } else {
        resolve()
      }
    }

    process()
  })
}
