const obj = {
  user: {
    name: '张三',
    age: 18,
  },
}

const produce = (base, fn) => {
  const modified = {}
  const handler = {
    get(target, prop) {
      if (prop in modified) {
        return modified[prop]
      }
      if (typeof target[prop] === 'object' && target[prop] !== null) {
        return new Proxy(target[prop], handler)
      }
      return Reflect.get(target, prop)
    },
    set(target, prop, value) {
      return Reflect.set(modified, prop, value)
    },
  }

  const proxy = new Proxy(base, handler)

  fn(proxy)

  if (Object.keys(modified).length === 0) {
    return base
  }
  return JSON.parse(JSON.stringify(proxy))
}

const newObj = produce(obj, draft => {
  draft.user.name = '李四'
  draft.user.age = '20'
})

console.log(obj, newObj, newObj.user.age)
