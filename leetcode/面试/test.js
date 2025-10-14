// dp[i] 表示 “字符串前 i 个字符的组合方式数量”
// 计算 dp[2]（"22"）：
// 单独解码 "2"：在 dp[1] 的基础上加 "2" → 1种方式
// 组合解码 "22"：在 dp[0] 的基础上加 "22" → 1种方式
// 总共：dp[2] = dp[1] + dp[0] = 1 + 1 = 2 种方式
// 计算 dp[3]（"226"）：
// 单独解码 "6"：在 dp[2] 的基础上加 "6" → 2种方式
// 组合解码 "26"：在 dp[1] 的基础上加 "26" → 1种方式
// 总共：dp[3] = dp[2] + dp[1] = 2 + 1 = 3 种方式
var numDecodings = function (s) {
  const n = s.length
  if (n === 0 || s[0] === '0') return 0

  const dp = new Array(n + 1).fill(0)
  dp[0] = 1
  dp[1] = 1

  for (let i = 2; i <= n; i++) {
    const oneDigit = s[i - 1] // 当前一位（字符）
    const twoDigits = s.slice(i - 2, i) // 当前两位（字符串）

    // 如果当前一位不是 '0'，可以单独解码，加上前一个状态
    if (oneDigit !== '0') {
      dp[i] += dp[i - 1]
    }

    // 如果两位组合在10到26之间，也可以解码，加上前前个状态
    if (twoDigits >= '10' && twoDigits <= '26') {
      dp[i] += dp[i - 2]
    }
  }

  return dp[n] // dp[n] 表示整个字符串的解码总数
}
