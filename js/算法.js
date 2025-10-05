// 数组排序
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

const arraySort1 = arr => {
  const len = arr.length
  if (len < 20) {
    // 插入排序
    for (let i = 1; i < len; i++) {
      const temp = arr[i]
      let comparedIndex = i - 1
      while (comparedIndex >= 0 && arr[comparedIndex] > temp) {
        arr[comparedIndex + 1] = arr[comparedIndex]
        comparedIndex--
      }
      arr[comparedIndex + 1] = temp
    }
  } else {
    // 归并排序
    const merge = (left, right) => {
      const result = []
      let i = 0
      let j = 0
      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
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
