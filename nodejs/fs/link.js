const fs = require('fs')

// 创建硬链接,原地址和新地址
// 新地址文件修改会影响原地址文件
fs.linkSync('test.txt', 'test_link.txt')

// 软连接（需要管理员权限）
fs.symlinkSync('test.txt', 'test_symlink.txt', 'file')