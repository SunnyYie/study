// map
const arrayMap = (arr, mapper) => {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    result.push(mapper(arr[i], i, arr))
  }
  return result
}

// reduce
const arrayReduce = (arr, reducer, initialValue) => {
  let acc = initialValue === undefined ? arr[0] : initialValue
  const startIndex = initialValue === undefined ? 1 : 0
  for (let i = startIndex; i < arr.length; i++) {
    acc = reducer(acc, arr[i], i, arr)
  }
  return acc
}

const arr = [1, 2, 3, 4]
console.log(arrayReduce(arr, (acc, cur) => acc + cur, 0)) // 10

// flatten
const arrayFlatten = arr => {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}

const arrayFlat = arr => {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (Array.isArray(item)) {
      result.push(...arrayFlat(item))
    } else {
      result.push(item)
    }
  }
  return result
}

// 去重
const arrayUnique = arr => [...new Set(arr)]

// from
const arrayFrom = (arrLike, factory) => {
  if (typeof arrLike[Symbol.iterator] === 'function') {
    const arr = []
    for (const item of arrLike) {
      arr.push(factory ? factory(item) : item)
    }
    return arr
  }
  if (typeof arrLike.length === 'number') {
    const arr = []
    for (let i = 0; i < arrLike.length; i++) {
      arr.push(factory ? factory(arrLike[i]) : arrLike[i])
    }
    return arr
  }
}

// every
const arrayEvery = (arr, predicate) => {
  for (let i = 0; i < arr.length; i++) {
    if (!predicate(arr[i], i, arr)) {
      return false
    }
  }
  return true
}

// find
const arrayFind = (arr, predicate) => {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i, arr)) {
      return arr[i]
    }
  }
  return undefined
}
