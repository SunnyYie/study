const { exec } = require('child_process')

exec('pngquant 11.8kb.png --output compressed.png --quality=65-80', (error, stdout, stderr) => {
  if (error) {
    console.error(`执行出错: ${error}`)
    return
  }
})
