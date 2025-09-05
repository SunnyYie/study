// 给定一个整数数组 temperatures ，表示每天的温度，返回一个数组 answer ，其中 answer[i] 是指对于第 i 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 0 来代替。

const func = function (temperatures) {
  const answer = new Array(temperatures.length).fill(0)
  const stack = [] // 存储索引

  for (let i = 0; i < temperatures.length; i++) {
    const currentTemp = temperatures[i]
    // 检查栈顶元素是否小于当前温度
    while (stack.length && temperatures[stack[stack.length - 1]] < currentTemp) {
      const prevIndex = stack.pop()
      answer[prevIndex] = i - prevIndex // 计算天数差
    }
    stack.push(i) // 将当前索引入栈
  }
  return answer
}

console.log(func([73, 74, 75, 71, 69, 72, 76, 73])) // [1,1,4,2,1,1,0,0];
