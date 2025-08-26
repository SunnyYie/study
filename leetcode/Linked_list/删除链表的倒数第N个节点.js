// 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

const func = (head, n) => {
  let fast = head
  for (let i = 0; i < n; i++) {
    fast = fast.next
  }
  if (!fast) return head.next
  let slow = head
  while (fast.next) {
    fast = fast.next
    slow = slow.next
  }
  slow.next = slow.next.next
  return head
}
