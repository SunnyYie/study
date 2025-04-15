import { formatDate, getDayOfWeek, timeAgo } from '../src/format'
import { describe, it, expect } from 'vitest'

describe('date format functions', () => {
  describe('formatDate', () => {
    const testDate = new Date(2023, 0, 15, 14, 30, 45) // 2023-01-15 14:30:45

    it('should format date with default format', () => {
      expect(formatDate(testDate)).toBe('2023-01-15')
    })

    it('should format date with custom format', () => {
      expect(formatDate(testDate, 'YYYY/MM/DD')).toBe('2023/01/15')
      expect(formatDate(testDate, 'YYYY年MM月DD日')).toBe('2023年01月15日')
      expect(formatDate(testDate, 'YYYY-MM-DD HH:mm:ss')).toBe('2023-01-15 14:30:45')
    })

    it('should handle timestamp input', () => {
      const timestamp = testDate.getTime()
      expect(formatDate(timestamp, 'YYYY-MM-DD')).toBe('2023-01-15')
    })

    it('should throw error for invalid date', () => {
      expect(() => formatDate(new Date('invalid date'))).toThrow('Invalid date')
    })
  })

  describe('getDayOfWeek', () => {
    const sunday = new Date(2023, 0, 15) // 2023-01-15 is a Sunday
    const monday = new Date(2023, 0, 16) // 2023-01-16 is a Monday

    it('should return day of week in Chinese by default', () => {
      expect(getDayOfWeek(sunday)).toBe('星期日')
      expect(getDayOfWeek(monday)).toBe('星期一')
    })

    it('should return day of week in different locales', () => {
      expect(getDayOfWeek(sunday, { locale: 'en-US' })).toBe('Sunday')
      expect(getDayOfWeek(monday, { locale: 'en-US' })).toBe('Monday')
    })

    it('should return day of week in different formats', () => {
      expect(getDayOfWeek(sunday, { format: 'short' })).toBe('周日')
      expect(getDayOfWeek(monday, { format: 'short' })).toBe('周一')

      expect(getDayOfWeek(sunday, { format: 'narrow' })).toBe('日')
      expect(getDayOfWeek(monday, { format: 'narrow' })).toBe('一')
    })
  })

  describe('timeAgo', () => {
    it('should return 刚刚 for times less than 60 seconds ago', () => {
      const now = new Date()
      const justNow = new Date(now.getTime() - 30 * 1000) // 30 seconds ago
      expect(timeAgo(justNow, now)).toBe('刚刚')
    })

    it('should return X分钟前 for times less than an hour ago', () => {
      const now = new Date()
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
      expect(timeAgo(fiveMinutesAgo, now)).toBe('5分钟前')
    })

    it('should return X小时前 for times less than a day ago', () => {
      const now = new Date()
      const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000)
      expect(timeAgo(threeHoursAgo, now)).toBe('3小时前')
    })

    it('should return X天前 for times less than a month ago', () => {
      const now = new Date()
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
      expect(timeAgo(tenDaysAgo, now)).toBe('10天前')
    })

    it('should return X个月前 for times less than a year ago', () => {
      const now = new Date()
      const sixMonthsAgo = new Date(now)
      sixMonthsAgo.setMonth(now.getMonth() - 6)
      expect(timeAgo(sixMonthsAgo, now)).toBe('6个月前')
    })

    it('should return X年前 for times more than a year ago', () => {
      const now = new Date()
      const twoYearsAgo = new Date(now)
      twoYearsAgo.setFullYear(now.getFullYear() - 2)
      expect(timeAgo(twoYearsAgo, now)).toBe('2年前')
    })

    it('should handle future dates', () => {
      const now = new Date()
      const future = new Date(now.getTime() + 1000)
      expect(timeAgo(future, now)).toBe('刚刚')
    })
  })
})
