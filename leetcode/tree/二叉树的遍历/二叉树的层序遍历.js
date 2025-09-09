const func = (root) => {
  const res = [];

  const dfs = (node, level) => {
    if (!node) return;
    if (res.length === level) res.push([]);
    res[level].push(node.val);
    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }
  dfs(root, 0);
  return res;
}