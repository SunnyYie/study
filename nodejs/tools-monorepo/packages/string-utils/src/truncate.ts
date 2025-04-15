/**
 * 截断字符串并添加省略号
 * @param str 要处理的字符串
 * @param length 截断长度
 * @param suffix 后缀，默认为'...'
 * @returns 处理后的字符串
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (!str || str.length <= length) return str
  return str.slice(0, length) + suffix
}

/**
 * 按字节长度截断字符串（处理中日韩等双字节字符）
 * @param str 要处理的字符串
 * @param byteLength 字节长度
 * @param suffix 后缀，默认为'...'
 * @returns 处理后的字符串
 */
export function truncateByByte(str: string, byteLength: number, suffix: string = '...'): string {
  if (!str) return ''

  let len = 0
  let index = 0

  for (let i = 0; i < str.length; i++) {
    // 中文和其他全角字符算2个字节
    len += str.charCodeAt(i) > 255 ? 2 : 1
    if (len > byteLength) {
      index = i
      break
    }
  }

  if (index === 0) return str
  return str.slice(0, index) + suffix
}
