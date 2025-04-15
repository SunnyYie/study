/**
 * 将字符串的首字母转为大写
 * @param str 要处理的字符串
 * @returns 处理后的字符串
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 将字符串转为驼峰式命名
 * @param str 要处理的字符串
 * @returns 处理后的字符串
 */
export function toCamelCase(str: string): string {
  return str.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/^([A-Z])/, m => m.toLowerCase())
}

/**
 * 将字符串转为短横线命名
 * @param str 要处理的字符串
 * @returns 处理后的字符串
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}
