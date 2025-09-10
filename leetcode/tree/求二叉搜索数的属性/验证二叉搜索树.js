// 给定一个二叉树，判断其是否是一个有效的二叉搜索树。
const isValidBST = function (root) {
  const validate = (node, min, max) => {
    if (!node) return true
    if (node.val <= min || node.val >= max) return false
    return validate(node.left, min, node.val) && validate(node.right, node.val, max)
  }
  return validate(root, -Infinity, Infinity)
}
