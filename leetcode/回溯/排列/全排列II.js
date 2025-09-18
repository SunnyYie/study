// 给定一个可包含重复数字的序列 nums ，按任意顺序 返回所有不重复的全排列。

// 示例 1：

// 输入：nums = [1,1,2]
// 输出： [[1,1,2], [1,2,1], [2,1,1]]

const permuteUnique = function (nums) {
  const res = []
  const path = []
  const used = new Array(nums.length).fill(false)
  nums.sort((a, b) => a - b) // 先排序
  const backtrack = () => {
    if (path.length === nums.length) {
      res.push([...path])
      return
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue // 剪枝
      path.push(nums[i])
      used[i] = true
      backtrack()
      path.pop()
      used[i] = false
    }
  }
  backtrack()
  return res
}
