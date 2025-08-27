// 给你链表的头结点 head ，请将其按 升序 排列并返回 排序后的链表 。

var sortList = function (head) {
  if (!head || !head.next) return head

  // 1. 找到链表中点
  let slow = head
  let fast = head
  let prev = null

  while (fast && fast.next) {
    prev = slow
    slow = slow.next
    fast = fast.next.next
  }

  // 断开链表
  if (prev) {
    prev.next = null
  }

  // 2. 递归排序左右两部分
  const left = sortList(head)
  const right = sortList(slow)

  // 3. 合并两个有序链表
  return merge(left, right)
}

// 合并两个有序链表
function merge(l1, l2) {
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

  // 连接剩余部分
  if (l1) {
    current.next = l1
  } else {
    current.next = l2
  }

  return dummy.next
}
