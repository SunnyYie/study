const process = require('process')

console.log('=== Node.js 进程信息演示 ===\n')
console.log('1. 获取当前工作目录:', process.cwd())
console.log('2. 获取 Node.js 版本:', process.version)
console.log('3. 获取操作系统平台:', process.platform)
console.log('4. 获取进程 ID:', process.pid)
console.log('5. 获取内存使用情况:', process.memoryUsage())
// {
//   rss: 30892032, // 驻留集大小，进程占用的总内存
//   heapTotal: 5828608, // V8 引擎分配的堆内存总量
//   heapUsed: 4499360, // V8 引擎实际使用的堆内存
//   external: 1547994, // C++ 对象占用的内存
//   arrayBuffers: 10515 // ArrayBuffer 和 SharedArrayBuffer 占用的内存
// }

// 可以修改，只在当前进程有效
// console.log('6. 获取环境变量:', process.env)

console.log('7. 获取命令行参数:', process.argv)
// [
//   'D:\\nodejs\\node.exe',
//   'D:\\Web\\project\\studyroad-now\\nodejs\\process.js'
// ]

process.on('exit', (code) => {
  console.log(`\n8. 进程即将退出，退出码: ${code}`)
})