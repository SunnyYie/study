/**
 * 移除数组中的假值（false, null, 0, "", undefined, NaN）
 * @param arr 要处理的数组
 * @returns 处理后的数组
 */
export function compact<T>(arr: T[]): T[] {
  return arr.filter(Boolean)
}

/**
 * 移除数组中的指定值
 * @param arr 要处理的数组
 * @param values 要移除的值
 * @returns 处理后的数组
 */
export function without<T>(arr: T[], ...values: T[]): T[] {
  return arr.filter(item => !values.includes(item))
}

/**
 * 获取数组中满足条件的第一个元素
 * @param arr 要处理的数组
 * @param predicate 判断函数
 * @returns 找到的元素或undefined
 */
export function findWhere<T>(arr: T[], predicate: (item: T) => boolean): T | undefined {
  return arr.find(predicate)
}
