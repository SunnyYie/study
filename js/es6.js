// 链式调用
function chain (value) {
  const obj = {
    value,
    add (num) {
      this.value += num
      return this
    },
    multiply (num) {
      this.value *= num
      return this
    },
    subtract (num) {
      this.value -= num
      return this
    }
  }
  return obj
}

function add (a, b) {
  return a + b
}

function multiply (a, b) {
  return a * b
}

function subtract (a, b) {
  return a - b
}

const res = chain(add(2, 3).multiply(5).subtract(4))