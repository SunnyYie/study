// 给出二叉 搜索 树的根节点，该树的节点值各不相同，请你将其转换为累加树（Greater Sum Tree），使每个节点 node 的新值等于原树中大于或等于 node.val 的值之和。
const convertBST = function (root) {
  let sum = 0
  const dfs = (node) => {
    if (!node) return
    dfs(node.right)
    sum += node.val
    node.val = sum
    dfs(node.left)
  }
  dfs(root)
  return root
}
