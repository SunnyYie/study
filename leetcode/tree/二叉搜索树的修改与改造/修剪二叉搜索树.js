// 给定一个二叉搜索树，同时给定最小边界L 和最大边界 R。通过修剪二叉搜索树，使得所有节点的值在[L, R]中 (R>=L) 。

const trimBST = function (root, L, R) {
  if (!root) return null
  if (root.val < L) {
    return trimBST(root.right, L, R)
  } else if (root.val > R) {
    return trimBST(root.left, L, R)
  } else {
    root.left = trimBST(root.left, L, R)
    root.right = trimBST(root.right, L, R)
    return root
  }
}