// 给定一个整数数组 Array，请计算该数组在每个指定区间内元素的总和。

// 第一行输入为整数数组 Array 的长度 n，接下来 n 行，每行一个整数，表示数组的元素。随后的输入为需要计算总和的区间，直至文件结束。

// 前缀和
const func = (arr, left, right) => {
  const prefixSum = [0]
  for (let i = 0; i < arr.length; i++) {
    prefixSum[i + 1] = prefixSum[i] + arr[i]
  }
  return prefixSum[right + 1] - prefixSum[left]
}
