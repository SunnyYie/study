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

1.
