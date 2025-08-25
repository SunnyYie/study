// 给定一个含有 n 个正整数的数组和一个正整数 s ，找出该数组中满足其和 ≥ s 的长度最小的 连续 子数组，并返回其长度。如果不存在符合条件的子数组，返回 0。

// 示例：

// 输入：s = 7, nums = [2,3,1,2,4,3]
// 输出：2
// 解释：子数组 [4,3] 是该条件下的长度最小的子数组。

const func = (s, nums) => {
  let slow = 0,
    fast = 0,
    sum = 0,
    minLength = Infinity

  while (fast < nums.length) {
    sum += nums[fast]
    while (sum >= s) {
      minLength = Math.min(minLength, fast - slow + 1)
      sum -= nums[slow]
      slow++
    }
    fast++
  }
  return minLength === Infinity ? 0 : minLength
}
