# 工具函数库集合

基于pnpm+monorepo架构的工具库项目，包含常用的工具函数及完整的测试用例。

## 项目结构

```
tools-monorepo/
├── packages/
│   ├── string-utils/ # 字符串工具函数
│   ├── array-utils/  # 数组工具函数
│   └── date-utils/   # 日期工具函数
├── package.json
└── pnpm-workspace.yaml
```

## 安装

```bash
# 安装pnpm（如果尚未安装）
npm install -g pnpm

# 安装所有依赖
pnpm install
```

## 构建

```bash
# 构建所有包
pnpm run build

# 构建单个包
cd packages/string-utils
pnpm run build
```

## 测试

```bash
# 测试所有包
pnpm run test

# 测试单个包
cd packages/array-utils
pnpm run test
```

## 使用方式

### 安装

```bash
# 安装单个包
npm install @tools/string-utils

# 或使用pnpm
pnpm add @tools/string-utils
```

### 导入与使用

```js
// 导入整个库
import * as StringUtils from '@tools/string-utils';

// 或导入特定函数
import { trim, capitalize } from '@tools/string-utils';
import { unique, groupBy } from '@tools/array-utils';
import { formatDate, timeAgo } from '@tools/date-utils';

// 使用函数
const trimmedStr = StringUtils.trim('  Hello World  ');
const capitalizedStr = capitalize('hello world');
```

## 包说明

### 字符串工具 (@tools/string-utils)

提供字符串处理相关的工具函数，包括：

- `trim` / `trimStart` / `trimEnd` / `trimAll`: 字符串空白处理
- `capitalize` / `toCamelCase` / `toKebabCase`: 大小写转换
- `truncate` / `truncateByByte`: 字符串截断

### 数组工具 (@tools/array-utils)

提供数组处理相关的工具函数，包括：

- `compact` / `without` / `findWhere`: 数组过滤
- `unique` / `uniqueBy` / `intersection`: 数组去重
- `groupBy` / `groupByFn` / `chunk`: 数组分组

### 日期工具 (@tools/date-utils)

提供日期处理相关的工具函数，包括：

- `formatDate` / `getDayOfWeek` / `timeAgo`: 日期格式化
- `diffInDays` / `diffInMonths` / `diffInYears` / `diffDetail`: 日期差值计算
- `isValidDate` / `isFutureDate` / `isPastDate` / `isToday` / `isDateInRange`: 日期验证

## 许可证

MIT