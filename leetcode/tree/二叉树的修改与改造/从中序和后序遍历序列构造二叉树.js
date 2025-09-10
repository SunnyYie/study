// 根据一棵树的中序遍历与后序遍历构造二叉树。

function buildTree(inorder, postorder) {
  if (!inorder.length || !postorder.length) return null
  const rootVal = postorder.pop()
  const root = new TreeNode(rootVal)
  const inorderIndex = inorder.indexOf(rootVal)
  root.right = buildTree(inorder.slice(inorderIndex + 1), postorder)
  root.left = buildTree(inorder.slice(0, inorderIndex), postorder)
  return root
}