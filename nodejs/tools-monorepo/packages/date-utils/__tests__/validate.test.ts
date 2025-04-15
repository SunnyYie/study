import { isValidDate, isFutureDate, isPastDate, isToday, isDateInRange } from '../src/validate'
import { describe, it, expect } from 'vitest'

describe('date validation functions', () => {
  describe('isValidDate', () => {
    it('should return true for valid Date objects', () => {
      expect(isValidDate(new Date())).toBe(true)
      expect(isValidDate(new Date('2023-01-15'))).toBe(true)
    })

    it('should return true for valid timestamp numbers', () => {
      expect(isValidDate(Date.now())).toBe(true)
      expect(isValidDate(1672531200000)).toBe(true) // 2023-01-01
    })

    it('should return true for valid date strings', () => {
      expect(isValidDate('2023-01-15')).toBe(true)
      expect(isValidDate('2023/01/15')).toBe(true)
      expect(isValidDate('Jan 15, 2023')).toBe(true)
    })

    it('should return false for invalid Date objects', () => {
      expect(isValidDate(new Date('invalid date'))).toBe(false)
    })

    it('should return false for invalid values', () => {
      expect(isValidDate('not a date')).toBe(false)
      expect(isValidDate({})).toBe(false)
      expect(isValidDate([])).toBe(false)
      expect(isValidDate(null)).toBe(false)
      expect(isValidDate(undefined)).toBe(false)
    })
  })

  describe('isFutureDate', () => {
    it('should return true for dates in the future', () => {
      const now = new Date()
      const future = new Date(now.getTime() + 1000 * 60 * 60 * 24) // Tomorrow

      expect(isFutureDate(future, now)).toBe(true)
    })

    it('should return false for dates in the past', () => {
      const now = new Date()
      const past = new Date(now.getTime() - 1000 * 60 * 60 * 24) // Yesterday

      expect(isFutureDate(past, now)).toBe(false)
    })

    it('should return false for current date', () => {
      const now = new Date()
      expect(isFutureDate(now, now)).toBe(false)
    })

    it('should return false for invalid dates', () => {
      expect(isFutureDate(new Date('invalid date'))).toBe(false)
      // @ts-ignore
      expect(isFutureDate('not a date')).toBe(false)
    })
  })

  describe('isPastDate', () => {
    it('should return true for dates in the past', () => {
      const now = new Date()
      const past = new Date(now.getTime() - 1000 * 60 * 60 * 24) // Yesterday

      expect(isPastDate(past, now)).toBe(true)
    })

    it('should return false for dates in the future', () => {
      const now = new Date()
      const future = new Date(now.getTime() + 1000 * 60 * 60 * 24) // Tomorrow

      expect(isPastDate(future, now)).toBe(false)
    })

    it('should return false for current date', () => {
      const now = new Date()
      expect(isPastDate(now, now)).toBe(false)
    })

    it('should return false for invalid dates', () => {
      expect(isPastDate(new Date('invalid date'))).toBe(false)
      // @ts-ignore
      expect(isPastDate('not a date')).toBe(false)
    })
  })

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date()

      // Set time to different values but same day
      const morningToday = new Date(today)
      morningToday.setHours(5, 0, 0, 0)

      const eveningToday = new Date(today)
      eveningToday.setHours(20, 0, 0, 0)

      expect(isToday(today)).toBe(true)
      expect(isToday(morningToday)).toBe(true)
      expect(isToday(eveningToday)).toBe(true)
    })

    it('should return false for dates not today', () => {
      const today = new Date()

      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)

      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)

      expect(isToday(yesterday)).toBe(false)
      expect(isToday(tomorrow)).toBe(false)
    })

    it('should return false for invalid dates', () => {
      expect(isToday(new Date('invalid date'))).toBe(false)
      // @ts-ignore
      expect(isToday('not a date')).toBe(false)
    })
  })

  describe('isDateInRange', () => {
    it('should return true for dates within the range', () => {
      const start = new Date('2023-01-01')
      const end = new Date('2023-01-31')
      const middle = new Date('2023-01-15')

      expect(isDateInRange(middle, start, end)).toBe(true)
      expect(isDateInRange(start, start, end)).toBe(true) // Inclusive start
      expect(isDateInRange(end, start, end)).toBe(true) // Inclusive end
    })

    it('should return false for dates outside the range', () => {
      const start = new Date('2023-01-01')
      const end = new Date('2023-01-31')
      const before = new Date('2022-12-31')
      const after = new Date('2023-02-01')

      expect(isDateInRange(before, start, end)).toBe(false)
      expect(isDateInRange(after, start, end)).toBe(false)
    })

    it('should return false for invalid dates', () => {
      const start = new Date('2023-01-01')
      const end = new Date('2023-01-31')

      expect(isDateInRange(new Date('invalid date'), start, end)).toBe(false)
      expect(isDateInRange(start, new Date('invalid date'), end)).toBe(false)
      expect(isDateInRange(start, start, new Date('invalid date'))).toBe(false)
    })
  })
})
