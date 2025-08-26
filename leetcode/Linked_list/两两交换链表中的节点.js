// 给定一个链表，两两交换其中相邻的节点，并返回交换后的链表。

const func = head => {
  for (let p = head; p && p.next; p = p.next.next) {
    const n = p.next
    ;[p.val, n.val] = [n.val, p.val]
  }
  return head
}
