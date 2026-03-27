# vscode-web-buildtools

English version: [README.md](./README.md)

`vscode-web-buildtools` 是一个用于准备 [VS Code](https://github.com/microsoft/vscode) Web 定制构建的 CLI。

它把常见的仓库准备、补丁处理和构建流程封装成命令，避免手动重复执行 Git 和构建步骤。

## 功能概览

这个 CLI 主要用于完成一套定制 VS Code Web 构建所需的核心操作：

- 克隆指定版本的 VS Code
- 创建一个独立的 patched 工作副本
- 应用现有补丁集
- 从本地修改生成补丁文件
- 在 patched 副本中安装依赖
- 执行 Web 构建流程

## 安装

建议全局安装，这样安装后就可以直接使用 CLI：

```bash
npm install -g vscode-web-buildtools
```

安装完成后，直接使用可执行命令：

```bash
vsc-web-build --help
```

如果你只想临时执行，也可以使用 `npx`，但长期使用更适合全局安装。

## 环境要求

- [Node.js](https://nodejs.org/) 20+
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/)

## 关于补丁

这个 CLI 把补丁视为保存自定义改动的可移植形式。

补丁文件记录的是“干净上游代码”和“你想保留的改动”之间的差异，这样做有几个直接好处：

- 可以把同一组定制改动重新应用到新的 VS Code 工作副本
- 可以把改动分享给其他人或其他环境
- 可以把你的定制逻辑和上游源码分离管理

在默认工作流里，补丁文件保存在 `vsc-work/patches` 目录下。

当你已经有一组补丁文件，并且希望把它们应用到新的 patched 工作副本时，使用 `apply-patches`。

当你已经修改过 patched 工作副本，并且希望把这些已提交的改动重新导出为补丁文件时，使用 `make-patches`。

## 主要命令

### `clone`

下载指定版本的 VS Code，并准备一个用于自定义修改的第二份工作副本。

```bash
vsc-web-build clone --version 1.113.0
```

### `apply-patches`

把补丁文件应用到 patched 工作副本上。

这个命令通常在 `clone` 之后使用，适合把一套已经存在的补丁重新应用到新的工作副本上。

典型用法：

```bash
vsc-web-build clone --version 1.113.0
vsc-web-build apply-patches
```

如果补丁文件描述的是正确的改动集，那么应用完成后，patched 工作副本会恢复到生成这些补丁时的定制状态。

```bash
vsc-web-build apply-patches
```

### `make-patches`

把你在 patched 工作副本里的本地提交重新导出为补丁文件。

这个命令通常用于你已经修改了 patched 工作副本并完成 Git 提交之后。它会把相对于基线新增的提交导出为 `.patch` 文件，方便后续重复使用。

典型用法：

```bash
vsc-web-build make-patches
```

常见流程：

1. 执行 `vsc-web-build clone`
2. 在 patched 工作副本中修改文件
3. 使用 Git 提交这些改动
4. 执行 `vsc-web-build make-patches`

生成出来的补丁文件可以提交到你自己的仓库里，之后再通过 `vsc-web-build apply-patches` 重新应用。

```bash
vsc-web-build make-patches
```

### `install`

在 patched 的 VS Code 工作副本中安装构建依赖。

```bash
vsc-web-build install
```

### `compile`

执行 VS Code Web 的构建流程。

```bash
vsc-web-build compile
```

## 典型工作流

```bash
vsc-web-build clone --version 1.113.0
vsc-web-build apply-patches
vsc-web-build install
vsc-web-build compile
```

如果你修改了 patched 工作副本，并且想重新生成补丁文件：

```bash
vsc-web-build make-patches
```

如果你已经有现成补丁，想从头重建一次：

```bash
vsc-web-build clone --version 1.113.0
vsc-web-build apply-patches
vsc-web-build install
vsc-web-build compile
```

## 工作目录

命令默认使用 `./vsc-work` 作为工作目录。如果你想改用其他位置，可以传入 `--dir`：

```bash
vsc-web-build clone --dir D:/work/vscode-web --version 1.113.0
```

CLI 会在这个目录下创建并使用上游源码、副本、补丁文件和构建输出所需的工作子目录。

## 本地开发

如果你是在当前仓库里开发这个工具本身，可以用 [Yarn](https://yarnpkg.com/) 构建并运行：

```bash
yarn build
yarn cli --help
```
