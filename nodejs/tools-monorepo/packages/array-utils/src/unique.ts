/**
 * 移除数组中的重复元素
 * @param arr 要处理的数组
 * @returns 处理后的数组
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

/**
 * 根据指定的键值移除数组对象中的重复项
 * @param arr 要处理的数组
 * @param key 作为唯一标识的对象属性
 * @returns 处理后的数组
 */
export function uniqueBy<T extends Record<string, any>>(arr: T[], key: keyof T): T[] {
  const seen = new Set()
  return arr.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

/**
 * 获取两个数组的交集
 * @param arr1 第一个数组
 * @param arr2 第二个数组
 * @returns 两个数组的交集
 */
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter(item => arr2.includes(item))
}
