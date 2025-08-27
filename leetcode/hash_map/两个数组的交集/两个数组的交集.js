// 给定两个数组，编写一个函数来计算它们的交集。

const func = (nums1, nums2) => {
  const set1 = new Set(nums1)
  const set2 = new Set(nums2)
  const result = []
  for (const num of set1) {
    if (set2.has(num)) {
      result.push(num)
    }
  }
  return result
}
