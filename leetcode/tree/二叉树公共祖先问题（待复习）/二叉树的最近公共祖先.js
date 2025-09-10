// 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

const lowestCommonAncestor = function (root, p, q) {
  if (!root || root === p || root === q) return root
  const left = lowestCommonAncestor(root.left, p, q)
  const right = lowestCommonAncestor(root.right, p, q)
  if (left && right) return root
  return left ? left : right
}