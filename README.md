# Chatroom 项目

## 项目简介

X-Lab入门项目进阶2024版个人完成情况归档。

基于 Next.js + tRPC + Drizzle ORM 的聊天室项目，使用 PostgreSQL 作为数据库，管理聊天、用户等数据。

---

## 环境要求

- Node.js (推荐版本 18+，请自行安装)
- Yarn 包管理器 v1.22.22 （项目指定版本）
- PostgreSQL 数据库（建议使用 12 及以上版本）

---

## 环境配置

1. 克隆项目代码到本地：

```bash
git clone <your-repo-url>
cd <project-folder>
```

2. 安装依赖：

```bash
yarn install
```

3. 配置环境变量

在项目根目录创建 .env 文件，参考.env.example

确保你的 PostgreSQL 里有对应的数据库（例如 chatroom），你可以用命令行创建：

```bash
psql -U <用户名> -h <主机> -p <端口>
CREATE DATABASE chatroom;
```

## 数据库迁移
使用 Drizzle Kit 管理数据库迁移。

1. 生成迁移文件（根据当前 schema 自动生成迁移）

```bash
yarn db:generate
```

2. 执行迁移，创建或更新数据库表

```bash
yarn db:migrate
```

3. （可选）启动 Drizzle Studio 可视化查看数据库结构

```bash
yarn db:studio
```

## 启动项目

开发模式启动（支持热更新）：

```bash
yarn dev
```

生产模式构建并启动：

```bash
yarn build
yarn start
```

## 项目结构（简要）
- src/ 主要代码目录
- src/server/db/schema.ts Drizzle ORM 的数据库 schema 定义
- drizzle.config.ts Drizzle Kit 配置文件
- package.json 依赖与脚本
- .env 环境变量文件（不提交至仓库）


## 备注
此处 Node.js 版本使用20.x兼容依赖版本。
