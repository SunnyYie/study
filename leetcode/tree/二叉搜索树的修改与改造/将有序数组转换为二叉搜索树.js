// 将一个按照升序排列的有序数组，转换为一棵高度平衡二叉搜索树。左右两个子树的高度差的绝对值不超过 1

const sortedArrayToBST = function (nums) {
  if (!nums.length) return null;
  const mid = Math.floor(nums.length / 2);
  const root = new TreeNode(nums[mid]);
  root.left = sortedArrayToBST(nums.slice(0, mid));
  root.right = sortedArrayToBST(nums.slice(mid + 1));
  return root;
}