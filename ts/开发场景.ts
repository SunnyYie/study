type TypeFilter<T, U> = T extends U ? T : never

const typeFilter1: TypeFilter<string | number | boolean, string | number> = 'hello'
const typeFilter2: TypeFilter<string | number | boolean, string | number> = 123
// const typeFilter3: TypeFilter<string | number | boolean, string | number> = true // 报错

// 可选属性：{} extends { optionalKey?: number } → true → 返回键名
// 必需属性：{} extends { requiredKey: string } → false → 返回 never
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

interface Sample {
  requiredKey: string
  optionalKey?: number
  test?: boolean
}
const optionalKey: OptionalKeys<Sample> = 'optionalKey'
const test: OptionalKeys<Sample> = 'test'
// const optionalKey2: OptionalKeys<Sample> = 'requiredKey' // 报错