// 给定一个二叉搜索树, 找到该树中两个指定节点的最近公共祖先。
const lowestCommonAncestor = function (root, p, q) {
  if (!root) return null
  if (root.val > p.val && root.val > q.val) {
    return lowestCommonAncestor(root.left, p, q)
  } else if (root.val < p.val && root.val < q.val) {
    return lowestCommonAncestor(root.right, p, q)
  } else {
    return root
  }
}
