// 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组。

// 给定数组 nums = [-1, 0, 1, 2, -1, -4]，

// 满足要求的三元组集合为： [ [-1, 0, 1], [-1, -1, 2] ]

const func = nums => {
  const res = []
  for (let i = 0; i < nums.length - 2; i++) {
    const target = -nums[i]
    const map = new Map()
    for (let j = i + 1; j < nums.length; j++) {
      if (map.has(target - nums[j])) {
        const arr = [nums[i], nums[j], target - nums[j]].sort((a, b) => a - b)
        const key = arr.join(',')
        if (!res.some(item => item.join(',') === key)) {
          res.push(arr)
        }
      }
      map.set(nums[j], j)
    }
  }

  return res
}

console.log(func([-1, 0, 1, 2, -1, -4]));

