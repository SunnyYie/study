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

// flatten
const arrayFlatten = (arr) => {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}

const arrayFlat = (arr) => {
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

// from
const arrayFrom = (arrLike, factory) => {
  if (arrLike == null) throw new Error('arrLike is null or undefined')
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

// sort
const arraySort = (arr, compareFn) => {
  const len = arr.length
  // 小于20使用插入排序
  if (len < 20) {
    for (let i = 1; i < len; i++) {
      const temp = arr[i]
      let comparedIndex = i - 1
      while (comparedIndex >= 0 && (compareFn ? compareFn(arr[comparedIndex], temp) > 0 : arr[comparedIndex] > temp)) {
        arr[comparedIndex + 1] = arr[comparedIndex]
        comparedIndex--
      }
      arr[comparedIndex + 1] = temp
    }
    return arr
  } else {
    // 大于等于20使用归并排序
    const merge = (left, right) => {
      const result = []
      let i = 0
      let j = 0
      while (i < left.length && j < right.length) {
        if (compareFn ? compareFn(left[i], right[j]) <= 0 : left[i] <= right[j]) {
          result.push(left[i])
          i++
        } else {
          result.push(right[j])
          j++
        }
      }
      // 拼接剩余元素
      while (i < left.length) {
        result.push(left[i])
        i++
      }
      while (j < right.length) {
        result.push(right[j])
        j++
      }
      return result
    }
    const mergeSort = array => {
      if (array.length <= 1) return array
      const mid = Math.floor(array.length / 2)
      const left = mergeSort(array.slice(0, mid))
      const right = mergeSort(array.slice(mid))
      return merge(left, right)
    }
    return mergeSort(arr)
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

// curry
const curry = (fn) => {
  let len = fn.length
  return function curried(...args) {
    if (args.length >= len) {
      return fn.apply(this, args)
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2))
      }
    }
  }
}
