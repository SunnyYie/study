// 输入: ["2", "1", "+", "3", " * "]
// 输出: 9
// 解释: 该算式转化为常见的中缀算术表达式为：((2 + 1) * 3) = 9

const func = tokens => {
  const stack = []
  let res = 0
  for (let token of tokens) {
    if (['+', '-', '*', '/'].includes(token)) {
      const b = stack.pop()
      const a = stack.pop()
      switch (token) {
        case '+':
          res = a + b
          break
        case '-':
          res = a - b
          break
        case '*':
          res = a * b
          break
        case '/':
          res = Math.trunc(a / b)
          break
      }
      stack.push(res)
    } else {
      stack.push(Number(token))
    }
  }
  return stack[0]
}

console.log(func(['2', '1', '+', '3', '*'])) // 9
