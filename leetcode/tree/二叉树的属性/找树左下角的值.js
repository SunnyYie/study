// 给定一个二叉树，在树的最后一行找到最左边的值。

const findBottomLeftValue = function (root) {
  let queue = [root]
  let res = root.val

  while (queue.length) {
    let size = queue.length
    res = queue[0].val
    for (let i = 0; i < size; i++) {
      let node = queue.shift()
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
  }
  return res
}
