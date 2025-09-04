// 给定一个 haystack 字符串和一个 needle 字符串，在 haystack 字符串中找出 needle 字符串出现的第一个位置 (从0开始)。如果不存在，则返回  -1。

// 示例 1: 输入: haystack = "hello", needle = "ll" 输出: 2

const strStr = function (haystack, needle) {
  for (let i = 0; i < needle.length; i++) {
    for (let j = 0; j < haystack.length; j++) {
      if (haystack[j] === needle[i]) {
        let k = 0
        while (k < needle.length && haystack[j + k] === needle[i + k]) {
          k++
        }
        if (k === needle.length) {
          return j
        }
      }
    }
  }
  return -1
}

console.log(strStr('hello', 'll'))
