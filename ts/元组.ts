type MyPush<T extends any[], U> = [...T, U]

const push: MyPush<[1, 2], 3> = [1, 2, 3]

type MyUnshift<T extends any[], U> = [U, ...T]

const unshift: MyUnshift<[1, 2], 0> = [0, 1, 2]

type MyPop<T extends any[]> = T extends [...infer Rest, any] ? Rest : never

const pop: MyPop<[1, 2, 3]> = [1, 2]

type MyShift<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never

const shift: MyShift<[1, 2, 3]> = [2, 3]