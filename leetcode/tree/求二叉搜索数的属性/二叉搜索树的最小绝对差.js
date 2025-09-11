// 给你一棵所有节点为非负值的二叉搜索树，请你计算树中任意两节点的差的绝对值的最小值。

const getMinimumDifference = function (root) {
  let min = Infinity,
    prev = -1
  const dfs = node => {
    if (!node) return
    dfs(node.left)
    if (prev !== -1) {
      min = Math.min(min, Math.abs(node.val - prev))
    }
    prev = node.val
    dfs(node.right)
  }
  dfs(root)
  return min
}
