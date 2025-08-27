// 给你一个链表数组，每个链表都已经按升序排列。

const func = lists => {
  if (lists.length === 0) return null
  if (lists.length === 1) return lists[0]

  const merge = (l1, l2) => {
    const dummy = new ListNode(0)
    let current = dummy
    while (l1 && l2) {
      if (l1.val < l2.val) {
        current.next = l1
        l1 = l1.next
      } else {
        current.next = l2
        l2 = l2.next
      }
      current = current.next
    }
    if (l1) {
      current.next = l1
    } else {
      current.next = l2
    }
    return dummy.next
  }

  const mid = Math.floor(lists.length / 2)
  const left = func(lists.slice(0, mid))
  const right = func(lists.slice(mid))
  return merge(left, right)
}
