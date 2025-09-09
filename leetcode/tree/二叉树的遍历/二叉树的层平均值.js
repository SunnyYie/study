// 给定一个非空二叉树, 返回一个由每层节点平均值组成的数组。
const averageOfLevels = function (root) {
  const res = [];
  const dfs = (node, level) => {
    if (!node) return;
    if (res.length === level) res.push([]);
    res[level].push(node.val);
    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }
  dfs(root, 0);
  return res.map(level => level.reduce((a, b) => a + b, 0) / level.length);
}