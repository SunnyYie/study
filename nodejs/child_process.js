const child_process = require('child_process')
const path = require('path')

// 执行shell命令
child_process.exec('node -v', (error, stdout, stderr) => {
  if (error) {
    console.error(`执行出错: ${error}`)
    return
  }
  console.log(`标准输出:\n${stdout}`)
  if (stderr) {
    console.error(`标准错误:\n${stderr}`)
  }
})

// 同步执行shell命令
console.log(child_process.execSync('node -v').toString())

// 使用spawn执行命令
const ls = child_process.spawn('netstat')
ls.stdout.on('data', data => {
  console.log(`输出: ${data.toString()}`)
})

ls.stderr.on('data', data => {
  console.error(`错误: ${data.toString()}`)
})
ls.on('close', code => {
  console.log(`子进程退出，退出码 ${code}`)
})

child_process.execFile(
  path.resolve(__dirname, './bat.cmd'),
  null,
  {
    shell: true,
  },
  (error, stdout) => {
    if (error) {
      console.error(`执行出错: ${error}`)
      return
    }
    console.log(`标准输出:\n${stdout}`)
  },
)

// fork
const fork = child_process.fork(path.resolve(__dirname, './fork-child.js'))
fork.on('message', msg => {
  console.log('父进程收到消息:', msg)
})
fork.send({ hello: 'world' })