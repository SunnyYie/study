// 给定一个有相同值的二叉搜索树（BST），找出 BST 中的所有众数（出现频率最高的元素）。
const findMode = function (root) {
  const map = new Map()
  let maxCount = 0
  const dfs = node => {
    if (!node) return
    map.set(node.val, (map.get(node.val) || 0) + 1)
    maxCount = Math.max(maxCount, map.get(node.val))
    dfs(node.left)
    dfs(node.right)
  }
  dfs(root)
  const res = []
  for (const [key, value] of map) {
    if (value === maxCount) {
      res.push(key)
    }
  }
  return res
}
