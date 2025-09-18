// 给定一个非负整数 N，找出小于或等于 N 的最大的整数，同时这个整数需要满足其各个位数上的数字是单调递增。

// （当且仅当每个相邻位数上的数字 x 和 y 满足 x <= y 时，我们称这个整数是单调递增的。）

const monotoneIncreasingDigits = function (N) {
  const arr = (N + '').split('').map(v => +v)
  let i = 1
  // 找到第一个不满足单调递增的位置
  while (i < arr.length && arr[i] >= arr[i - 1]) i++
  if (i === arr.length) return N
  // 不满足递增,回退到前一个位置
  while (i > 0 && arr[i - 1] > arr[i]) arr[--i]--
  for (let j = i + 1; j < arr.length; j++) arr[j] = 9
  return +arr.join('')
}

console.log(monotoneIncreasingDigits(732)) // 699;

