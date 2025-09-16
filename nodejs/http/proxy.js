import http from 'http';
import url from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from './proxy.config.js';

const proxy = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  const proxyList = Object.keys(config.server.proxy);

  if (proxyList.includes(pathname)) {
    createProxyMiddleware(config.server.proxy[pathname])(req, res);
  } else {
    res.statusCode = 404;
    res.end('未找到资源');
  }
});

proxy.listen(config.server.port, config.server.host, () => {
  console.log(`代理服务器正在运行，访问 http://${config.server.host}:${config.server.port}/`);
});