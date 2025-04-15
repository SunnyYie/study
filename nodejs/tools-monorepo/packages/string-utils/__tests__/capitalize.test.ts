import { capitalize, toCamelCase, toKebabCase } from '../src/capitalize'
import { describe, it, expect } from 'vitest'

describe('capitalize functions', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalize('hello')).toBe('Hello')
      expect(capitalize('world')).toBe('World')
    })

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('')
    })

    it('should handle already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })
  })

  describe('toCamelCase', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld')
    })

    it('should convert snake_case to camelCase', () => {
      expect(toCamelCase('hello_world')).toBe('helloWorld')
    })

    it('should convert space-separated words to camelCase', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld')
    })

    it('should handle already camelCase string', () => {
      expect(toCamelCase('helloWorld')).toBe('helloWorld')
    })

    it('should handle PascalCase string', () => {
      expect(toCamelCase('HelloWorld')).toBe('helloWorld')
    })
  })

  describe('toKebabCase', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world')
    })

    it('should convert PascalCase to kebab-case', () => {
      expect(toKebabCase('HelloWorld')).toBe('hello-world')
    })

    it('should convert snake_case to kebab-case', () => {
      expect(toKebabCase('hello_world')).toBe('hello-world')
    })

    it('should convert space-separated words to kebab-case', () => {
      expect(toKebabCase('hello world')).toBe('hello-world')
    })

    it('should handle already kebab-case string', () => {
      expect(toKebabCase('hello-world')).toBe('hello-world')
    })
  })
})
