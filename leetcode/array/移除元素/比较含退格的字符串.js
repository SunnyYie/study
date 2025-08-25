// 给定 s 和 t 两个字符串，当它们分别被输入到空白的文本编辑器后，如果两者相等，返回 true 。# 代表退格字符。

// 输入：s = "ab#c", t = "ad#c"
// 输出：true
// 解释：s 和 t 都会变成 "ac"。

const func = (s, t) => {

  const processString = str => {
    const stack = []
    for (let char of str) {
      if (char !== '#') {
        stack.push(char)
      } else {
        stack.pop()
      }
    }
    return stack.join('')
  }
  return processString(s) === processString(t)
}