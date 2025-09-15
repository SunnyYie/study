// circular-dependency-demo.js
console.log('=== Node.js 循环引用依赖演示 ===\n')

console.log('1. 开始加载模块...')

// 先加载模块 A，这会触发循环引用
const moduleA = require('./moduleA')

console.log('\n2. 模块加载完成，开始测试功能...')

console.log('\n--- 测试模块 A 的功能 ---')
console.log('moduleA.functionA():', moduleA.functionA())

console.log('\n--- 测试模块 A 调用模块 B ---')
try {
  console.log('moduleA.callB():', moduleA.callB())
} catch (error) {
  console.error('调用出错:', error.message)
}

console.log('\n--- 直接加载模块 B 进行测试 ---')
const moduleB = require('./moduleB')

console.log('\n--- 测试模块 B 的功能 ---')
console.log('moduleB.functionB():', moduleB.functionB())

console.log('\n--- 测试模块 B 调用模块 A ---')
try {
  console.log('moduleB.callA():', moduleB.callA())
} catch (error) {
  console.error('调用出错:', error.message)
}

console.log('\n--- 检查模块 B 中的模块 A 信息 ---')
moduleB.getModuleAInfo()

console.log('\n=== 循环引用演示结束 ===')

// 展示 Node.js 的模块缓存
console.log('\n--- Node.js 模块缓存信息 ---')
console.log(
  '缓存的模块:',
  Object.keys(require.cache).filter(key => key.includes('moduleA') || key.includes('moduleB')),
)
