// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。

// 有效字符串需满足：

// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。
// 注意空字符串可被认为是有效字符串。

function isValid(s) {
  const stack = []
  const mapping = {
    '(': ')',
    '{': '}',
    '[': ']'
  }

  for (let i = 0; i < s.length; i++) {
    const curr = s[i]
    if (mapping[curr]) {
      stack.push(curr)
    } else {
      if (stack.length === 0 || mapping[stack.pop()] !== curr) {
        return false
      }
    }
  }
  return stack.length === 0
}
