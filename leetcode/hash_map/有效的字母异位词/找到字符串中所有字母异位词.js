// 给定两个字符串 s 和 p，找到 s 中所有 p 的 异位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。

// 输入: s = "cbaebabacd", p = "abc"
// 输出: [0,6]

const func = (s, p) => {
  const need = new Map();
  const window = new Map();

  for (const c of p) {
    need.set(c, (need.get(c) || 0) + 1);
  }

  let left = 0;
  let right = 0;
  let valid = 0;
  const res = [];

  while (right < s.length) {
    const c = s[right];
    right++;

    if (need.has(c)) {
      window.set(c, (window.get(c) || 0) + 1);
      if (window.get(c) === need.get(c)) {
        valid++;
      }
    }

    while (right - left >= p.length) {
      if (valid === need.size) {
        res.push(left);
      }
      const d = s[left];
      left++;
      if (need.has(d)) {
        if (window.get(d) === need.get(d)) {
          valid--;
        }
        window.set(d, window.get(d) - 1);
      }
    }
  }

  return res;
}