// 给定一个二维数组 array，请返回「螺旋遍历」该数组的结果。

// 螺旋遍历：从左上角开始，按照 向右、向下、向左、向上 的顺序 依次 提取元素，然后再进入内部一层重复相同的步骤，直到提取完所有元素。

// 示例 1：

// 输入：array = [[1,2,3],[8,9,4],[7,6,5]]
// 输出：[1,2,3,4,5,6,7,8,9]

const func = (array) => {
  const res = []
  let left = 0,
    right = array[0].length - 1,
    top = 0,
    bottom = array.length - 1

  while (left <= right && top <= bottom) {
    // 从左到右遍历上边界
    for (let i = left; i <= right; i++) {
      res.push(array[top][i])
    }
    top++

    // 从上到下遍历右边界
    for (let i = top; i <= bottom; i++) {
      res.push(array[i][right])
    }
    right--

    // 从右到左遍历下边界
    if (top <= bottom) {
      for (let i = right; i >= left; i--) {
        res.push(array[bottom][i])
      }
      bottom--
    }

    // 从下到上遍历左边界
    if (left <= right) {
      for (let i = bottom; i >= top; i--) {
        res.push(array[i][left])
      }
      left++
    }
  }
  return res
}
