// moduleA.js
console.log('模块 A 开始加载...')

// 引入模块 B，这里会形成循环引用
const moduleB = require('./moduleB')

function functionA() {
  console.log('执行 functionA')
  return 'A 的结果'
}

function callB() {
  console.log('A 调用 B 的函数')
  return moduleB.functionB()
}

// 导出函数
module.exports = {
  functionA,
  callB,
  name: 'Module A',
}

console.log('模块 A 加载完成')
