// 给你一个 m 行 n 列的矩阵 matrix ，请按照 顺时针螺旋顺序 ，返回矩阵中的所有元素。

// 输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
// 输出：[1,2,3,6,9,8,7,4,5]

const func = matrix => {
  const res = []

  let left = 0,
    right = matrix[0].length - 1,
    top = 0,
    bottom = matrix.length - 1

  while (left <= right && top <= bottom) {
    // 从左到右遍历上边界
    for (let i = left; i <= right; i++) {
      res.push(matrix[top][i])
    }
    top++

    // 从上到下遍历右边界
    for (let i = top; i <= bottom; i++) {
      res.push(matrix[i][right])
    }
    right--

    // 从右到左遍历下边界
    if (top <= bottom) {
      for (let i = right; i >= left; i--) {
        res.push(matrix[bottom][i])
      }
      bottom--
    }

    // 从下到上遍历左边界
    if (left <= right) {
      for (let i = bottom; i >= top; i--) {
        res.push(matrix[i][left])
      }
      left++
    }
  }
  return res
}
