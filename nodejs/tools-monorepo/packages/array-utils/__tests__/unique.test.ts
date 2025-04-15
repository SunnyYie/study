import { unique, uniqueBy, intersection } from '../src/unique'
import { describe, it, expect } from 'vitest'

describe('array unique functions', () => {
  describe('unique', () => {
    it('should remove duplicate values from an array', () => {
      const input = [1, 2, 3, 1, 2, 3]
      const expected = [1, 2, 3]
      expect(unique(input)).toEqual(expected)
    })

    it('should handle empty array', () => {
      expect(unique([])).toEqual([])
    })

    it('should handle array with no duplicates', () => {
      const input = [1, 2, 3]
      expect(unique(input)).toEqual(input)
    })

    it('should work with different types', () => {
      const input = [1, '1', true, 1, '1', true]
      const expected = [1, '1', true]
      expect(unique(input)).toEqual(expected)
    })
  })

  describe('uniqueBy', () => {
    it('should remove duplicate objects based on a specified key', () => {
      const input = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'Doe' },
        { id: 3, name: 'Jane' },
      ]

      const expectedById = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Jane' },
      ]

      const expectedByName = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 1, name: 'Doe' },
      ]

      expect(uniqueBy(input, 'id')).toEqual(expectedById)
      expect(uniqueBy(input, 'name')).toEqual(expectedByName)
    })

    it('should handle empty array', () => {
      expect(uniqueBy([], 'id')).toEqual([])
    })
  })

  describe('intersection', () => {
    it('should return the common elements between two arrays', () => {
      const arr1 = [1, 2, 3, 4]
      const arr2 = [3, 4, 5, 6]
      const expected = [3, 4]

      expect(intersection(arr1, arr2)).toEqual(expected)
    })

    it('should return an empty array if there are no common elements', () => {
      const arr1 = [1, 2]
      const arr2 = [3, 4]

      expect(intersection(arr1, arr2)).toEqual([])
    })

    it('should handle empty arrays', () => {
      expect(intersection([], [1, 2, 3])).toEqual([])
      expect(intersection([1, 2, 3], [])).toEqual([])
      expect(intersection([], [])).toEqual([])
    })

    it('should preserve the order of the first array', () => {
      const arr1 = [4, 3, 2, 1]
      const arr2 = [1, 2, 3]
      const expected = [3, 2, 1]

      expect(intersection(arr1, arr2)).toEqual(expected)
    })
  })
})
