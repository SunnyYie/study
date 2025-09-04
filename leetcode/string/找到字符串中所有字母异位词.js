// 给定两个字符串 s 和 p，找到 s 中所有 p 的 异位词的子串，返回这些子串的起始索引
// 输入: s = "cbaebabacd", p = "abc"
// 输出: [0,6]

const findAnagrams = function (s, p) {
  const need = new Map()
  const window = new Map()

  for (const c of p) {
    need.set(c, (need.get(c) || 0) + 1)
  }

  const res = []
  let left = 0,
    right = 0
  let valid = 0

  while (right < s.length) {
    const c = s[right]
    // 扩大右侧窗口
    right++

    if (need.has(c)) {
      window.set(c, (window.get(c) || 0) + 1)
      if (window.get(c) === need.get(c)) {
        valid++
      }
    }

    // 收缩左侧窗口
    while (right - left >= p.length) {
      if (valid === need.size) {
        res.push(left)
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
  return res
}

console.log(findAnagrams('cbaebabacd', 'abc'))
