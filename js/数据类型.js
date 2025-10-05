// 数据类型判断

const func = (obj, funcName) => {
  // 判断是不是对象
  if (typeof obj !== 'object' || obj === null) return false

  // 获取原型
  let proto = Object.getPrototypeOf(obj)

  while (proto !== null) {
    if (proto === funcName.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }

  return false
}

console.log(func([], Array)) // true