// 输入："23"
// 输出：["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].

const letterMap = {
  2: 'abc',
  3: 'def',
  4: 'ghi',
  5: 'jkl',
  6: 'mno',
  7: 'pqrs',
  8: 'tuv',
  9: 'wxyz',
}

const letterCombinations = function (digits) {
  if (!digits.length) return []
  const res = []
  const path = []
  const backtrack = index => {
    if (path.length === digits.length) {
      res.push(path.join(''))
      return
    }
    const letters = letterMap[digits[index]]
    for (let i = 0; i < letters.length; i++) {
      path.push(letters[i])
      backtrack(index + 1)
      path.pop()
    }
  }
  backtrack(0)
  return res
}
