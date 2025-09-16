app.post('/download', function (req, res) {
  const fileName = req.body.fileName
  const filePath = path.join(process.cwd(), './static', fileName)
  const content = fs.readFileSync(filePath)
  // 流数据
  res.setHeader('Content-Type', 'application/octet-stream')
  // 指示浏览器将响应内容作为附件下载
  res.setHeader('Content-Disposition', 'attachment;filename=' + fileName)
  res.send(content)
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
