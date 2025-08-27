// 给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。
// 字母异位词 是由重新排列源单词的所有字母得到的一个新单词。

// 输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]

// 输出: [["bat"],["nat","tan"],["ate","eat","tea"]]

const func = strs => {
  const map = new Map()
  const result = []

  for (let str of strs) {
    const key = [...str].sort().join('')
    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key).push(str)
  }

  for (let group of map.values()) {
    result.push(group)
  }

  return result
}
