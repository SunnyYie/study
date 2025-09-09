// 最小深度是从根节点到最近叶子节点的最短路径上的节点数量。
const minDepth = function (root) {
  if (!root) return 0
  if (!root.left) return minDepth(root.right) + 1
  if (!root.right) return minDepth(root.left) + 1
  return Math.min(minDepth(root.left), minDepth(root.right)) + 1
}