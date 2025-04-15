import { truncate, truncateByByte } from '../src/truncate'
import { describe, it, expect } from 'vitest'

describe('truncate functions', () => {
  describe('truncate', () => {
    it('should truncate a string if it exceeds the specified length', () => {
      expect(truncate('Hello, world!', 5)).toBe('Hello...')
      expect(truncate('Testing', 4)).toBe('Test...')
    })

    it('should not truncate if the string length is less than the specified length', () => {
      expect(truncate('Hello', 10)).toBe('Hello')
    })

    it('should handle empty string', () => {
      expect(truncate('', 5)).toBe('')
    })

    it('should allow a custom suffix', () => {
      expect(truncate('Hello, world!', 5, '…')).toBe('Hello…')
      expect(truncate('Testing', 4, '---')).toBe('Test---')
    })
  })

  describe('truncateByByte', () => {
    it('should truncate a string by byte length considering multi-byte characters', () => {
      // ASCII characters are 1 byte
      expect(truncateByByte('Hello', 4)).toBe('Hell...')

      // Chinese characters are typically 2-3 bytes in UTF-8
      expect(truncateByByte('你好世界', 4)).toBe('你好...')
    })

    it('should not truncate if the byte length is less than the specified length', () => {
      expect(truncateByByte('Hi', 10)).toBe('Hi')
    })

    it('should handle empty string', () => {
      expect(truncateByByte('', 5)).toBe('')
    })

    it('should allow a custom suffix', () => {
      expect(truncateByByte('Hello, world!', 5, '…')).toBe('Hello…')
      expect(truncateByByte('你好世界', 4, '---')).toBe('你好---')
    })
  })
})
