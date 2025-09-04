// 给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。
// 返回 滑动窗口中的最大值 。

const maxSlidingWindow = function (nums, k) {
  const res = [],
    deque = []
  for (let i = 0; i < nums.length; i++) {
    // 窗口已经移走了
    if (deque.length > 0 && deque[0] < i - k + 1) {
      deque.shift()
    }

    // 保持存储的永远是当前窗口最大值的索引
    while (deque.length > 0 && nums[deque[0]] < nums[i]) {
      deque.pop()
    }

    deque.push(i)
    if (i >= k - 1) {
      res.push(nums[deque[0]])
    }
  }
  return res
}

console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)) // [3,3,5,5,6,7]
