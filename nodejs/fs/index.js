const fs = require('fs')

// 异步读取文件内容
fs.readFile('test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err)
    return
  }
  console.log('File contents:', data)
})

// 同步读取文件内容
const data = fs.readFileSync('test.txt', 'utf8')
console.log('File contents:', data)

// 使用 promises 方式读取文件内容
const fs2 = require('fs/promises')
fs2
  .readFile('test.txt', 'utf8')
  .then(data => {
    console.log('File contents:', data)
  })
  .catch(err => {
    console.error('Error reading file:', err)
  })

// 使用流式读取文件内容（处理大文件）
const readStream = fs.createReadStream('test.txt', 'utf8')
readStream.on('data', chunk => {
  console.log('File contents:', chunk, '...')
})
readStream.on('end', () => {
  console.log('Finished reading file')
})

// 创建文件夹
// recursive: true 递归创建多级目录
fs.mkdir('newDir/subDir/test', { recursive: true }, err => {
  if (err) {
    console.error('Error creating directory:', err)
    return
  }
  console.log('Directory created successfully')
})
fs.mkdirSync('newDirSync', { recursive: true })

// 删除文件夹
fs.rmdir('newDir', err => {
  if (err) {
    console.error('Error removing directory:', err)
    return
  }
  console.log('Directory removed successfully')
})
fs.rmdirSync('newDirSync')

// 监听文件变化
fs.watch('test.txt', (eventType, filename) => {
  console.log(`File ${filename} changed: ${eventType}`)
})
