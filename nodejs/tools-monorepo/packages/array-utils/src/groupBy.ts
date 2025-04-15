/**
 * 根据指定的属性对数组进行分组
 * @param arr 要处理的数组
 * @param key 用于分组的对象属性
 * @returns 分组后的对象
 */
export function groupBy<T extends Record<string, any>>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((result, item) => {
    const groupKey = String(item[key])
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {} as Record<string, T[]>)
}

/**
 * 根据指定的条件函数对数组进行分组
 * @param arr 要处理的数组
 * @param fn 用于分组的函数
 * @returns 分组后的对象
 */
export function groupByFn<T>(arr: T[], fn: (item: T) => string): Record<string, T[]> {
  return arr.reduce((result, item) => {
    const groupKey = fn(item)
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {} as Record<string, T[]>)
}

/**
 * 将数组按指定大小分割成多个数组
 * @param arr 要处理的数组
 * @param size 每个分组的大小
 * @returns 分割后的数组
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return [arr]

  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}
