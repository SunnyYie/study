// 给你一个整数数组 nums 和一个整数 k ，请你统计并返回 该数组中和为 k 的子数组的个数 。

const subarraySum = function (nums, k) {
  const map = new Map()
  map.set(0, 1)
  let count = 0
  let sum = 0
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i]
    if (map.has(sum - k)) {
      count += map.get(sum - k)
    }
    map.set(sum, (map.get(sum) || 0) + 1)
  }
  return count
}

console.log(subarraySum([1, 2, 3], 3)) // 2
