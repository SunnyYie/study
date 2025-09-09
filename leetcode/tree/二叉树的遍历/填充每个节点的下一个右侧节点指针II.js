// 给定一个二叉树
// 填充它的每个 next 指针，让这个指针指向其下一个右侧节点。如果找不到下一个右侧节点，则将 next 指针设置为 NULL。

const connect = function (root) {
  if (!root) return null
  const queue = [root]
  while (queue.length) {
    const size = queue.length
    for (let i = 0; i < size; i++) {
      const node = queue.shift()
      if (i < size - 1) node.next = queue[0]
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
  }
  return root
}
