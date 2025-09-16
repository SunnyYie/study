import { createClient } from 'redis'

const client = createClient({
  username: 'default',
  password: 'GhgID7Jfive1NKj92D42Gfk282v4HxG0',
  socket: {
    host: 'redis-14903.crce178.ap-east-1-1.ec2.redns.redis-cloud.com',
    port: 14903,
  },
})

client.on('error', err => console.log('Redis Client Error', err))

await client.connect()

await client.set('foo', 'bar') // 设置一个键
await client.setEx('key', 10, 'value') // 设置一个10秒后过期的键
await client.setNX('name', 'sxc') // 仅当键不存在时设置
await client.setXX('key', 'newValue') // 仅当键存在时设置

// const result = await client.get('foo')
// console.log(result)
