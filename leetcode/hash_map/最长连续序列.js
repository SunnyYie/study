// 给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
// 输入：nums = [100,4,200,1,3,2]
// 输出：4
// 解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。

const func = nums => {
  const map = new Map()
  let max = 0

  for (let i = 0; i < nums.length; i++) {
    if (!map.has(nums[i])) {
      const left = map.get(nums[i] - 1) || 0
      const right = map.get(nums[i] + 1) || 0
      const len = left + right + 1
      map.set(nums[i], len)
      max = Math.max(max, len)
      // 更新边界值
      map.set(nums[i] - left, len)
      map.set(nums[i] + right, len)
    }
  }

  return max
}
