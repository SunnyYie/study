// 决议过程：处理Promise的状态转换（核心逻辑，遵循Promise/A+规范2.3）
function resolvePromise(promise, x, resolve, reject) {
  // 若x与当前promise是同一个对象，直接拒绝（防止循环引用）
  if (promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }

  // 若x是当前实现的Promise实例
  if (x instanceof Promise) {
    // 等待x的状态改变，用其结果决议当前promise
    x.then(
      value => resolvePromise(promise, value, resolve, reject),
      reason => reject(reason),
    )
    return
  }

  // 若x是对象或函数（可能是thenable）
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let then
    try {
      then = x.then // 尝试获取x的then方法
    } catch (e) {
      // 获取then失败，直接拒绝
      return reject(e)
    }

    // 若then是函数（认定为thenable）
    if (typeof then === 'function') {
      let called = false // 防止then方法多次调用resolve/reject
      try {
        then.call(
          x, // 以x为this调用then
          y => {
            // then的onFulfilled回调
            if (called) return
            called = true
            resolvePromise(promise, y, resolve, reject) // 递归处理y
          },
          r => {
            // then的onRejected回调
            if (called) return
            called = true
            reject(r) // 直接拒绝
          },
        )
      } catch (e) {
        if (called) return
        called = true
        reject(e) // 执行then时出错，直接拒绝
      }
    } else {
      // then不是函数，直接以x为值完成
      resolve(x)
    }
  } else {
    // x是基本类型，直接以x为值完成
    resolve(x)
  }
}

function MyPromise(executor) {
  this.status = 'pending' // 状态：pending/fulfilled/rejected（初始为pending）
  this.value = undefined // fulfilled状态的结果值
  this.reason = undefined // rejected状态的原因
  this.onFulfilledCallbacks = [] // 存储fulfilled状态的回调（状态未改变时）
  this.onRejectedCallbacks = [] // 存储rejected状态的回调（状态未改变时）

  // 内部实现：将状态改为fulfilled并执行回调
  const fulfill = value => {
    if (this.status === 'pending') {
      this.status = 'fulfilled'
      this.value = value
      // 异步执行所有存储的fulfilled回调（微任务）
      this.onFulfilledCallbacks.forEach(cb => queueMicrotask(cb))
    }
  }

  // 内部实现：将状态改为rejected并执行回调
  const reject = reason => {
    if (this.status === 'pending') {
      this.status = 'rejected'
      this.reason = reason
      // 异步执行所有存储的rejected回调（微任务）
      this.onRejectedCallbacks.forEach(cb => queueMicrotask(cb))
    }
  }

  // 供executor调用的resolve方法（触发决议过程）
  const resolve = value => {
    resolvePromise(this, value, fulfill, reject)
  }

  // 立即执行executor，捕获执行中的错误
  try {
    executor(resolve, reject)
  } catch (e) {
    reject(e) // 执行出错直接拒绝
  }
}

// then方法（核心API，返回新Promise支持链式调用）
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // 处理非函数参数（忽略，透传值/抛出错误）
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : reason => {
          throw reason
        }

  // 返回新的Promise（then的返回值）
  const promise2 = new MyPromise((resolve, reject) => {
    // 状态为fulfilled时：异步执行onFulfilled
    if (this.status === 'fulfilled') {
      queueMicrotask(() => {
        try {
          const x = onFulfilled(this.value) // 执行回调获取结果
          resolvePromise(promise2, x, resolve, reject) // 决议新Promise
        } catch (e) {
          reject(e) // 回调执行出错，直接拒绝新Promise
        }
      })
    }

    // 状态为rejected时：异步执行onRejected
    if (this.status === 'rejected') {
      queueMicrotask(() => {
        try {
          const x = onRejected(this.reason) // 执行回调获取结果
          resolvePromise(promise2, x, resolve, reject) // 决议新Promise
        } catch (e) {
          reject(e) // 回调执行出错，直接拒绝新Promise
        }
      })
    }

    // 状态为pending时：存储回调（等待状态改变后执行）
    if (this.status === 'pending') {
      this.onFulfilledCallbacks.push(() => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      })

      this.onRejectedCallbacks.push(() => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      })
    }
  })

  return promise2
}

