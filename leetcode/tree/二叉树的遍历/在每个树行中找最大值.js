// 在二叉树的每一行中找到最大的值。

const func = function (root) {
  if (!root) return []
  const res = []
  const queue = [root]
  while (queue.length) {
    const size = queue.length
    let max = -Infinity
    for (let i = 0; i < size; i++) {
      const node = queue.shift()
      max = Math.max(max, node.val)
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
    res.push(max)
  }
  return res
}
