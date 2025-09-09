// 给定一个二叉树，返回其节点值自底向上的层次遍历。 （即按从叶子节点所在层到根节点所在的层，逐层从左向右遍历）

const levelOrderBottom = function (root) {
  const res = [];
  const dfs = (node, level) => {
    if (!node) return;
    if (res.length === level) res.unshift([]);
    res[res.length - level - 1].push(node.val);
    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }
  dfs(root, 0);

}