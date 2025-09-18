// 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。
const generateParenthesis = function (n) {
  const res = []
  const backtrack = (s = '', left = 0, right = 0) => {
    if (s.length === 2 * n) {
      res.push(s)
      return
    }
    if (left < n) backtrack(s + '(', left + 1, right)
    if (right < left) backtrack(s + ')', left, right + 1)
  }
  backtrack()
  return res
}
