// 给定一个 没有重复 数字的序列，返回其所有可能的全排列。

// 示例:

// 输入: [1,2,3]
// 输出: [ [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1] ]

var permute = function (nums) {
  const res = []
  const track = []
  const used = new Array(nums.length).fill(false)
  const backtrack = nums => {
    if (track.length === nums.length) {
      res.push([...track])
      return
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue
      track.push(nums[i])
      used[i] = true
      backtrack(nums)
      track.pop()
      used[i] = false
    }
  }
  backtrack(nums)
  return res
}
