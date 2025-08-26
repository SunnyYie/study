// 给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。

const func = nums => {
  const set = new Set(nums)
  let i = 1
  while (set.has(i)) {
    i++
  }
  return i
}
