// 给定一个字符串，逐个翻转字符串中的每个单词。
// 示例 1：
// 输入: "the sky is blue"
// 输出: "blue is sky the"

const func = s => {
  const arr = [],
    temp = []
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== ' ') {
      let j = i
      while (j < s.length && s[j] !== ' ') {
        j++
        temp.push(s[j - 1])
      }
      arr.unshift(temp.join(''))
      i = j
      temp.length = 0
    }
  }
  return arr.join(' ')
}

console.log(func('  hello world!  '))
