import { compact, without, findWhere } from '../src/filter'
import { describe, it, expect } from 'vitest'

describe('array filter functions', () => {
  describe('compact', () => {
    it('should remove falsy values from an array', () => {
      const input = [0, 1, false, 2, '', 3, null, undefined, NaN]
      const expected = [1, 2, 3]
      expect(compact(input)).toEqual(expected)
    })

    it('should return an empty array if all values are falsy', () => {
      const input = [false, null, 0, '', undefined, NaN]
      expect(compact(input)).toEqual([])
    })

    it('should return the original array if no falsy values', () => {
      const input = [1, 2, 3]
      expect(compact(input)).toEqual(input)
    })
  })

  describe('without', () => {
    it('should remove specified values from an array', () => {
      const input = [1, 2, 3, 1, 2, 3]
      expect(without(input, 1)).toEqual([2, 3, 2, 3])
      expect(without(input, 1, 2)).toEqual([3, 3])
      expect(without(input, 1, 2, 3)).toEqual([])
    })

    it('should return the original array if none of the values to exclude are present', () => {
      const input = [1, 2, 3]
      expect(without(input, 4, 5, 6)).toEqual(input)
    })

    it('should handle empty array', () => {
      expect(without([], 1, 2, 3)).toEqual([])
    })
  })

  describe('findWhere', () => {
    it('should find the first element that matches the predicate', () => {
      const input = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'John' },
      ]

      expect(findWhere(input, item => item.name === 'John')).toEqual({ id: 1, name: 'John' })
      expect(findWhere(input, item => item.id > 2)).toEqual({ id: 3, name: 'John' })
    })

    it('should return undefined if no element matches the predicate', () => {
      const input = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ]

      expect(findWhere(input, item => item.id > 10)).toBeUndefined()
      expect(findWhere(input, item => item.name === 'Bob')).toBeUndefined()
    })

    it('should handle empty array', () => {
      expect(findWhere([], item => true)).toBeUndefined()
    })
  })
})
