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

function findMaxLength2(nums) {
  const map = new Map()
  map.set(0, -1)
}
console.log(findMaxLength2([1, 2, 3, 4, 5]))

// 解码方法
// 输入：s = "226"
// 输出：3
// 解释：它可以解码为 "BZ" (2 26), "VF" (22 6), 或者 "BBF" (2 2 6) 。
function func(s) {
  const dp = new Array(s.length + 1).fill(0)
  // dp[i]表示当前数字独组成的组合 + 如果当前数字小于2，则这两个数字加起来和前i-2个可以组合的数
  // dp[i] = dp[i - 1] + dp[i - 2]
  dp[0] = 1
  dp[1] = 1
  for (let i = 2; i <= s.length; i++) {
    if (s[i - 1] != 0) {
      dp[i] += dp[i - 1]
    }

    if (s[i - 2] * 10 + Number(s[i - 1]) > 10 && s[i - 2] * 10 + Number(s[i - 1]) < 27) {
      dp[i] += dp[i - 2]
    }
  }
  console.log(dp)

  return dp[s.length]
}

console.log(func('226'))
