const crypto = require('crypto')

// 对称加密
// 生成一个随机的 16 字节的初始化向量 (IV)
const iv = Buffer.from(crypto.randomBytes(16))

// 生成一个随机的 32 字节的密钥
const key = crypto.randomBytes(32)

// 创建加密实例，使用 AES-256-CBC 算法，提供密钥和初始化向量
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

// 对输入数据进行加密，并输出加密结果的十六进制表示
cipher.update('mcgdg', 'utf-8', 'hex')
const result = cipher.final('hex')
console.log(result)

// 解密
const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
decipher.update(result, 'hex', 'utf-8')
const r2 = decipher.final('utf-8')
console.log(r2)

// 非对称加密
// 生成一对 RSA 密钥对
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, // 密钥长度
})

// 使用公钥加密数据
const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from('mcgdg'))
console.log(encryptedData.toString('base64'))

// 使用私钥解密数据
const decryptedData = crypto.privateDecrypt(privateKey, encryptedData)
console.log(decryptedData.toString('utf-8'))
