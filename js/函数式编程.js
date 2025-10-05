// curry
const curry = fn => {
  let len = fn.length
  return function curried(...args) {
    if (args.length >= len) {
      return fn.apply(this, args)
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2))
      }
    }
  }
}

function add(a, b, c) {
  return a + b + c
}

const curriedAdd = curry(add)
console.log(curriedAdd(1)(2)(3)) // 6
console.log(curriedAdd(1, 2)(3)) // 6

// 浅拷贝
const arrayShallowClone = obj => {
  if (typeof obj !== 'object' || obj === null) return obj
  const newObj = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}
const obj = { a: 1, b: { c: 2 } }
const newObj = arrayShallowClone(obj)
newObj.b.c = 3
console.log(obj.b.c) // 3

// 深拷贝
const arrayDeepClone = (obj, weakMap = new WeakMap()) => {
  if (typeof obj !== 'object' || obj === null) return obj
  if (weakMap.has(obj)) return weakMap.get(obj)
  // 判断是否是Date
  if (obj instanceof Date) return new Date(obj)
  // 判断是否是RegExp
  if (obj instanceof RegExp) return new RegExp(obj)

  const newObj = Array.isArray(obj) ? [] : {}
  weakMap.set(obj, newObj)
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      newObj[key] = arrayDeepClone(obj[key], weakMap)
    }
  }
  return newObj
}

const obj2 = { a: 1, b: { c: 2 } }
const newObj2 = arrayDeepClone(obj2)
newObj2.b.c = 3
console.log(obj2.b.c) // 2

// 防抖
const debounce = (func, wait) => {
  let timeout
  return function (...args) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

// 节流
const throttle = (func, wait) => {
  let lastTime = 0
  return function (...args) {
    const context = this
    const now = Date.now()
    if (now - lastTime >= wait) {
      lastTime = now
      func.apply(context, args)
    }
  }
}

// sleep
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// delay
function delay(func, seconds, ...args) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(func(...args))
    }, seconds)
  })
}

async function test() {
  // 在 3s 之后返回 hello, world
  await delay(
    str => {
      console.log(str)
    },
    3000,
    'hello, world',
  )
}
test()

// 深比较
const deepEqual = (key1, key2) => {
  if (key1 === key2) return true
  if (typeof key1 !== 'object' || typeof key2 !== 'object' || key1 === null || key2 === null) return false
  const keys1 = Object.keys(key1)
  const keys2 = Object.keys(key2)
  if (keys1.length !== keys2.length) return false
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(key1[key], key2[key])) return false
  }
  return true
}

// compose
const compose = (...fns) => {
  return function (initialValue) {
    return fns.reduce((acc, fn) => fn(acc), initialValue)
  }
}
// 示例
const add1 = x => x + 1
const multiply2 = x => x * 2
const subtract3 = x => x - 3
const composedFunction = compose(add1, multiply2, subtract3)
console.log(composedFunction(5)) // (5 + 1) * 2 - 3 = 9
