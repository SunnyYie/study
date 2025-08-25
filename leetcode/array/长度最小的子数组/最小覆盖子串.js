// 给你一个字符串 s 、一个字符串 t 。返回 s 中涵盖 t 所有字符的最小子串。如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 "" 。

// 输入：s = "ADOBECODEBANC", t = "ABC"
// 输出："BANC"
// 解释：最小覆盖子串 "BANC" 包含来自字符串 t 的 'A'、'B' 和 'C'。

const func = (s, t) => {
  let left = 0, right = 0, minStr = ''
  const need = new Map()
  const window = new Map()

  for (const char of t) {
    need.set(char, (need.get(char) || 0) + 1)
  }

  while (right < s.length) {
    const rightChar = s[right]
    // 1. 更新窗口，使其包含右侧所有字符
    window.set(rightChar, (window.get(rightChar) || 0) + 1)

    // 2. 收缩窗口，直到不再满足条件
    while (Array.from(need.entries()).every(([key, value]) => window.get(key) >= value)) {
      // 记录最小覆盖子串
      if (minStr === '' || right - left < minStr.length) {
        minStr = s.slice(left, right + 1)
      }
      // 3. 更新左侧边界，继续收缩窗口
      const leftChar = s[left]
      window.set(leftChar, window.get(leftChar) - 1)
      if (window.get(leftChar) === 0) {
        window.delete(leftChar)
      }
      left++
    }
    right++
  }
  return minStr
}

console.log(func("ADOBECODEBANC", "ABC"));
