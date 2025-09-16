import multer from 'multer'
import path from 'path'
import fs from 'fs'

// 存储分配文件的路径和文件名称
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.index}-${req.body.fileName}`)
  },
})
const upload = multer({ storage })

app.post('/upload', upload.single('file'), (req, res) => {
  res.send('文件上传成功')
})

app.post('/merge', (req, res) => {
  const uploadPath = 'uploads/'
  let files = fs.readdirSync(path.join(__dirname, uploadPath))
  const writePath = path.join(__dirname, 'merged', req.body.fileName)
  files.forEach(file => {
    fs.appendFileSync(writePath, fs.readFileSync(path.join(__dirname, uploadPath, file)))
    fs.unlinkSync(path.join(__dirname, uploadPath, file)) // 删除分片文件
  })
  res.send('文件合并成功')
})

app.listen(3000, () => {
  console.log('服务器已启动，监听端口 3000')
})