// 给定一个二叉树和一个目标和，判断该树中是否存在根节点到叶子节点的路径，这条路径上所有节点值相加等于目标和。
function hasPathSum(root, targetSum) {
  if (!root) return false
  if (!root.left && !root.right) return root.val === targetSum
  const newTarget = targetSum - root.val
  return hasPathSum(root.left, newTarget) || hasPathSum(root.right, newTarget)
}