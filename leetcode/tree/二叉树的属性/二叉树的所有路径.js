// 给定一个二叉树，返回所有从根节点到叶子节点的路径。
const binaryTreePaths = function(root) {
  const res = []
  const dfs = function(node, path) {
    if (!node) return
    path += node.val
    if (!node.left && !node.right) {
      res.push(path)
    } else {
      path += '->'
      dfs(node.left, path)
      dfs(node.right, path)
    }
  }
  dfs(root, '')
  return res
}
