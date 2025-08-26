//  给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。

const func = head => {
  let slow = head
  let fast = head
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) {
      let entry = head
      while (entry !== slow) {
        entry = entry.next
        slow = slow.next
      }
      return entry
    }
  }
  return null
}
