// 给定一个赎金信 (ransom) 字符串和一个杂志(magazine)字符串，判断第一个字符串 ransom 能不能由第二个字符串 magazines 里面的字符构成。如果可以构成，返回 true ；否则返回 false。

const func = (ransom, magazine) => {
  const map = new Map()

  for (let char of magazine) {
    map.set(char, (map.get(char) || 0) + 1)
  }

  for (let char of ransom) {
    if (!map.has(char) || map.get(char) === 0) return false
    map.set(char, map.get(char) - 1)
  }

  return true
}
