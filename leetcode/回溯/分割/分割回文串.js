// 给定一个字符串 s，将 s 分割成一些子串，使每个子串都是回文串。

// 返回 s 所有可能的分割方案。

// 示例: 输入: "aab" 输出: [ ["aa","b"], ["a","a","b"] ]

const partition = function (s) {
  const res = []
  const path = []
  const len = s.length

  const isPalindrome = (str, left, right) => {
    while (left < right) {
      if (str[left] !== str[right]) {
        return false
      }
      left++
      right--
    }
    return true
  }
  const backtrack = startIndex => {
    if (startIndex >= len) {
      res.push([...path])
      return
    }
    for (let i = startIndex; i < len; i++) {
      if (isPalindrome(s, startIndex, i)) {
        path.push(s.substring(startIndex, i + 1))
      } else {
        continue
      }
      backtrack(i + 1)
      path.pop()
    }
  }
  backtrack(0)
  return res
}
