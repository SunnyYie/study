# @tools/string-utils

字符串处理工具函数库，提供了常用的字符串操作方法。

## 安装

```bash
npm install @tools/string-utils

# 或使用 pnpm
pnpm add @tools/string-utils
```

## API 文档

### 空白字符处理

#### `trim(str: string): string`

移除字符串两端的空白字符。

```js
import { trim } from '@tools/string-utils';

trim('  Hello World  '); // 'Hello World'
```

#### `trimStart(str: string): string`

移除字符串左侧的空白字符。

```js
import { trimStart } from '@tools/string-utils';

trimStart('  Hello World  '); // 'Hello World  '
```

#### `trimEnd(str: string): string`

移除字符串右侧的空白字符。

```js
import { trimEnd } from '@tools/string-utils';

trimEnd('  Hello World  '); // '  Hello World'
```

#### `trimAll(str: string): string`

移除字符串中所有的空白字符。

```js
import { trimAll } from '@tools/string-utils';

trimAll('  Hello  World  '); // 'HelloWorld'
```

### 大小写转换

#### `capitalize(str: string): string`

将字符串的首字母转为大写。

```js
import { capitalize } from '@tools/string-utils';

capitalize('hello world'); // 'Hello world'
```

#### `toCamelCase(str: string): string`

将字符串转为驼峰式命名。

```js
import { toCamelCase } from '@tools/string-utils';

toCamelCase('hello-world'); // 'helloWorld'
toCamelCase('hello_world'); // 'helloWorld'
toCamelCase('hello world'); // 'helloWorld'
```

#### `toKebabCase(str: string): string`

将字符串转为短横线命名。

```js
import { toKebabCase } from '@tools/string-utils';

toKebabCase('helloWorld'); // 'hello-world'
toKebabCase('HelloWorld'); // 'hello-world'
toKebabCase('hello_world'); // 'hello-world'
```

### 字符串截断

#### `truncate(str: string, length: number, suffix: string = '...'): string`

截断字符串并添加省略号。

```js
import { truncate } from '@tools/string-utils';

truncate('Hello, world!', 5); // 'Hello...'
truncate('Hello, world!', 8, '…'); // 'Hello, w…'
```

#### `truncateByByte(str: string, byteLength: number, suffix: string = '...'): string`

按字节长度截断字符串（处理中日韩等双字节字符）。

```js
import { truncateByByte } from '@tools/string-utils';

truncateByByte('你好，世界', 6); // '你好...'
// 因为中文字符按2个字节计算，所以只显示了3个汉字
truncateByByte('Hello, 世界', 8); // 'Hello, 世...'
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