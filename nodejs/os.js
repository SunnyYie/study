const os = require('os')

console.log('操作系统信息:')
console.log('平台:', os.platform()) // 'darwin', 'win32', 'linux' 等
console.log('版本:', os.release()) //10.0.19041

console.log('CPU 架构:', os.arch()) // 'x64', 'arm', 'ia32' 等
console.log('CPU 线程数:', os.cpus().length)
console.log('每个 CPU 的信息:', os.cpus())
console.log('内存信息:', os.totalmem(), 'bytes')
console.log('系统临时目录:', os.tmpdir()) // C:\Users\mcgdg\AppData\Local\Temp

// 网络接口信息
console.log('网络接口:', os.networkInterfaces())
// {
//   address: 'fe80::b1c3:b8b1:d4cf:4091', // 本地 IPv6 地址
//   netmask: 'ffff:ffff:ffff:ffff::', // 子网掩码
//   family: 'IPv6', // 地址类型
//   mac: 'c8:15:4e:cb:37:f2', // MAC 地址
//   internal: false, // 是否为内网地址
//   cidr: 'fe80::b1c3:b8b1:d4cf:4091/64', //
//   scopeid: 8
// },