// 静态方法：Promise.resolve（返回一个以value为结果的fulfilled状态Promise）
Promise.resolve = function (value) {
  // 若value是当前Promise实例，直接返回
  if (value instanceof Promise) {
    return value
  }
  // 否则返回新Promise，用value决议
  return new Promise(resolve => resolve(value))
}

// 静态方法：Promise.reject（返回一个以reason为原因的rejected状态Promise）
Promise.reject = function (reason) {
  return new Promise((_, reject) => reject(reason))
}

Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

Promise.prototype.finally = function (callback) {
  return this.then(
    value => {
      return Promise.resolve(callback()).then(() => value)
    },
    reason => {
      return Promise.resolve(callback()).then(() => {
        throw reason
      })
    },
  )
}

Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    const results = []
    let completed = 0
    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then(value => {
          results[index] = value
          completed++
          if (completed === promises.length) {
            resolve(results)
          }
        })
        .catch(reject)
    })
  })
}

Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => {
      Promise.resolve(p).then(resolve, reject)
    })
  })
}

// Promise.allSettled
Promise.allSettled = function (promises) {
  return new Promise(resolve => {
    const results = []
    let completed = 0
    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then(value => {
          results[index] = { status: 'fulfilled', value }
        })
        .catch(reason => {
          results[index] = { status: 'rejected', reason }
        })
        .finally(() => {
          completed++
          if (completed === promises.length) {
            resolve(results)
          }
        })
    })
  })
}

Promise.any = function (promises) {
  return new Promise((resolve, reject) => {
    const errors = []
    let rejectedCount = 0
    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then(value => {
          resolve(value)
        })
        .catch(reason => {
          errors[index] = reason
          rejectedCount++
          if (rejectedCount === promises.length) {
            reject(new AggregateError(errors, 'All promises were rejected'))
          }
        })
    })
  })
}
function multiRequestLimitNum(reqArr, limitNum) {
  return new Promise((resolve, reject) => {
    let curIndex = 0,
      result = [],
      inProgressCount = 0
    const run = () => {
      if (curIndex >= reqArr.length && inProgressCount === 0) {
        resolve(result)
        return
      }
      while (inProgressCount <= limitNum && curIndex < reqArr.length) {
        const index = curIndex
        const curItem = reqArr[index]
        curIndex++
        inProgressCount++
        curItem()
          .then(res => {
            result[index] = res
          })
          .finally(() => {
            inProgressCount--
            run()
          })
      }
    }
    run()
  })
}

const reqArr = [
  () => new Promise(res => setTimeout(() => res(1), 3000)),
  () => new Promise(res => setTimeout(() => res(2), 2000)),
  () => new Promise(res => setTimeout(() => res(3), 1000)),
  () => new Promise(res => setTimeout(() => res(4), 4000)),
  () => new Promise(res => setTimeout(() => res(5), 500)),
]
multiRequestLimitNum(reqArr, 2).then(res => {
  console.log(res) // [1,2,3,4,5]
})

// 手写带并发限制的 Promise 调度器
class Scheduler {
  constructor(limit) {
    this.limit = limit // 最大并发数
    this.queue = [] // 任务队列
    this.activeCount = 0 // 当前活跃的任务数
  }

  add(task) {
    this.queue.push(task)
  }

  run() {
    while (this.activeCount < this.limit && this.queue.length) {
      const task = this.queue.shift()
      this.activeCount++
      task().then(() => {
        this.activeCount--
        this.run() // 任务完成后继续执行下一个任务
      })
    }
  }
}

const scheduler = new Scheduler(2) // 最多同时运行2个任务
const addTask = (time, value) => {
  scheduler.add(
    () =>
      new Promise(resolve => {
        setTimeout(() => {
          console.log(value)
          resolve()
        }, time)
      }),
  )
}
addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
scheduler.run()
// 输出结果: 2 3 1 4
// 解释: 2 和 3 最先被执行，然后是 1，最后是 4

// async await
function handleAwait(promise) {
  return promise.then(result => {
    // 如果结果是一个Promise，继续处理
    if (result instanceof Promise) {
      return handleAwait(result)
    }
    // 如果结果是一个生成器，执行它
    if (typeof result.next === 'function') {
      return executeGenerator(result)
    }
    return result
  })
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
