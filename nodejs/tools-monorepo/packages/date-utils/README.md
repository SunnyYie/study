# @tools/date-utils

日期处理工具函数库，提供了常用的日期操作方法。

## 安装

```bash
npm install @tools/date-utils

# 或使用 pnpm
pnpm add @tools/date-utils
```

## API 文档

### 日期格式化

#### `formatDate(date: Date | number, format: string = 'YYYY-MM-DD'): string`

将日期格式化为指定格式的字符串。

```js
import { formatDate } from '@tools/date-utils';

const date = new Date(2023, 0, 15, 14, 30, 45); // 2023-01-15 14:30:45

formatDate(date); // '2023-01-15'
formatDate(date, 'YYYY/MM/DD'); // '2023/01/15'
formatDate(date, 'YYYY年MM月DD日 HH:mm:ss'); // '2023年01月15日 14:30:45'
```

支持的格式化占位符：
- `YYYY`: 四位年份
- `MM`: 两位月份
- `DD`: 两位日期
- `HH`: 两位小时（24小时制）
- `mm`: 两位分钟
- `ss`: 两位秒钟

#### `getDayOfWeek(date: Date | number, options?: { locale?: string; format?: 'long' | 'short' | 'narrow' }): string`

获取指定日期是星期几。

```js
import { getDayOfWeek } from '@tools/date-utils';

const sunday = new Date(2023, 0, 15); // 2023-01-15 星期日

getDayOfWeek(sunday); // '星期日'（默认中文，长格式）
getDayOfWeek(sunday, { locale: 'en-US' }); // 'Sunday'（英文）
getDayOfWeek(sunday, { format: 'short' }); // '周日'（短格式）
getDayOfWeek(sunday, { format: 'narrow' }); // '日'（最短格式）
```

#### `timeAgo(date: Date | number, now: Date | number = new Date()): string`

将指定的时间戳或日期对象转换为相对时间（如：刚刚、5分钟前等）。

```js
import { timeAgo } from '@tools/date-utils';

const now = new Date();
const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

timeAgo(fiveMinutesAgo, now); // '5分钟前'
timeAgo(threeHoursAgo, now); // '3小时前'
timeAgo(tenDaysAgo, now); // '10天前'
```

### 日期差值计算

#### `diffInDays(date1: Date | number, date2: Date | number): number`

计算两个日期之间的天数差。

```js
import { diffInDays } from '@tools/date-utils';

const start = new Date(2023, 0, 1); // 2023-01-01
const end = new Date(2023, 0, 10); // 2023-01-10

diffInDays(start, end); // 9
diffInDays(end, start); // -9
```

#### `diffInMonths(date1: Date | number, date2: Date | number): number`

计算两个日期之间的月数差。

```js
import { diffInMonths } from '@tools/date-utils';

const start = new Date(2023, 0, 15); // 2023-01-15
const end = new Date(2023, 5, 10); // 2023-06-10

diffInMonths(start, end); // 5
```

#### `diffInYears(date1: Date | number, date2: Date | number): number`

计算两个日期之间的年数差。

```js
import { diffInYears } from '@tools/date-utils';

const start = new Date(2020, 5, 15); // 2020-06-15
const end = new Date(2023, 2, 10); // 2023-03-10

diffInYears(start, end); // 3
```

#### `diffDetail(date1: Date | number, date2: Date | number): { years: number; months: number; days: number; hours: number; minutes: number; seconds: number }`

计算两个日期之间的详细差值。

```js
import { diffDetail } from '@tools/date-utils';

const start = new Date(2020, 1, 1, 10, 30, 45); // 2020-02-01 10:30:45
const end = new Date(2023, 5, 15, 14, 20, 30); // 2023-06-15 14:20:30

const diff = diffDetail(start, end);
// {
//   years: 3,
//   months: 4,
//   days: 14,
//   hours: 3,
//   minutes: 49,
//   seconds: 45
// }
```

### 日期验证

#### `isValidDate(value: any): boolean`

检查给定的值是否为有效的日期对象或可转换为有效日期的值。

```js
import { isValidDate } from '@tools/date-utils';

isValidDate(new Date()); // true
isValidDate('2023-01-15'); // true
isValidDate(1672531200000); // true
isValidDate('not a date'); // false
isValidDate(null); // false
```

#### `isFutureDate(date: Date | number, now: Date | number = new Date()): boolean`

检查给定的日期是否是未来日期。

```js
import { isFutureDate } from '@tools/date-utils';

const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

isFutureDate(tomorrow, now); // true
isFutureDate(now, now); // false
```

#### `isPastDate(date: Date | number, now: Date | number = new Date()): boolean`

检查给定的日期是否是过去日期。

```js
import { isPastDate } from '@tools/date-utils';

const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

isPastDate(yesterday, now); // true
isPastDate(now, now); // false
```

#### `isToday(date: Date | number): boolean`

检查给定的日期是否是当天。

```js
import { isToday } from '@tools/date-utils';

const today = new Date();
const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

isToday(today); // true
isToday(yesterday); // false
```

#### `isDateInRange(date: Date | number, startDate: Date | number, endDate: Date | number): boolean`

检查日期是否在指定的范围内。

```js
import { isDateInRange } from '@tools/date-utils';

const start = new Date('2023-01-01');
const end = new Date('2023-01-31');
const middle = new Date('2023-01-15');
const outside = new Date('2023-02-01');

isDateInRange(middle, start, end); // true
isDateInRange(outside, start, end); // false
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