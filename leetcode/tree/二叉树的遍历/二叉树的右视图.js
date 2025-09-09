// 按照从顶部到底部的顺序，返回从右侧所能看到的节点值
var postorderTraversal = function (root) {
  let res = []
  const dfs = (node, level) => {
    if (!node) return
    dfs(node.left, level + 1)
    dfs(node.right, level + 1)
    if (res.length === level) res.push([])
    res[level].push(node.val)
  }
  dfs(root, 0)
  return res
}


