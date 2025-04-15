/**
 * 检查给定的值是否为有效的日期对象或可转换为有效日期的值
 * @param value 要检查的值
 * @returns 是否为有效日期
 */
export function isValidDate(value: any): boolean {
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  return false;
}

/**
 * 检查给定的日期是否是未来日期
 * @param date 要检查的日期
 * @param now 当前时间，默认为当前时间
 * @returns 是否为未来日期
 */
export function isFutureDate(date: Date | number, now: Date | number = new Date()): boolean {
  if (!isValidDate(date) || !isValidDate(now)) {
    return false;
  }

  const d = date instanceof Date ? date : new Date(date);
  const n = now instanceof Date ? now : new Date(now);

  return d.getTime() > n.getTime();
}

/**
 * 检查给定的日期是否是过去日期
 * @param date 要检查的日期
 * @param now 当前时间，默认为当前时间
 * @returns 是否为过去日期
 */
export function isPastDate(date: Date | number, now: Date | number = new Date()): boolean {
  if (!isValidDate(date) || !isValidDate(now)) {
    return false;
  }

  const d = date instanceof Date ? date : new Date(date);
  const n = now instanceof Date ? now : new Date(now);

  return d.getTime() < n.getTime();
}

/**
 * 检查给定的日期是否是当天
 * @param date 要检查的日期
 * @returns 是否为当天
 */
export function isToday(date: Date | number): boolean {
  if (!isValidDate(date)) {
    return false;
  }

  const d = date instanceof Date ? date : new Date(date);
  const today = new Date();

  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

/**
 * 检查日期是否在指定的范围内
 * @param date 要检查的日期
 * @param startDate 范围起始日期
 * @param endDate 范围结束日期
 * @returns 是否在范围内
 */
export function isDateInRange(
  date: Date | number,
  startDate: Date | number,
  endDate: Date | number
): boolean {
  if (!isValidDate(date) || !isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }

  const d = date instanceof Date ? date : new Date(date);
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);

  return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
}