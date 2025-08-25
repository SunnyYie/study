// 给定一个正整数 n，生成一个包含 1 到 n^2 所有元素，且元素按顺时针顺序螺旋排列的正方形矩阵。

// 示例:

// 输入: 3 输出: [ [ 1, 2, 3 ], [ 8, 9, 4 ], [ 7, 6, 5 ] ]

const func = n => {
  const arr = new Array(n).fill(0).map(() => new Array(n).fill(0))
  let left = 0,
    right = n - 1

  let top = 0,
    bottom = n - 1

  while (left <= right && top <= bottom) {
    // 从左到右填充上边界
    for (let i = left; i <= right; i++) {
      arr[top][i] = num++
    }
    top++

    // 从上到下填充右边界
    for (let i = top; i <= bottom; i++) {
      arr[i][right] = num++
    }
    right--

    // 从右到左填充下边界
    for (let i = right; i >= left; i--) {
      arr[bottom][i] = num++
    }
    bottom--

    // 从下到上填充左边界
    for (let i = bottom; i >= top; i--) {
      arr[i][left] = num++
    }
    left++
  }

  return arr
}
