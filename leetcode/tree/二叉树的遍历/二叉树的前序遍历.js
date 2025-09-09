const func = (root) => {
  let res = [];
  const dfs = (node) => {
    if (!node) return;
    res.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return res;
}