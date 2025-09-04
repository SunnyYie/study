// 把字符串尾部的若干个字符转移到字符串的前面。
// 例如，对于输入字符串 "abcdefg" 和整数 2，函数应该将其转换为 "fgabcde"。

const func = (s, n) => {
  n = n % s.length
  s = s.split('')
  for (let i = s.length - 1; i >= s.length - n; i--) {
    s.unshift(s.pop())
  }
  return s.join('')
}

console.log(func('abcdefg', 2)) // "fgabcde"
