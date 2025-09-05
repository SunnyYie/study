// 任务优先级
const ImmediatePriority = 1
const UserBlockingPriority = 2
const NormalPriority = 3
const LowPriority = 4
const IdlePriority = 5

class Scheduler {
  constructor() {
    this.taskQueue = [] // 任务队列
    this.isPerformingWork = false // 是否正在执行任务
    const channel = new MessageChannel()
    this.port = channel.port2
    channel.port1.onmessage = this.performWork.bind(this)
  }

  /**
   *
   * @param {优先级} priority
   * @param {*} callback
   */
  scheduleCallback(priority, callback) {
    const curTime = performance.now()
    let timeOut
    switch (priority) {
      case ImmediatePriority:
        timeOut = -1
        break
      case UserBlockingPriority:
        timeOut = 250
        break
      case NormalPriority:
        timeOut = 5000
        break
      case LowPriority:
        timeOut = 10000
        break
      case IdlePriority:
        timeOut = 1000000
        break
    }
    const task = {
      callback,
      priority,
      startTime: curTime,
      expirationTime: curTime + timeOut,
    }
    this.taskQueue.push(task)
    this.taskQueue.sort((a, b) => a.expirationTime - b.expirationTime)

    this.port.postMessage({ timeOut })
  }

  performWork() {
    if (this.isPerformingWork) return
    this.isPerformingWork = true
    let currentTask = this.taskQueue.shift()
    while (currentTask) {
      const callback = currentTask.callback
      currentTask.callback = null
      const continuationCallback = callback()
      if (continuationCallback) {
        currentTask.callback = continuationCallback
        this.taskQueue.unshift(currentTask)
      }
      currentTask = this.taskQueue.shift()
    }
    this.isPerformingWork = false
  }
}

const scheduler = new Scheduler()
scheduler.scheduleCallback(NormalPriority, () => {
  console.log('普通优先级任务')
})
scheduler.scheduleCallback(ImmediatePriority, () => {
  console.log('立即执行的任务')
})
