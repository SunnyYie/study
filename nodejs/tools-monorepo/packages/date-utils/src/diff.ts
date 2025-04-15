/**
 * 计算两个日期之间的天数差
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @returns 天数差（正数或负数）
 */
export function diffInDays(date1: Date | number, date2: Date | number): number {
  const d1 = date1 instanceof Date ? date1 : new Date(date1)
  const d2 = date2 instanceof Date ? date2 : new Date(date2)

  // 清除时分秒毫秒，只计算日期
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate())
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate())

  const MS_PER_DAY = 1000 * 60 * 60 * 24
  return Math.floor((utc2 - utc1) / MS_PER_DAY)
}

/**
 * 计算两个日期之间的月数差
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @returns 月数差（正数或负数）
 */
export function diffInMonths(date1: Date | number, date2: Date | number): number {
  const d1 = date1 instanceof Date ? date1 : new Date(date1)
  const d2 = date2 instanceof Date ? date2 : new Date(date2)

  const months = (d2.getFullYear() - d1.getFullYear()) * 12
  return months + (d2.getMonth() - d1.getMonth())
}

/**
 * 计算两个日期之间的年数差
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @returns 年数差（正数或负数）
 */
export function diffInYears(date1: Date | number, date2: Date | number): number {
  const d1 = date1 instanceof Date ? date1 : new Date(date1)
  const d2 = date2 instanceof Date ? date2 : new Date(date2)

  return d2.getFullYear() - d1.getFullYear()
}

/**
 * 计算两个日期之间的详细差值
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @returns 包含年、月、日、时、分、秒差值的对象
 */
export function diffDetail(
  date1: Date | number,
  date2: Date | number,
): {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const d1 = date1 instanceof Date ? date1 : new Date(date1)
  const d2 = date2 instanceof Date ? date2 : new Date(date2)

  let years = d2.getFullYear() - d1.getFullYear()
  let months = d2.getMonth() - d1.getMonth()
  let days = d2.getDate() - d1.getDate()
  let hours = d2.getHours() - d1.getHours()
  let minutes = d2.getMinutes() - d1.getMinutes()
  let seconds = d2.getSeconds() - d1.getSeconds()

  // 处理进位
  if (seconds < 0) {
    seconds += 60
    minutes--
  }

  if (minutes < 0) {
    minutes += 60
    hours--
  }

  if (hours < 0) {
    hours += 24
    days--
  }

  if (days < 0) {
    // 获取上个月的最后一天
    const lastMonth = new Date(d2.getFullYear(), d2.getMonth(), 0)
    days += lastMonth.getDate()
    months--
  }

  if (months < 0) {
    months += 12
    years--
  }

  return { years, months, days, hours, minutes, seconds }
}
