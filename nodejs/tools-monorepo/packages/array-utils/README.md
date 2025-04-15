# @tools/array-utils

数组处理工具函数库，提供了常用的数组操作方法。

## 安装

```bash
npm install @tools/array-utils

# 或使用 pnpm
pnpm add @tools/array-utils
```

## API 文档

### 数组过滤

#### `compact<T>(arr: T[]): T[]`

移除数组中的假值（false, null, 0, "", undefined, NaN）。

```js
import { compact } from '@tools/array-utils';

compact([0, 1, false, 2, '', 3, null, undefined, NaN]); // [1, 2, 3]
```

#### `without<T>(arr: T[], ...values: T[]): T[]`

移除数组中的指定值。

```js
import { without } from '@tools/array-utils';

without([1, 2, 3, 1, 2, 3], 1); // [2, 3, 2, 3]
without([1, 2, 3, 1, 2, 3], 1, 2); // [3, 3]
```

#### `findWhere<T>(arr: T[], predicate: (item: T) => boolean): T | undefined`

获取数组中满足条件的第一个元素。

```js
import { findWhere } from '@tools/array-utils';

const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
];

findWhere(users, user => user.id === 2); // { id: 2, name: 'Jane' }
findWhere(users, user => user.name === 'Bob'); // undefined
```

### 数组去重

#### `unique<T>(arr: T[]): T[]`

移除数组中的重复元素。

```js
import { unique } from '@tools/array-utils';

unique([1, 2, 3, 1, 2, 3]); // [1, 2, 3]
unique([1, '1', true, 1, '1', true]); // [1, '1', true]
```

#### `uniqueBy<T>(arr: T[], key: keyof T): T[]`

根据指定的键值移除数组对象中的重复项。

```js
import { uniqueBy } from '@tools/array-utils';

const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 1, name: 'Doe' }
];

uniqueBy(users, 'id');
// [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
```

#### `intersection<T>(arr1: T[], arr2: T[]): T[]`

获取两个数组的交集。

```js
import { intersection } from '@tools/array-utils';

intersection([1, 2, 3, 4], [3, 4, 5, 6]); // [3, 4]
```

### 数组分组

#### `groupBy<T>(arr: T[], key: keyof T): Record<string, T[]>`

根据指定的属性对数组进行分组。

```js
import { groupBy } from '@tools/array-utils';

const users = [
  { id: 1, role: 'admin', name: 'John' },
  { id: 2, role: 'user', name: 'Jane' },
  { id: 3, role: 'admin', name: 'Doe' }
];

groupBy(users, 'role');
// {
//   "admin": [
//     { id: 1, role: 'admin', name: 'John' },
//     { id: 3, role: 'admin', name: 'Doe' }
//   ],
//   "user": [
//     { id: 2, role: 'user', name: 'Jane' }
//   ]
// }
```

#### `groupByFn<T>(arr: T[], fn: (item: T) => string): Record<string, T[]>`

根据指定的条件函数对数组进行分组。

```js
import { groupByFn } from '@tools/array-utils';

const numbers = [1, 2, 3, 4, 5, 6];

groupByFn(numbers, num => num % 2 === 0 ? 'even' : 'odd');
// {
//   "odd": [1, 3, 5],
//   "even": [2, 4, 6]
// }
```

#### `chunk<T>(arr: T[], size: number): T[][]`

将数组按指定大小分割成多个数组。

```js
import { chunk } from '@tools/array-utils';

chunk([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
// [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
```

## 开发

```bash
# 安装依赖
pnpm install

# 运行测试
pnpm test

# 构建
pnpm build
```

## 许可证

MIT