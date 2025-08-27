// 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。
// height = [0,1,0,2,1,0,1,3,2,1,2,1]

const func = heights => {
  let leftMax = 0,
    rightMax = 0,
    res

  for (let i = 0; i < heights.length; i++) {
    leftMax = Math.max(leftMax, heights[i])
    rightMax = Math.max(rightMax, heights[heights.length - 1 - i])
    res += leftMax + rightMax - heights[i]
  }

  return res - leftMax * heights.length
}
