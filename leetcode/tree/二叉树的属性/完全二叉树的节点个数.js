// 给出一个完全二叉树，求出该树的节点个数。

const countNodes = function (root) {
  if (!root) return 0;
  const left = countNodes(root.left);
  const right = countNodes(root.right);
  return left + right + 1;
}