// promise
class MyPromise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    try {
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error)
    }
  }

  resolve(value) {
    if (this.state === 'pending') {
      this.state = 'fulfilled'
      this.value = value
      this.onResolvedCallbacks.forEach(fn => fn(value))
    }
  }

  reject(reason) {
    if (this.state === 'pending') {
      this.state = 'rejected'
      this.reason = reason
      this.onRejectedCallbacks.forEach(fn => fn(reason))
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : reason => {
            throw reason
          }

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            this.resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      } else if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            this.resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      } else if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              this.resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              this.resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
      }
    })
  }

  all(promises) {
    return new MyPromise((resolve, reject) => {
      let result = []
      let count = 0
      promises.forEach((p, index) => {
        MyPromise.resolve(p)
          .then(value => {
            result[index] = value
            count++
            if (count === promises.length) {
              resolve(result)
            }
          })
          .catch(reject)
      })
    })
  }

  allSettled(promises) {
    return new MyPromise((resolve, reject) => {
      let result = []
      let count = 0
      promises.forEach((p, index) => {
        MyPromise.resolve(p)
          .then(value => {
            result[index] = { status: 'fulfilled', value }
            count++
            if (count === promises.length) {
              resolve(result)
            }
          })
          .catch(reason => {
            result[index] = { status: 'rejected', reason }
            count++
            if (count === promises.length) {
              resolve(result)
            }
          })
      })
    })
  }

  race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(p => {
        MyPromise.resolve(p).then(resolve).catch(reject)
      })
    })
  }

  // 状态为成功或失败都继续,如果全部失败则抛出错误
  any(promises) {
    return new MyPromise((resolve, reject) => {
      let reasons = []
      let count = 0
      promises.forEach((p, index) => {
        MyPromise.resolve(p)
          .then(value => {
            resolve(value)
          })
          .catch(reason => {
            reasons[index] = reason
            count++
            if (count === promises.length) {
              reject(new AggregateError(reasons, 'All promises were rejected'))
            }
          })
      })
    })
  }
}

// Promise.resolve
MyPromise.resolve = function (value) {
  if (value instanceof MyPromise) {
    return value
  } else if (value && typeof value === 'object' && typeof value.then === 'function') {
    return new MyPromise((resolve, reject) => {
      value.then(resolve, reject)
    })
  } else {
    return new MyPromise(resolve => resolve(value))
  }
}
// Promise.reject
MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason)
  })
}

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
