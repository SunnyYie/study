interface A {
  a: number
  b: string
}

interface B {
  a: number
  b: string
  c: boolean
}

let a: A = { a: 1, b: '2' }
let b: B = { a: 1, b: '2', c: true }

// 协变：B是A的子集，不能将A赋值给B
a = b

// 逆变：函数参数可以变少但不能变多
let fn1 = (x: A) => {}
let fn2 = (x: B) => {}

fn2 = fn1
