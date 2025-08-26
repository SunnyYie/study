// 给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。

// 快速方案
var findMedianSortedArrays = function (nums1, nums2) {
  const merged = nums1.concat(nums2).sort((a, b) => a - b)
  const length = merged.length
  const mid = Math.floor(length / 2)
  return length % 2 === 0 ? (merged[mid - 1] + merged[mid]) / 2 : merged[mid]
}
