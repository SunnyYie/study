// 给你一棵二叉树的根节点 root ，翻转这棵二叉树，并返回其根节点
const invertTree = function(root) {
  if (!root) return null
  const left = invertTree(root.left)
  const right = invertTree(root.right)
  root.left = right
  root.right = left
  return root
}