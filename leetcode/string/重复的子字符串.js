// 给定一个非空的字符串，判断它是否可以由它的一个子串重复多次构成。

// 示例 1: 输入: "abab" 输出: True 解释: 可由子串 "ab" 重复两次构成。

const func = s => {
  const str = (s + s).slice(1, -1)
  return str.includes(s)
}
