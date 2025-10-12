// 实现Object.create
const myObjectCreate = (proto) => {
  function F() { }
  F.prototype = proto
  return new F()
}

// 实现new
function myNew(constructor, ...args) {
  const result = Object.create(constructor.prototype)
  const res = constructor.apply(result, args)
  return typeof res === 'object' && res !== null ? res : result
}

function Animal(name) {
  this.name = name
  this.sleep = function () {
    console.log(this.name + '正在睡觉')
  }
}

Animal.prototype.eat = function (food) {
  console.log(this.name + '正在吃' + food)
}

function Dog(name, age) {
  Animal.call(this, name) // 继承属性
  this.age = age
}

// 继承原型的方法
Dog.prototype = myObjectCreate(Animal.prototype)
Dog.prototype.constructor = Dog 

const dog = myNew(Dog, '旺财', 3)
console.log(dog) // Dog { name: '旺财', sleep: [Function (anonymous)], age: 3 }

dog.eat('骨头')