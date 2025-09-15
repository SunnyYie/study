console.log('1. 初始 this:', this)
console.log('2. 初始 module.exports:', module.exports)
console.log('3. this === module.exports:', this === module.exports)

// 修改 this
this.fromThis = 'hello'
console.log('4. 给 this 添加属性后 this:', this)
console.log('5. 给 this 添加属性后 module.exports:', module.exports)

// 重新赋值 module.exports
module.exports = {
  success: 0,
}

console.log('6. 重新赋值后 this:', this)
console.log('7. 重新赋值后 module.exports:', module.exports)
console.log('8. 重新赋值后 this === module.exports:', this === module.exports)
