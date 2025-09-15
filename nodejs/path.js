const path = require('path')

const examplePath = '/user/local/bin/file.txt'
console.log('示例路径:', path.basename(examplePath)) // 输出: file.txt
console.log('目录名:', path.dirname(examplePath)) // 输出: /user/local/bin
console.log('扩展名:', path.extname(examplePath)) // 输出: .txt

// Windows兼容正斜杠
const windowsPath = 'C:\\user\\local\\bin\\file.txt'
// 使用 path.win32 处理 Windows 路径
console.log('Windows路径的目录名:', path.win32.dirname(windowsPath)) // 输出: C:\user\local\bin

// 连接路径
const joinedPath = path.join('/user', 'local', 'bin', 'file.txt')
console.log('连接的路径:', joinedPath) // 输出: /user/local/bin/file.txt

// 解析路径
const parsedPath = path.resolve(__dirname, './path.js')
console.log('解析的绝对路径对象:', parsedPath) // D:\Web\project\studyroad-now\nodejs\path.js