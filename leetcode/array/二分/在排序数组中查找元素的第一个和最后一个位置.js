// 给定一个按照升序排列的整数数组 nums，和一个目标值 target。找出给定目标值在数组中的开始位置和结束位置。

// 如果数组中不存在目标值 target，返回 [-1, -1]。

// 进阶：你可以设计并实现时间复杂度为 $O(\log n)$ 的算法解决此问题吗？

// 示例 1：

// 输入：nums = [5,7,7,8,8,10], target = 8
// 输出：[3,4]
// 示例 2：

// 输入：nums = [5,7,7,8,8,10], target = 6
// 输出：[-1,-1]
// 示例 3：

// 输入：nums = [], target = 0
// 输出：[-1,-1]


const func = (nums, target) => {
  let left = 0, right = nums.length - 1
  const res = [-1, -1]
  // 找左边界和右边界
  while (left <= right) {
    let mid = Math.floor((left + right) / 2)
    if (nums[mid] === target) {
      res[0] = mid
      right = mid - 1
    } else if (nums[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  left = 0
  right = nums.length - 1
  while (left <= right) {
    let mid = Math.floor((left + right) / 2)
    if (nums[mid] === target) {
      res[1] = mid
      left = mid + 1
    } else if (nums[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return res
}