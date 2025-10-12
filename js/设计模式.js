// 发布订阅
class EventEmitter {
  constructor() {
    this.events = {}
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(listener)
  }

  off(event, listener) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(l => l != listener)
  }

  emit(event, ...args) {
    if (!this.events[event]) return
    this.events[event].forEach(listener => {
      listener.apply(this, args)
    })
  }

  once(event, listener) {
    const onceWrapper = (...args) => {
      listener.apply(this, args)
      this.off(event, onceWrapper)
    }
    this.on(event, onceWrapper)
  }
}

const eventEmitter = new EventEmitter()
eventEmitter.on('message', msg => {
  console.log('收到消息：' + msg)
})

eventEmitter.emit('message', 'Hello World!') // 收到消息：Hello World!

eventEmitter.once('onceEvent', msg => {
  console.log('收到一次性消息：' + msg)
})
eventEmitter.emit('onceEvent', 'Hello Once!') // 收到一次性消息：Hello Once!
eventEmitter.emit('onceEvent', 'Hello Once Again!') // 无输出

// LRU缓存
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.cache = new Map()
  }

  get(key) {
    if (!this.cache.has(key)) return -1
    const value = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }
    this.cache.set(key, value)
    if (this.cache.size > this.capacity) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }
  }
}

const lru = new LRUCache(2)
lru.put(1, 1)
lru.put(2, 2)
lru.get(1) // 返回 1
lru.put(3, 3) // 该操作会使得 key 2 被淘汰
lru.get(2) // 返回 -1 (未找到)
lru.put(4, 4) // 该操作会使得 key 1 被淘汰
lru.get(1) // 返回 -1 (未找到)
lru.get(3) // 返回 3
lru.get(4) // 返回 4

// 观察者模式
const observe = (obj, callback) => {
  return new Proxy(obj, {
    set(target, property, value) {
      target[property] = value
      callback(property, value)
      return true
    },
  })
}

const person = observe({ name: 'Alice', age: 25 }, (prop, val) => {
  console.log(`属性 ${prop} 改变为 ${val}`)
})

person.name = 'Bob' // 属性 name 改变为 Bob
person.age = 26 // 属性 age 改变为 26