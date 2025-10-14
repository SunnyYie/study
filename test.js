function DeepClone(obj, weakMap = new WeakMap()) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (weakMap.get(obj)) {
    return weakMap.get(obj)
  }

  if (obj instanceof Date) {
    return new Date(obj)
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj)
  }

  let newObj = Array.isArray(obj) ? [] : {}
  weakMap.set(obj, newObj)

  for (let key in obj) {
    if (Object.getOwnPropertyNames.call(obj, key)) {
      newObj[key] = DeepClone(obj[key], weakMap)
    }
  }

  return newObj
}

const obj = {
  a: 1,
  b: [1, 2],
  c: {
    d: 4,
  },
}

const obj2 = DeepClone(obj)
console.log(obj2);

