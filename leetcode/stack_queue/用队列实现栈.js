// 用队列实现栈
// ● push(x) -- 元素 x 入栈
// ● pop() -- 移除栈顶元素
// ● top() -- 获取栈顶元素
// ● empty() -- 返回栈是否为空

function Stack() {
  this.queue1 = []
  this.queue2 = []
}

Stack.prototype.push = function (x) {
  this.queue1.push(x)
}

Stack.prototype.pop = function () {
  if (this.empty()) return null
  while (this.queue1.length > 1) {
    this.queue2.push(this.queue1.shift())
  }
  const res = this.queue1.shift()
  ;[this.queue1, this.queue2] = [this.queue2, this.queue1]
  return res
}

Stack.prototype.top = function () {
  if (this.empty()) return null
  while (this.queue1.length > 1) {
    this.queue2.push(this.queue1.shift())
  }
  const res = this.queue1.shift()
  this.queue2.push(res)
  ;[this.queue1, this.queue2] = [this.queue2, this.queue1]
  return res
}

Stack.prototype.empty = function () {
  return this.queue1.length === 0
}
