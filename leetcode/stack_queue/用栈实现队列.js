// 用栈实现队列
// push(x) -- 将一个元素放入队列的尾部。
// pop() -- 从队列首部移除元素。
// peek() -- 返回队列首部的元素。
// empty() -- 返回队列是否为空。

function Queue() {
  this.stack1 = []
  this.stack2 = []
}

Queue.prototype.push = function (x) {
  this.stack1.push(x)
}

Queue.prototype.pop = function () {
  if (this.stack2.length === 0) {
    while (this.stack1.length) {
      this.stack2.push(this.stack1.pop())
    }
  }

  return this.stack2.pop()
}

Queue.prototype.peek = function () {
  if (this.stack2.length === 0) {
    while (this.stack1.length) {
      this.stack2.push(this.stack1.pop())
    }
  }
  return this.stack2[this.stack2.length - 1]
}

Queue.prototype.empty = function () {
  return this.stack1.length === 0 && this.stack2.length === 0
}
