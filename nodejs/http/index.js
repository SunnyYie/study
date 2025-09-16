import http from 'http'
import url from 'url'

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true)
  console.log('请求路径:', pathname, req.method)
  if (req.method === 'GET') {
    if (pathname === '/get') {
      res.end('这是一个GET请求')
    } else {
      res.statusCode = 200
      res.end('欢迎使用Node.js HTTP服务器')
    }
  } else if (req.method === 'POST') {
    if (pathname === '/post') {
      let body = ''

      // 监听数据块
      req.on('data', chunk => {
        body += chunk.toString()
      })
      // 数据接收完毕
      req.on('end', () => {
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end(`这是一个POST请求，接收到的数据: ${body}`)
      })
    } else {
      res.statusCode = 404
      res.end('未找到资源')
    }
  }
})

server.listen(4000, () => {
  console.log('服务器正在运行，访问 http://localhost:4000/')
})
