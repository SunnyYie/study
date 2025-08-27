// 给你两个整数数组 nums1 和 nums2 ，请你以数组形式返回两数组的交集。返回结果中每个元素出现的次数，应与元素在两个数组中都出现的次数一致（如果出现次数不一致，则考虑取较小值）。可以不考虑输出结果的顺序。
const func = (nums1, nums2) => {
  const count = new Map();
  const result = [];

  for (const num of nums1) {
    count.set(num, (count.get(num) || 0) + 1);
  }

  for (const num of nums2) {
    if (count.has(num) && count.get(num) > 0) {
      result.push(num);
      count.set(num, count.get(num) - 1);
    }
  }

  return result;
}
