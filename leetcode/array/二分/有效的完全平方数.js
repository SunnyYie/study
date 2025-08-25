// 给你一个正整数 num 。如果 num 是一个完全平方数，则返回 true ，否则返回 false 。

// 完全平方数 是一个可以写成某个整数的平方的整数。换句话说，它可以写成某个整数和自身的乘积。

const func = (num) => {
  let left = 0, right = num
  while (left <= right) {
    let mid = Math.floor((left + right) / 2)
    if (mid * mid === num) return true
    if (mid * mid < num) left = mid + 1
    else right = mid - 1
  }
  return false
}