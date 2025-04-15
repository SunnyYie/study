/**
 * 移除字符串中所有的空白字符
 * @param str 要处理的字符串
 * @returns 处理后的字符串
 */
export function trimAll(str: string): string {
  return str.replace(/\s+/g, '')
}
