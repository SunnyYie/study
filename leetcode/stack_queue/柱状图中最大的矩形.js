// 给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。

// 求在该柱状图中，能够勾勒出来的矩形的最大面积。
// 输入：heights = [2,1,5,6,2,3]
// 输出：10
// 解释：最大的矩形为图中红色区域，面积为 10

const largestRectangleArea = function (heights) {
  const stack = []
  let maxArea = 0
  heights.push(0) // 哨兵，确保最后所有柱子都能出栈计算面积

  for (let i = 0; i < heights.length; i++) {
    while (stack.length && heights[i] < heights[stack[stack.length - 1]]) {
      const height = heights[stack.pop()]
      const width = stack.length ? i - stack[stack.length - 1] - 1 : i
      maxArea = Math.max(maxArea, height * width)
    }
    stack.push(i)
  }

  return maxArea
}
