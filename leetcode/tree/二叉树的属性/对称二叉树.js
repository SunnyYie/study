// 给你一个二叉树的根节点 root ， 检查它是否轴对称。
const isSymmetric = function(root) {
  if (!root) return true
  const isMirror = function(left, right) {
    if (!left && !right) return true
    if (!left || !right) return false
    return left.val === right.val &&
      isMirror(left.left, right.right) &&
      isMirror(left.right, right.left)
  }
  return isMirror(root.left, root.right)
}
