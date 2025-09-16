// 1.将文件切片
const file = document.getElementById('file')
file.addEventListener('change', event => {
  const file = event.target.files[0] //获取文件信息
  const chunks = chunkFun(file)
  uploadFile(chunks)
})

function chunkFun(file) {
  const chunkSize = 1024 * 1024 //1MB
  const chunks = Math.ceil(file.size / chunkSize) //计算切片数量
  const fileChunkList = []
  let current = 0
  while (current < chunks) {
    const start = current * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)
    fileChunkList.push(chunk)
    current++
  }
  return fileChunkList
}

// 2.上传文件
function uploadFile(chunks) {
  const promiseList = []
  for (let i = 0; i < chunks.length; i++) {
    const form = new FormData()
    form.append('index', i)
    form.append('total', chunks.length)
    form.append('filename', file.name)
    form.append('file', chunks[i])
    promiseList.push(
      fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: form,
      }),
    )
  }
  Promise.all(promiseList).then(() => {
    // 3.通知后台合并文件
    fetch('http://localhost:3000/merge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename: file.name }),
    }).then(data => {
      console.log('合并结果', data)
    })
  })
}
