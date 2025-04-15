# Nodejs 学习笔记

## npm

基于命令行的 js 包管理工具

### npm init 生成 package.json

```json
// package.json
{
  "name": "tools-monorepo",
  "version": "1.0.0",
  "description": "工具函数库集合",
  "private": true,
  "scripts": {
    "test": "vitest",
    "build": "lerna run build",
    "lint": "eslint packages/*/src --ext .ts"
  },
  "keywords": ["utils", "tools", "monorepo"],
  "author": "SunnyYee",
  "license": "MIT"
}
```

### npm install

```sh
# 安装生产依赖

npm i xxx

# 安装开发依赖

npm i xxx --save-dev

```

### npm uninstall 卸载 npm 包

### npm config set registry xxx 设置镜像源

## npm install 原理

使用的算法是广度优先遍历，在遍历依赖树时，npm 会首先处理项目根目录下的依赖，然后逐层处理每个依赖包的依赖，直到所有依赖都被处理完毕。在处理每个依赖时，npm 会检查该依赖的版本号是否符合依赖树中其他依赖的版本要求，如果不符合，则会尝试安装适合的版本

### 扁平化

1.安装依赖时,如果某几个包的子依赖是同一个包,则会将子包提取到和父包一个层级.(理想状态下)
1.1 非理想状态下,依赖的子包版本不同,还是会给不同的包依赖不同版本的子包,出现模块冗余的情况.

### 流程

https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0570bf4581f74a9790bb86567b889e68~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?

### package-lock.json 的作用

```json
{
  "name": "content",
  "version": "1.0.0",
  "lockfileVersion": 1,
  "requires": true,
  "dependencies": {
    "@asamuzakjp/css-color": {
      "version": "3.1.1",
      // 指定了当前包的下载地址
      "resolved": "https://registry.npmmirror.com/@asamuzakjp/css-color/-/css-color-3.1.1.tgz",
      // 用于验证包的完整性
      "integrity": "sha512-hpRD68SV2OMcZCsrbdkccTw5FXjNDLo5OuqSHyHZfwweGsDWZwDJ2+gONyNAbazZclobMirACLw0lk8WVxIqxA==",
      "requires": {
        "@csstools/css-calc": "^2.1.2",
        "@csstools/css-color-parser": "^3.0.8",
        "@csstools/css-parser-algorithms": "^3.0.4",
        "@csstools/css-tokenizer": "^3.0.3",
        "lru-cache": "^10.4.3"
      },
      "dependencies": {
        "lru-cache": {
          "version": "10.4.3",
          "resolved": "https://registry.npmmirror.com/lru-cache/-/lru-cache-10.4.3.tgz",
          "integrity": "sha512-JNAzZcXrCt42VGLuYz0zfAzDfAvJWW6AfYlDBQyDV5DClI2m5sAmK+OIO7s59XfsRsWHp02jAJrRadPRGTt6SQ=="
        }
      }
    }
  }
}
```

重点:package-lock.json 帮我们做了缓存,通过 name + version + integrity 信息生成一个唯一的 key,这个 key 能找到对应的 index-v5 下的缓存记录
如果有缓存的话,则从 content-v2 中解压拿到对应依赖的 node_modules

https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c321d177dd445588981a9bb4f719381~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?
