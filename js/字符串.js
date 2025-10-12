// 空格去除
const stringTrim = str => {
  return str.replace(/^\s+|\s+$/g, '')
}

// 判断回文字符串
const isPalindrome = str => {
  const len = str.length
  for (let i = 0; i < len / 2; i++) {
    if (str[i] !== str[len - 1 - i]) {
      return false
    }
  }
  return true
}