import { groupBy, groupByFn, chunk } from '../src/groupBy'
import { describe, it, expect } from 'vitest'

describe('array groupBy functions', () => {
  describe('groupBy', () => {
    it('should group array objects by a specified key', () => {
      const input = [
        { id: 1, type: 'A', name: 'Item 1' },
        { id: 2, type: 'B', name: 'Item 2' },
        { id: 3, type: 'A', name: 'Item 3' },
        { id: 4, type: 'C', name: 'Item 4' },
        { id: 5, type: 'B', name: 'Item 5' },
      ]

      const expected = {
        A: [
          { id: 1, type: 'A', name: 'Item 1' },
          { id: 3, type: 'A', name: 'Item 3' },
        ],
        B: [
          { id: 2, type: 'B', name: 'Item 2' },
          { id: 5, type: 'B', name: 'Item 5' },
        ],
        C: [{ id: 4, type: 'C', name: 'Item 4' }],
      }

      expect(groupBy(input, 'type')).toEqual(expected)
    })

    it('should handle empty array', () => {
      expect(groupBy([], 'id')).toEqual({})
    })

    it('should handle array with non-string keys by converting them to strings', () => {
      const input = [
        { id: 1, score: 100 },
        { id: 2, score: 200 },
        { id: 3, score: 100 },
      ]

      const expected = {
        '100': [
          { id: 1, score: 100 },
          { id: 3, score: 100 },
        ],
        '200': [{ id: 2, score: 200 }],
      }

      expect(groupBy(input, 'score')).toEqual(expected)
    })
  })

  describe('groupByFn', () => {
    it('should group array items using a custom function', () => {
      const input = [1, 2, 3, 4, 5, 6]

      const expected = {
        even: [2, 4, 6],
        odd: [1, 3, 5],
      }

      expect(groupByFn(input, item => (item % 2 === 0 ? 'even' : 'odd'))).toEqual(expected)
    })

    it('should handle complex objects with custom grouping logic', () => {
      const input = [
        { id: 1, score: 85 },
        { id: 2, score: 65 },
        { id: 3, score: 92 },
        { id: 4, score: 75 },
      ]

      const expected = {
        A: [
          { id: 1, score: 85 },
          { id: 3, score: 92 },
        ],
        B: [{ id: 4, score: 75 }],
        C: [{ id: 2, score: 65 }],
      }

      const gradeFn = (item: (typeof input)[0]) => {
        if (item.score >= 80) return 'A'
        if (item.score >= 70) return 'B'
        return 'C'
      }

      expect(groupByFn(input, gradeFn)).toEqual(expected)
    })

    it('should handle empty array', () => {
      expect(groupByFn([], () => 'group')).toEqual({})
    })
  })

  describe('chunk', () => {
    it('should split array into chunks of specified size', () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

      expect(chunk(input, 3)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]])
      expect(chunk(input, 2)).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
        [7, 8],
        [9, 10],
      ])
      expect(chunk(input, 5)).toEqual([
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
      ])
    })

    it('should return original array as single chunk if size is greater than array length', () => {
      const input = [1, 2, 3, 4, 5]
      expect(chunk(input, 10)).toEqual([[1, 2, 3, 4, 5]])
    })

    it('should handle empty array', () => {
      expect(chunk([], 3)).toEqual([])
    })

    it('should return original array as single chunk if size is zero or negative', () => {
      const input = [1, 2, 3, 4, 5]
      expect(chunk(input, 0)).toEqual([[1, 2, 3, 4, 5]])
      expect(chunk(input, -1)).toEqual([[1, 2, 3, 4, 5]])
    })
  })
})
