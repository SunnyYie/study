// 给你一个字符串 s 。我们要把这个字符串划分为尽可能多的片段，同一字母最多出现在一个片段中。

const partitionLabels = function (s) {
  const lastIndex = new Map();
  for (let i = 0; i < s.length; i++) {
    // 记录每个字符最后出现的位置
    lastIndex.set(s[i], i);
  }
  let start = 0;
  let end = 0;
  const result = [];
  for (let i = 0; i < s.length; i++) {
    // 更新当前片段的结束位置
    end = Math.max(end, lastIndex.get(s[i]));
    if (i === end) {
      result.push(end - start + 1);
      start = end + 1;
    }
  }
  return result;
}
console.log(partitionLabels("ababcbacadefegdehijhklij")) // [9,7,8];
