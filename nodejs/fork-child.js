const { fork } = require('child_process')
const path = require('path')

process.on('message', msg => {
  console.log('子进程收到消息:', msg)
  // 回复父进程
  process.send({ foo: 'bar' })
})

// 模拟一些异步操作
setTimeout(() => {
  console.log('子进程完成任务，准备退出')
  process.exit(0)
}, 3000)
