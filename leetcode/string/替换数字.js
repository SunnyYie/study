// 将字符串中的字母字符保持不变，而将每个数字字符替换为number

// 例如，对于输入字符串 "a1b2c3"，函数应该将其转换为 "anumberbnumbercnumber"。

const func = s => {
  return s.replace(/\d/g, 'number')
}
