// 请你设计并实现一个满足  LRU (最近最少使用) 缓存 约束的数据结构。
// 实现 LRUCache 类：
// LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存
// int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
// void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。

function LRUCache(capacity) {
  this.capacity = capacity
  this.map = new Map()
  this.keys = []
}

LRUCache.prototype.get = function (key) {
  if (this.map.has(key)) {
    this.keys.filter(item => item !== key)
    this.keys.unshift(key)
    return this.map.get(key)
  }
  return -1
}

LRUCache.prototype.put = function (key, value) {
  if (this.map.has(key)) {
    this.map.delete(key)
    this.keys.filter(item => item !== key)
  }
  this.map.set(key, value)
  this.keys.unshift(key)
  if (this.map.size > this.capacity) {
    this.map.delete(this.keys.pop())
  }
}
