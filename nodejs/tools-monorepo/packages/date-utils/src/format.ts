/**
 * 将日期格式化为指定格式的字符串
 * @param date 要格式化的日期对象或时间戳
 * @param format 格式化模板，支持以下占位符:
 *   - YYYY: 四位年份
 *   - MM: 两位月份
 *   - DD: 两位日期
 *   - HH: 两位小时（24小时制）
 *   - mm: 两位分钟
 *   - ss: 两位秒钟
 * @returns 格式化后的字符串
 */
export function formatDate(date: Date | number, format: string = 'YYYY-MM-DD'): string {
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }

  const replacements: Record<string, string> = {
    'YYYY': d.getFullYear().toString(),
    'MM': (d.getMonth() + 1).toString().padStart(2, '0'),
    'DD': d.getDate().toString().padStart(2, '0'),
    'HH': d.getHours().toString().padStart(2, '0'),
    'mm': d.getMinutes().toString().padStart(2, '0'),
    'ss': d.getSeconds().toString().padStart(2, '0')
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => replacements[match]);
}

/**
 * 获取指定日期是星期几
 * @param date 日期对象或时间戳
 * @param options 配置选项
 * @returns 星期几的字符串表示
 */
export function getDayOfWeek(
  date: Date | number,
  options: { locale?: string; format?: 'long' | 'short' | 'narrow' } = {}
): string {
  const d = date instanceof Date ? date : new Date(date);
  const { locale = 'zh-CN', format = 'long' } = options;

  return d.toLocaleDateString(locale, { weekday: format });
}

/**
 * 将指定的时间戳或日期对象转换为相对时间（如：刚刚、5分钟前等）
 * @param date 日期对象或时间戳
 * @param now 当前时间，默认为当前时间
 * @returns 相对时间字符串
 */
export function timeAgo(date: Date | number, now: Date | number = new Date()): string {
  const d = date instanceof Date ? date : new Date(date);
  const n = now instanceof Date ? now : new Date(now);

  const seconds = Math.floor((n.getTime() - d.getTime()) / 1000);

  if (seconds < 0) {
    return '刚刚';
  }

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) {
    return '刚刚';
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 30) {
    return `${days}天前`;
  } else if (months < 12) {
    return `${months}个月前`;
  } else {
    return `${years}年前`;
  }
}