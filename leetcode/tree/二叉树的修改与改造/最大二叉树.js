  // 给定一个不含重复元素的整数数组。一个以此数组构建的最大二叉树定义如下：

  // 二叉树的根是数组中的最大元素。
  // 左子树是通过数组中最大值左边部分构造出的最大二叉树。
// 右子树是通过数组中最大值右边部分构造出的最大二叉树。
  function constructMaximumBinaryTree(nums) {
    if (!nums.length) return null
    const max = Math.max(...nums)
    const index = nums.indexOf(max)
    const root = new TreeNode(max)
    root.left = constructMaximumBinaryTree(nums.slice(0, index))
    root.right = constructMaximumBinaryTree(nums.slice(index + 1))
    return root
  }