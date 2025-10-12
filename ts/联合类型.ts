type MyTupleToUnion<T extends any[]> = T[number]

const tupleToUnion: MyTupleToUnion<['a', 2, false]> = 'a'
const tupleToUnion2: MyTupleToUnion<['a', 2, false]> = 2
const tupleToUnion3: MyTupleToUnion<['a', 2, false]> = false

// 联合类型转交叉类型（函数参数的逆变性）
// 当多个函数类型形成联合类型时，TypeScript 需要推断一个统一的参数类型 R，使得这个类型能够接受所有可能的参数。
// 对于函数参数位置，TypeScript 会寻找一个超类型来满足所有可能的输入，但在这种特殊的推断场景下，为了让函数能够安全地接受所有联合类型的成员，TypeScript 会推断出交叉类型
type MyUnionToIntersection<U> = (U extends any ? (x: U) => any : never) extends (x: infer R) => any ? R : never

const unionToIntersection: MyUnionToIntersection<{ a: 1 } | { b: 2 } | { c: 3 }> = { a: 1, b: 2, c: 3 }

// 从联合类型 U 中提取最后一个成员
type MyGetUnionLast<U> = MyUnionToIntersection<U extends any ? (x: U) => void : never> extends (x: infer R) => void
  ? R
  : never

/**
 * MyGetUnionLast 实现原理：
 * 1. U extends any ? (x: U) => void : never
 *    - 将联合类型的每个成员转换为参数类型的函数
 *    - 'a' | 'b' | 'c' → ((x: 'a') => void) | ((x: 'b') => void) | ((x: 'c') => void)
 *
 * 2. MyUnionToIntersection<...>
 *    - 将函数联合类型转换为交叉类型
 *    - ((x: 'a') => void) | ((x: 'b') => void) | ((x: 'c') => void) →
 *      ((x: 'a') => void) & ((x: 'b') => void) & ((x: 'c') => void)
 *
 * 3. ... extends (x: infer R) => void ? R : never
 *    - 由于函数参数的逆变性，TypeScript 会推断出最后一个类型
 *    - 在交叉类型的参数位置，会保留最后一个类型
 */
const getUnionLast1: MyGetUnionLast<'a' | 'b' | 'c'> = 'c'
const getUnionLast2: MyGetUnionLast<number | string | boolean> = true // 最后一个是 boolean
