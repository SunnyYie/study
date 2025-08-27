// 给你链表的头节点 head ，每 k 个节点一组进行翻转，请你返回修改后的链表。
// k 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序

var reverseKGroup = function (head, k) {
  if (!head || k <= 1) return head

  // 检查剩余节点是否足够k个
  let count = 0
  let curr = head
  while (curr && count < k) {
    curr = curr.next
    count++
  }

  // 如果不足k个，直接返回
  if (count < k) return head

  // 翻转当前k个节点
  let prev = null
  let curr2 = head
  for (let i = 0; i < k; i++) {
    let nextTemp = curr2.next
    curr2.next = prev
    prev = curr2
    curr2 = nextTemp
  }

  // 递归处理剩余链表
  head.next = reverseKGroup(curr2, k)

  // prev现在是新头节点
  return prev
}
