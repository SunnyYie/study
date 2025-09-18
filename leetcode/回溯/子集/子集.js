// 给定一组不含重复元素的整数数组 nums，返回该数组所有可能的子集（幂集）。

// 说明：解集不能包含重复的子集。

// 示例: 输入: nums = [1,2,3] 输出: [ [3],   [1],   [2],   [1,2,3],   [1,3],   [2,3],   [1,2],   [] ]

const subsets = function (nums) {
  const res = []
  const path = []
  const len = nums.length

  const backtracking = startIndex => {
    // 每次递归时都将当前路径加入结果集
    res.push([...path])
    for (let i = startIndex; i < len; i++) {
      path.push(nums[i])
      backtracking(i + 1)
      path.pop()
    }
  }
  backtracking(0)
  return res
}
