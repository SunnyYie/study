const util = require('util')
const { exec } = require('child_process')

// 将 exec 函数转换为返回 Promise 的版本
const execPromise = util.promisify(exec)

execPromise('node -v')
  .then(({ stdout, stderr }) => {
    console.log('标准输出:', stdout)
  })
  .catch(error => {
    console.error('执行出错:', error)
  })

const promisify = fn => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, ...results) => {
        if (err) {
          return reject(err)
        }
        resolve(results.length > 1 ? results : results[0])
      })
    })
  }
}

util.format('Hello, %s! You have %d new messages.', 'Alice', 5)
