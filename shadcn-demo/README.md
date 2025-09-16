# Shadcn Demo - Turborepo + pnpm Monorepo 项目

这是一个基于 Turborepo 和 pnpm 的 monorepo 架构项目，用于学习：

1. 前端工程化
2. monorepo架构管理
3. 组件设计思想
4. 前后端技术水平

## 项目结构

```
shadcn-demo/
├── apps/                       # 应用程序目录
│   ├── web/                    # 前端应用 (Vite + React 19 + Tailwind CSS)
│   └── server/                 # 后端应用 (NestJS)
├── packages/                   # 共享包目录
│   ├── ui/                     # UI 组件库
│   └── shared-config/          # 共享配置包
├── package.json                # 根项目配置
├── pnpm-workspace.yaml         # pnpm 工作区配置
├── turbo.json                  # Turborepo 配置
└── .npmrc                      # npm 配置
```

## 技术栈

### 前端 (apps/web)

- **构建工具**: [Vite](https://vitejs.dev/) - 快速的前端构建工具
- **框架**: [React 19](https://react.dev/) - 最新版本的 React
- **样式**: [Tailwind CSS 4](https://tailwindcss.com/) - 原子化 CSS 框架
- **类型系统**: [TypeScript](https://www.typescriptlang.org/) - 静态类型检查

### 后端 (apps/server)

- **框架**: [NestJS](https://nestjs.com/) - 企业级 Node.js 框架
- **运行时**: Node.js
- **类型系统**: TypeScript

### 共享包 (packages/)

- **@repo/ui**: 共享的 React 组件库
- **@repo/shared-config**: 共享的配置文件

### 开发工具

- **构建系统**: [Turborepo](https://turbo.build/) - 高性能构建系统
- **包管理器**: [pnpm](https://pnpm.io/) - 快速、节省磁盘空间的包管理器
- **代码规范**: [ESLint](https://eslint.org/) + [Prettier](https://prettier.io) - 代码检查和格式化

## 快速开始

### 前置要求

- Node.js 18+
- pnpm 9+

### 安装依赖

```bash
cd shadcn-demo
pnpm install
```

### 开发模式

启动前端项目 (端口 3000)：

```bash
cd apps/web
pnpm dev
```

启动后端项目 (端口 3000)：

```bash
cd apps/server
pnpm dev
```

### 构建项目

```bash
pnpm build
```

## 项目特点

🚀 **现代技术栈**

- React 19 最新特性
- Tailwind CSS 4 原子化样式
- NestJS 企业级后端架构
- TypeScript 全栈类型安全

📦 **Monorepo 架构**

- 代码共享和复用
- 统一的构建和部署
- 依赖管理优化
- Turborepo 智能缓存

⚡ **开发体验**

- Vite 快速热重载
- 全栈类型安全
- 代码自动格式化
- 高效构建缓存
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
