// 给定四个包含整数的数组列表 A , B , C , D ,计算有多少个元组 (i, j, k, l) ，使得 A[i] + B[j] + C[k] + D[l] = 0。
// A = [ 1, 2]
// B = [-2,-1]
// C = [-1, 2]
// D = [ 0, 2]

const fourSumCount = (A, B, C, D) => {
  const map = new Map()
  let count = 0

  for (let a of A) {
    for (let b of B) {
      const sum = a + b
      map.set(sum, (map.get(sum) || 0) + 1)
    }
  }

  for (let c of C) {
    for (let d of D) {
      const sum = -(c + d)
      if (map.has(sum)) {
        count += map.get(sum)
      }
    }
  }

  return count
}

console.log(fourSumCount([1, 2], [-2, -1], [-1, 2], [0, 2])) // 2
