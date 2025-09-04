// 给你一个字符串 s 、一个字符串 t 。返回 s 中涵盖 t 所有字符的最小子串。如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 "" 。

const minWindow = function (s, t) {
  const need = new Map()
  const window = new Map()
  for (const c of t) {
    need.set(c, (need.get(c) || 0) + 1)
  }

  let left = 0,
    right = 0
  let valid = 0

  let start = 0,
    len = Infinity

  while (right < s.length) {
    const c = s[right]
    right++
    if (need.has(c)) {
      window.set(c, (window.get(c) || 0) + 1)
      if (window.get(c) === need.get(c)) {
        valid++
      }
    }
    // 收缩左侧窗口
    while (valid === need.size) {
      // 更新最小覆盖子串
      if (right - left < len) {
        start = left
        len = right - left
      }
      const d = s[left]
      left++
      if (need.has(d)) {
        if (window.get(d) === need.get(d)) {
          valid--
        }
        window.set(d, window.get(d) - 1)
      }
    }
  }
  return len === Infinity ? '' : s.substr(start, len)
}

console.log(minWindow('ADOBECODEBANC', 'ABC'))
