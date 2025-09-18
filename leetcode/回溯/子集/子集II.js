// 给定一个可能包含重复元素的整数数组 nums，返回该数组所有可能的子集（幂集）。

// 说明：解集不能包含重复的子集。

// 示例:

// 输入: [1,2,2]
// 输出: [ [2], [1], [1,2,2], [2,2], [1,2], [] ]

const subsetsWithDup = function (nums) {
  const res = []
  const path = []
  const len = nums.length
  // 先排序，方便后续去重
  nums.sort((a, b) => a - b)
  const backtracking = startIndex => {
    // 每次递归都记录当前路径
    res.push([...path])
    if (startIndex >= len) return
    for (let i = startIndex; i < len; i++) {
      // 去重逻辑：跳过同一层中值相同的元素
      if (i > startIndex && nums[i] === nums[i - 1]) {
        continue
      }
      path.push(nums[i])
      backtracking(i + 1)
      path.pop()
    }
  }
  backtracking(0)
  return res
}
