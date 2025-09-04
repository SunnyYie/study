// 「快乐数」定义为：对于一个正整数，每一次将该数替换为它每个位置上的数字的平方和，然后重复这个过程直到这个数变为 1，也可能是 无限循环 但始终变不到 1。如果 可以变为  1，那么这个数就是快乐数。

const func = n => {
  const map = new Map()

  while (n !== 1) {
    let sum = 0
    while (n) {
      const digit = n % 10
      sum += digit * digit
      n = Math.floor(n / 10)
    }
    if (map.has(sum)) return false
    map.set(sum, true)
    n = sum
  }
  return true
}
