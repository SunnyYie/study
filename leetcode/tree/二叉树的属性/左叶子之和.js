// 计算给定二叉树的所有左叶子之和。
const sumOfLeftLeaves = function(root) {
  let sum = 0
  const dfs = function(node, isLeft) {
    if (!node) return
    if (!node.left && !node.right && isLeft) {
      sum += node.val
    }
    dfs(node.left, true)
    dfs(node.right, false)
  }
  dfs(root, false)
  return sum
}
