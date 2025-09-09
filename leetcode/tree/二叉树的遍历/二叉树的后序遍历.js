const func = root => {
  let res = []
  const dfs = node => {
    if (!node) return
    dfs(node.left)
    dfs(node.right)
    res.push(node.val)
  }
  dfs(root)
  return res
}
