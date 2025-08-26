// ● get(index)：获取链表中第 index 个节点的值。如果索引无效，则返回-1。
// ● addAtHead(val)：在链表的第一个元素之前添加一个值为 val 的节点。插入后，新节点将成为链表的第一个节点。
// ● addAtTail(val)：将值为 val 的节点追加到链表的最后一个元素。
// ● addAtIndex(index,val)：在链表中的第 index 个节点之前添加值为 val  的节点。如果 index 等于链表的长度，则该节点将附加到链表的末尾。如果 index 大于链表长度，则不会插入节点。如果index小于0，则在头部插入节点。
// ● deleteAtIndex(index)：如果索引 index 有效，则删除链表中的第 index 个节点。

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val
  this.next = next === undefined ? null : next
}

ListNode.prototype.get = function (index) {
  let cur = this
  for (let i = 0; i <= index; i++) {
    if (!cur) return -1
    if (i === index) return cur.val
    cur = cur.next
  }
  return -1
}

ListNode.prototype.addAtHead = function (val) {
  const node = new ListNode(val)
  node.next = this.next
  this.next = node
}

ListNode.prototype.addAtTail = function (val) {
  let cur = this
  while (cur.next) {
    cur = cur.next
  }
  cur.next = new ListNode(val)
}

ListNode.prototype.addAtIndex = function (index, val) {
  if (index < 0) {
    const node = new ListNode(val)
    node.next = this.next
    this.next = node
    return
  }

  let cur = this
  for (let i = 0; i <= index; i++) {
    if (i === index) {
      const node = new ListNode(val)
      node.next = cur.next
      cur.next = node
      return
    }
    if (!cur) return
    cur = cur.next
  }

  return
}

ListNode.prototype.deleteAtIndex = function (index) {
  if (index < 0) return
  let cur = this
  for (let i = 0; i < index; i++) {
    if (!cur) return
    cur = cur.next
  }
  if (!cur || !cur.next) return
  cur.next = cur.next.next
}
