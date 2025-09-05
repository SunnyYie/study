// 定一个经过编码的字符串，返回它解码后的字符串。
// 输入：s = "3[a]2[bc]"
// 输出："aaabcbc"

const decodeString = function (s) {
  const stack = []

  for (let i = 0; i < s.length; i++) {
    const char = s[i]
    if (char !== ']') {
      stack.push(char)
    } else {
      // 1.弹出字符串
      let str = ''
      while (stack.length && stack[stack.length - 1] !== '[') {
        str = stack.pop() + str
      }
      stack.pop() // 弹出'['
      // 2.弹出数字
      let num = ''
      while (stack.length && /\d/.test(stack[stack.length - 1])) {
        num = stack.pop() + num
      }
      // 3.重复字符串并入栈
      for (let j = 0; j < parseInt(num); j++) {
        stack.push(str)
      }
    }
  }
  return stack.join('')
}

console.log(decodeString('3[a]2[bc]'))