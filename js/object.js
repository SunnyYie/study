// instanceof

// new
function myNew(constructor, ...args) {
  if (typeof constructor !== 'function') { throw new Error('Invalid constructor'); }
  const obj = Object.create(constructor.prototype);
  const result = constructor.apply(obj, args);
  return (typeof result === 'object' && result !== null) ? result : obj;
}

// object.create
function myObjectCreate(proto) {
  function F() { }
  F.prototype = proto;
  const obj = new F();
  return obj;
}

// 遍历
function Parent() {
  this.name = 'parent'
  this.a = 'a'
  this.b = 'b'
  this.c = 'c'
}
function Child() {
  const symbol = Symbol('type')
  this[symbol] = 'child'
  this.type = 'child'
  this.logger = function () {
    console.log(this.name)
  }
}
Child.prototype = new Parent()
const child = new Child()

const objectForEach = (function () {
  // 1.for...in 会遍历原型链上的属性，不会遍历 Symbol 属性
  for (const key in child) {
    console.log(key) // name a b c type logger
  }
  // 2.Object.keys() 不会遍历原型链上的属性，不会遍历 Symbol 属性
  console.log(Object.keys(child)) // [ 'type', 'logger' ]

  // 3.Object.getOwnPropertyNames() 不会遍历原型链上的属性，不会遍历 Symbol 属性
  console.log(Object.getOwnPropertyNames(child)) // [ 'type', 'logger' ]

  // 4.Object.getOwnPropertySymbols() 不会遍历原型链上的属性，只会遍历 Symbol 属性
  console.log(Object.getOwnPropertySymbols(child)) // [ Symbol(type) ]

  // 5.Reflect.ownKeys() 不会遍历原型链上的属性，会遍历 Symbol 属性
  console.log(Reflect.ownKeys(child)) // [ 'type', 'logger', Symbol(type) ]
})()

// 检查对象是否包含某个属性
const objectHasOwn = (function () {
  // 1.in 会检查原型链上的属性
  console.log('name' in child) // true
  console.log('type' in child) // true
  // 2.Object.hasOwn() 不会检查原型链上的属性
  console.log(Object.hasOwn(child, 'name')) // false
  console.log(Object.hasOwn(child, 'type')) // true
  // 3.hasOwnProperty() 不会检查原型链上的属性
  console.log(child.hasOwnProperty('name')) // false
  console.log(child.hasOwnProperty('type')) // true
  // 4.Reflect.has() 会检查原型链上的属性
  console.log(Reflect.has(child, 'name')) // true
  console.log(Reflect.has(child, 'type')) // true
  // 5.Object.getOwnPropertyDescriptor() 不会检查原型链上的属性
  console.log(Object.getOwnPropertyDescriptor(child, 'name')) // undefined
  console.log(Object.getOwnPropertyDescriptor(child, 'type')) // { value: 'child', writable: true, enumerable: true, configurable: true }
  // 6.Object.prototype.hasOwnProperty.call() 不会检查原型链上的属性
  console.log(Object.prototype.hasOwnProperty.call(child, 'name')) // false
  console.log(Object.prototype.hasOwnProperty.call(child, 'type')) // true
})()