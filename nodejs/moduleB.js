// moduleB.js
console.log('模块 B 开始加载...')

// 引入模块 A，与 moduleA.js 形成循环引用
const moduleA = require('./moduleA')

function functionB() {
  console.log('执行 functionB')
  return 'B 的结果'
}

function callA() {
  console.log('B 调用 A 的函数')
  // 注意：这里可能会有问题，因为 moduleA 可能还没有完全加载
  if (moduleA && moduleA.functionA) {
    return moduleA.functionA()
  } else {
    console.log('警告：moduleA 还没有完全加载')
    return 'moduleA 未完全加载'
  }
}

function getModuleAInfo() {
  console.log('获取模块 A 的信息:')
  console.log('moduleA 是否存在:', !!moduleA)
  console.log('moduleA 的内容:', moduleA)
  return moduleA
}

// 导出函数
module.exports = {
  functionB,
  callA,
  getModuleAInfo,
  name: 'Module B',
}

console.log('模块 B 加载完成')
