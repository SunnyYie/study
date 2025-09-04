// 给定一个字符串 s ，请你找出其中不含有重复字符的 最长 子串的长度。

const func = s => {
  let left = 0,
    right = 0,
    maxLen = 0
  const window = new Map()

  while (right < s.length) {
    const char = s[right]
    // 1. 右指针字符计数+1（标准计数逻辑）
    window.set(char, (window.get(char) || 0) + 1)
    right++

    // 2. 若出现重复，收缩左指针（递减计数而非直接删除）
    while (window.get(char) > 1) {
      const leftChar = s[left]
      window.set(leftChar, window.get(leftChar) - 1)
      if (window.get(leftChar) === 0) {
        window.delete(leftChar)
      }
      left++
    }

    // 3. 每次窗口调整后都更新最大长度
    maxLen = Math.max(maxLen, right - left)
  }

  return maxLen
}

console.log(func('abcabcbb'))
