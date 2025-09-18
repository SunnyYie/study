// 给定一个候选人编号的集合 candidates 和一个目标数 target ，找出 candidates 中所有可以使数字和为 target 的组合。

// candidates 中的每个数字在每个组合中只能使用 一次 。

// 输入: candidates = [10,1,2,7,6,1,5], target = 8,
// 输出:
// [
// [1,1,6],
// [1,2,5],
// [1,7],
// [2,6]
// ]

const func = function (candidates, target) {
  const res = [];
  const path = [];
  candidates.sort((a, b) => a - b);
  const backtrack = (startIndex, target) => {
    if (target === 0) {
      res.push([...path]);
      return;
    }
    // candidates = [1, 1, 2, 5, 6, 7, 10]
    for (let i = startIndex; i < candidates.length; i++) {
      if (candidates[i] > target) break;
      // 去重逻辑,因为第一个1已经尝试过了所有可能的组合，第二个1会产生完全相同的结果。
      if (i > startIndex && candidates[i] === candidates[i - 1]) continue;
      path.push(candidates[i]);
      backtrack(i + 1, target - candidates[i]);
      path.pop();
    }
  };
  backtrack(0, target);
  return res;
};
