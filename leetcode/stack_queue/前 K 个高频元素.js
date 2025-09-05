// 给定一个非空的整数数组，返回其中出现频率前 k 高的元素。

// 示例 1:

// 输入: nums = [1,1,1,2,2,3], k = 2
// 输出: [1,2]

const topKFrequent = function (nums, k) {
  // 1. 统计频率
  const freqMap = new Map()
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1)
  }

  // 2. 建立桶，将出现次数相同的数字放在同一个桶里
  const bucket = Array(nums.length + 1)
    .fill()
    .map(() => [])
  for (const [num, freq] of freqMap) {
    bucket[freq].push(num)
  }

  // 3. 从后往前遍历桶，取出前 k 个高频元素
  const res = []
  for (let i = bucket.length - 1; i >= 0 && res.length < k; i--) {
    if (bucket[i].length > 0) {
      res.push(...bucket[i])
    }
  }
  return res.slice(0, k)
}
