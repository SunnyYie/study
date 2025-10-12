// 提取函数类型 T 的参数类型并形成元组
type MYParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never

const params: MYParameters<(a: number, b: string) => void> = [1, '2']

// 提取函数类型 T 的返回值类型
type MYReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any

const returnType: MYReturnType<() => string> = 'hello'

// 提取函数的第一个参数类型
type MyFirstParameter<T extends (...args: any) => any> = T extends (arg1: infer P, ...args: any) => any ? P : never

const firstParam: MyFirstParameter<(a: number, b: string) => void> = 1

// 提取函数的最后一个参数类型
type MyLastParameter<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P extends [...args: any, infer L]
    ? L
    : never
  : never
const lastParam: MyLastParameter<(a: number, b: string, c: boolean) => void> = true

