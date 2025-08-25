// 给你一个有序数组 nums ，请你原地 删除重复出现的元素，使得出现次数超过两次的元素只出现两次 ，返回删除后数组的新长度。
const func = nums => {
  let count = 1, index = 1

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]) {
      count++
    } else {
      count = 1
    }

    if (count <= 2) {
      nums[index] = nums[i]
      index++
    }
  }
  return index
}
