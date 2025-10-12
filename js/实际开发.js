// URL解析
const url = new URL('https://example.com:8080/path/name?query=string#hash')

function parseURL(url) {
  const parsed = new URL(url)
  return {
    protocol: parsed.protocol, // 协议
    hostname: parsed.hostname, // 主机名
    port: parsed.port,         // 端口
    pathname: parsed.pathname, // 路径
    search: parsed.search,     // 查询字符串
    hash: parsed.hash          // 哈希
  }
}

// encodeURIComponent 和 decodeURIComponent
const originalString = 'Hello World! 你好，世界！'
const encodedString = encodeURIComponent(originalString)
const decodedString = decodeURIComponent(encodedString)
console.log('Original:', originalString);
console.log('Encoded:', encodedString);
console.log('Decoded:', decodedString);

// encodeURIComponent 和 encodeURI 的区别
function encodeDifference() {
  const url = 'https://example.com/path name?query=string#hash'
  const encodedURI = encodeURI(url) // 不编码: / ? # =
  const encodedURIComponent = encodeURIComponent(url) // 编码所有非标准字符
  console.log('encodeURI:', encodedURI)
  console.log('encodeURIComponent:', encodedURIComponent)
}
encodeDifference()