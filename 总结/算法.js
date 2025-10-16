// 给定整数数组 nums，找到 奇数个数与偶数个数相等 的最长连续子数组长度。

// 示例1： 输入: [2, 3, 5, 6, 4, 7]  输出: 6   // 整个数组奇偶各 3 个
// 示例2： 输入: [1, 3, 5, 7]        输出: 0   // 无满足条件的子数组

function findMaxLength(nums) {
  const n = nums.length
  const countIndexMap = new Map()
  countIndexMap.set(0, -1) // 初始化，奇偶数相等时的索引为 -1
  let count = 0 // 奇数个数 - 偶数个数
  let maxLength = 0
  
  for (let i = 0; i < n; i++) {
    if (nums[i] % 2 === 0) {
      count-- // 偶数，count 减 1
    } else {
      count++ // 奇数，count 加 1
    }
    if (countIndexMap.has(count)) {
      // 如果当前 count 已经出现过，计算子数组长度
      const prevIndex = countIndexMap.get(count)
      maxLength = Math.max(maxLength, i - prevIndex)
    } else {
      // 记录当前 count 第一次出现的索引
      countIndexMap.set(count, i)
    }
  }
  return maxLength
}
