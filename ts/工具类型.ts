type MyRequired<T> = {
  // 使用 -? 移除可选修饰符
  [K in keyof T]-?: T[K]
}

type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

type MyDeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? MyDeepReadonly<T[K]> : T[K]
}

type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

type MyDeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? MyDeepPartial<T[K]> : T[K]
}

type MyMutable<T> = {
  -readonly [K in keyof T]: T[K]
}

interface Todo {
  title: string
  description?: string
  completed?: boolean
}

const obj: MyRequired<Todo> = {
  title: 'Learn TypeScript',
  description: 'Learn TypeScript',
  completed: false,
}

// Exclude：将联合类型 T 中可以赋值给联合类型 U 的那些类型成员排除掉，留下来不能赋值给 U 的类型成员
type MyExclude<T, U> = T extends U ? never : T

const str: MyExclude<'a' | 'b' | 'c', 'a' | 'c'> = 'b'

type MyOmit<T, K extends keyof T> = {
  [P in MyExclude<keyof T, K>]: T[P]
}

const todo: MyOmit<Todo, 'description'> = {
  title: 'Learn TypeScript',
  completed: false,
}

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

const todo2: MyPick<Todo, 'title' | 'completed'> = {
  title: 'Learn TypeScript',
  completed: false,
}

// Extract：将联合类型 T 中可以赋值给联合类型 U 的那些类型成员提取出来，留下来能赋值给 U 的类型成员
type MyExtract<T, U> = T extends U ? T : never

const str2: MyExtract<'a' | 'b' | 'c', 'a' | 'c'> = 'a'
const str3: MyExtract<'a' | 'b' | 'c', 'a' | 'c'> = 'c'

type MyNonNullable<T> = T extends null | undefined ? never : T
const str4: MyNonNullable<string | number | null | undefined> = 'hello'

type MyMerge<F, S> = {
  [K in keyof F | keyof S]: K extends keyof S ? S[K] : K extends keyof F ? F[K] : never
}

const merged: MyMerge<{ a: 1; b: 2 }, { b: 3; c: 4 }> = {
  a: 1,
  b: 3,
  c: 4,
}

type MyRecord<K extends keyof any, T> = {
  [P in K]: T
}
const record: MyRecord<'a' | 'b' | 'c', number> = {
  a: 1,
  b: 2,
  c: 3,
}