// promise

// Promise.prototype.then

// promise.all

// 手写带并发限制的 Promise 调度器
const scheduler = new Scheduler(2) // 最多同时运行2个任务
const addTask = (time, value) => {
  scheduler.add(() => new Promise(resolve => setTimeout(resolve, time, value)))
}
addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
// 输出结果: 2 3 1 4
// 解释: 2 和 3 最先被执行，然后是 1，最后是 4
