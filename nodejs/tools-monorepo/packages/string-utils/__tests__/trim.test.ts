import { trimAll } from '../src/trim'
import { describe, it, expect } from 'vitest'

describe('trim functions', () => {
  describe('trimAll', () => {
    it('should remove all whitespace from a string', () => {
      expect(trimAll('  hello  world  ')).toBe('helloworld')
      expect(trimAll('\t\nhello\t\nworld')).toBe('helloworld')
    })

    it('should handle empty string', () => {
      expect(trimAll('')).toBe('')
    })

    it('should handle string with only whitespace', () => {
      expect(trimAll('   \t\n')).toBe('')
    })
  })
})
