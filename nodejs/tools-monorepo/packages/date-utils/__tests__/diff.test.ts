import { diffInDays, diffInMonths, diffInYears, diffDetail } from '../src/diff'
import { describe, it, expect } from 'vitest'

describe('date diff functions', () => {
  describe('diffInDays', () => {
    it('should calculate days between two dates', () => {
      const start = new Date(2023, 0, 1) // 2023-01-01
      const end = new Date(2023, 0, 10) // 2023-01-10

      expect(diffInDays(start, end)).toBe(9)
      expect(diffInDays(end, start)).toBe(-9)
    })

    it('should handle same day', () => {
      const date1 = new Date(2023, 0, 1, 10, 0, 0) // 2023-01-01 10:00:00
      const date2 = new Date(2023, 0, 1, 18, 0, 0) // 2023-01-01 18:00:00

      expect(diffInDays(date1, date2)).toBe(0)
    })

    it('should handle month boundaries', () => {
      const start = new Date(2023, 0, 31) // 2023-01-31
      const end = new Date(2023, 1, 1) // 2023-02-01

      expect(diffInDays(start, end)).toBe(1)
    })

    it('should handle leap years', () => {
      const start = new Date(2020, 1, 28) // 2020-02-28
      const end = new Date(2020, 2, 1) // 2020-03-01

      expect(diffInDays(start, end)).toBe(2) // Leap year, so Feb 29 is in between
    })
  })

  describe('diffInMonths', () => {
    it('should calculate months between two dates', () => {
      const start = new Date(2023, 0, 15) // 2023-01-15
      const end = new Date(2023, 5, 10) // 2023-06-10

      expect(diffInMonths(start, end)).toBe(5)
      expect(diffInMonths(end, start)).toBe(-5)
    })

    it('should handle same month', () => {
      const date1 = new Date(2023, 0, 1) // 2023-01-01
      const date2 = new Date(2023, 0, 31) // 2023-01-31

      expect(diffInMonths(date1, date2)).toBe(0)
    })

    it('should handle year boundaries', () => {
      const start = new Date(2022, 11, 15) // 2022-12-15
      const end = new Date(2023, 1, 15) // 2023-02-15

      expect(diffInMonths(start, end)).toBe(2)
    })
  })

  describe('diffInYears', () => {
    it('should calculate years between two dates', () => {
      const start = new Date(2020, 5, 15) // 2020-06-15
      const end = new Date(2023, 2, 10) // 2023-03-10

      expect(diffInYears(start, end)).toBe(3)
      expect(diffInYears(end, start)).toBe(-3)
    })

    it('should handle same year', () => {
      const date1 = new Date(2023, 0, 1) // 2023-01-01
      const date2 = new Date(2023, 11, 31) // 2023-12-31

      expect(diffInYears(date1, date2)).toBe(0)
    })

    it('should not consider month and day', () => {
      const start = new Date(2020, 11, 31) // 2020-12-31
      const end = new Date(2021, 0, 1) // 2021-01-01

      expect(diffInYears(start, end)).toBe(1) // Just one day apart but different years
    })
  })

  describe('diffDetail', () => {
    it('should calculate detailed difference between two dates', () => {
      const start = new Date(2020, 1, 1, 10, 30, 45) // 2020-02-01 10:30:45
      const end = new Date(2023, 5, 15, 14, 20, 30) // 2023-06-15 14:20:30

      const diff = diffDetail(start, end)

      expect(diff.years).toBe(3)
      expect(diff.months).toBe(4)
      expect(diff.days).toBe(14)
      expect(diff.hours).toBe(3)
      expect(diff.minutes).toBe(49)
      expect(diff.seconds).toBe(45)
    })

    it('should handle cases requiring borrowing', () => {
      const start = new Date(2023, 0, 31, 23, 45, 30) // 2023-01-31 23:45:30
      const end = new Date(2023, 1, 1, 0, 30, 15) // 2023-02-01 00:30:15

      const diff = diffDetail(start, end)

      expect(diff.years).toBe(0)
      expect(diff.months).toBe(0)
      expect(diff.days).toBe(0)
      expect(diff.hours).toBe(0)
      expect(diff.minutes).toBe(44)
      expect(diff.seconds).toBe(45)
    })

    it('should handle dates in reverse order', () => {
      const start = new Date(2023, 5, 15) // 2023-06-15
      const end = new Date(2023, 2, 10) // 2023-03-10

      const diff = diffDetail(start, end)

      // The actual values may vary depending on implementation
      expect(diff.years).toBe(0)
      expect(diff.months).toBe(-3)
      expect(diff.days).toBe(-5)
    })
  })
})
