// 给定一个二叉搜索树的根节点 root 和一个值 key，删除二叉搜索树中的 key 对应的节点，并保证二叉搜索树的性质不变。返回二叉搜索树（有可能被更新）的根节点的引用。
const deleteNode = function (root, key) {
  if (!root) return null
  if (root.val === key) {
    if (!root.left) return root.right
    if (!root.right) return root.left
    let cur = root.right
    while (cur.left) {
      cur = cur.left
    }
    cur.left = root.left
    return root.right
  } else if (root.val > key) {
    root.left = deleteNode(root.left, key)
  } else {
    root.right = deleteNode(root.right, key)
  }
  return root
}
