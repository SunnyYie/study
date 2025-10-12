function findId(): number[]
function findId(id: number): number
function findId(id?: number): number | number[] {
  if (id) return [1, 2, 3]
  return 1
}

console.log(findId(1))
console.log(findId())

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

console.log(getProperty({ a: 1, b: false }, 'a'))

// OptionalKeys
type TestOptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

interface TestOptional {
  test1: string
  test2?: number
}

const obj1: TestOptionalKeys<TestOptional> = 'test2'

// TypeFilter
type TestTypeFilter<T, U> = T extends U ? T : never
const test1: TestTypeFilter<'a' | 'b', 'a'> = 'a'

// 元组
type TestPush<T extends any[], U> = [...T, U]
const test2: TestPush<['a'], 2> = ['a', 2]
type TestUnshift<T extends any[], U> = [U, ...T]
type TestPop<T extends any[]> = T extends [...infer Rest, any] ? Rest : never
const test3: TestPop<['a', 2]> = ['a']
type TestShift<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never

// TupleToUnion
type TestTupleToUnion<T extends any[]> = T[number]
const test4: TestTupleToUnion<['a', 2]> = 'a'
const test5: TestTupleToUnion<['a', 2]> = 2

// UnionToIntersection
type TestUnionToIntersection<U> = (U extends any ? (args: U) => any : never) extends (args: infer U) => any ? U : never
const test6: TestUnionToIntersection<{ a: 1 } | { b: 2 }> = {
  a: 1,
  b: 2,
}

// LastOfUnion
type TestLastOfUnion<U> = TestUnionToIntersection<U extends any ? (x: U) => void : never> extends (x: infer R) => void
  ? R
  : never
const test7: TestLastOfUnion<{ a: 1 } | { b: 2 }> = {
  b: 2,
}

// Parameters
type TestParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never
const a: TestParameters<(a: number) => void> = [1]

// ReturnType
type TestReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer P ? P : never
const b: TestReturnType<(a: number) => number> = 2

// FirstParameter
type TestFirstParameter<T extends (...args: any) => any> = T extends (first: infer P, ...args: any) => any ? P : never
const c: TestFirstParameter<(a: number) => number> = 2

// LastParameter
type TestLastParameter<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P extends [...args: any, last: infer R]
    ? R
    : never
  : never
const d: TestLastParameter<(a: number, b: string) => number> = ''

type MyRequired<T> = {
  [K in keyof T]-?: T[K]
}

type MyPartial<T> = {
  [K in keyof T]?: T[K]
}
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}
type MyMutable<T> = {
  -readonly [K in keyof T]: T[K]
}
type MyDeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? MyDeepReadonly<T[K]> : T[K]
}
type MyDeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? MyDeepPartial<T[K]> : T[K]
}

type MyExclude<T, U> = T extends U ? never : T
type MyExtract<T, U> = T extends U ? T : never

type MyNonNullable<T> = T extends null | undefined ? never : T

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
type MyOmit<T, K extends keyof T> = {
  [P in MyExclude<keyof T, K>]: T[P]
}

type Merge<T, U> = {
  [P in keyof T | keyof U]: P extends keyof U ? U[P] : P extends keyof T ? T[P] : never
}
