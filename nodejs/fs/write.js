const fs = require('fs')

// 异步写入文件内容
fs.writeFile('output.txt', 'Hello, World!', err => {
  if (err) {
    console.error('Error writing file:', err)
    return
  }
  console.log('File written successfully')
})

// 同步写入文件内容
try {
  fs.writeFileSync('outputSync.txt', 'Hello, Sync World!')
  console.log('File written successfully')
} catch (err) {
  console.error('Error writing file:', err)
}

// 追加写入文件内容
fs.appendFile('output.txt', '\nAppended content.', err => {
  if (err) {
    console.error('Error appending to file:', err)
    return
  }
  console.log('Content appended successfully')
})
fs.appendFileSync('outputSync.txt', '\nAppended sync content.')

// 流式写入
let verse = ['待到秋来九月八', '我花开后百花杀', '冲天香阵透长安', '满城尽带黄金甲']

let writeStream = fs.createWriteStream('index.txt')
verse.forEach(line => {
  writeStream.write(line + '\n', 'utf8')
})

writeStream.end() // 标记文件末尾
writeStream.on('finish', () => {
  console.log('Write stream finished.')
})
