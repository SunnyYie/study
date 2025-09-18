// 找出所有相加之和为 n 的 k 个数的组合。组合中只允许含有 1 - 9 的正整数，并且每种组合中不存在重复的数字。

// 说明：

// 所有数字都是正整数。
// 解集不能包含重复的组合。
// 示例 1: 输入: k = 3, n = 7 输出: [[1,2,4]]

const combinationSum3 = function (k, n) {
  const res = []
  const path = []
  const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const backtracking = (startIndex, sum) => {
    if (path.length === k) {
      if (sum === n) {
        res.push([...path])
      }
      return
    }
    for (let i = startIndex; i < candidates.length; i++) {
      path.push(candidates[i])
      sum += candidates[i]
      backtracking(i + 1, sum)
      path.pop()
      sum -= candidates[i]
    }
  }
  backtracking(0, 0)
  return res
}
