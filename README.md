# vscode-web-buildtools

Chinese version: [README.zh-CN.md](./README.zh-CN.md)

`vscode-web-buildtools` is a CLI for preparing a patched web build of [VS Code](https://github.com/microsoft/vscode).

It turns common repository setup, patch handling, and build steps into commands so you do not need to repeat them manually.

## Overview

The CLI covers the main tasks needed for a custom VS Code web build:

- clone a specific VS Code version
- create a separate patched working copy
- apply an existing patch set
- generate patch files from your local changes
- install dependencies in the patched checkout
- run the web build pipeline

## Install

Install the package globally so you can call the CLI directly:

```bash
npm install -g vscode-web-buildtools
```

After installation, use the executable name:

```bash
vsc-web-build --help
```

For long-term use, global installation is the simplest option. You can also use `npx` for temporary execution.

## Requirements

- [Node.js](https://nodejs.org/) 20+
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/)

## About Patches

This CLI treats patches as the portable form of your custom changes.

A patch file records the difference between a clean upstream checkout and the changes you want to keep. This makes it easier to:

- reapply the same customizations to a fresh VS Code checkout
- share your changes with other people or environments
- keep your modifications separate from the upstream source tree

In the default workflow, patch files are stored under `vsc-work/patches`.

Use `apply-patches` when you already have a patch set and want to apply it onto a fresh patched checkout.

Use `make-patches` when you have modified the patched checkout and want to export those committed changes back into patch files.

## Main Commands

### `clone`

Download the selected VS Code version and prepare a second checkout for your custom changes.

```bash
vsc-web-build clone --version 1.113.0
```

### `apply-patches`

Apply patch files onto the patched checkout.

This command is typically used after `clone`, when you want to replay an existing patch set onto a clean working copy.

Typical usage:

```bash
vsc-web-build clone --version 1.113.0
vsc-web-build apply-patches
```

If the patch files describe the expected customization set, the patched checkout will be brought to the same state as when those patches were created.

```bash
vsc-web-build apply-patches
```

### `make-patches`

Export your local patching commits back into patch files.

This command is typically used after you modify the patched checkout and commit those changes. It turns the commits ahead of the baseline into `.patch` files so they can be reused later.

Typical usage:

```bash
vsc-web-build make-patches
```

Common flow:

1. Run `vsc-web-build clone`
2. Edit files in the patched checkout
3. Commit your changes with Git
4. Run `vsc-web-build make-patches`

The generated patch files can then be committed to your own repository and applied again with `vsc-web-build apply-patches`.

```bash
vsc-web-build make-patches
```

### `install`

Install the dependencies needed inside the patched VS Code checkout.

```bash
vsc-web-build install
```

### `compile`

Run the VS Code web build process.

```bash
vsc-web-build compile
```

## Typical Workflow

```bash
vsc-web-build clone --version 1.113.0
vsc-web-build apply-patches
vsc-web-build install
vsc-web-build compile
```

If you changed the patched checkout and want to regenerate patch files:

```bash
vsc-web-build make-patches
```

If you already have an existing patch set and want to rebuild from scratch:

```bash
vsc-web-build clone --version 1.113.0
vsc-web-build apply-patches
vsc-web-build install
vsc-web-build compile
```

## Work Directory

Commands use `./vsc-work` by default. To use another location, pass `--dir`:

```bash
vsc-web-build clone --dir D:/work/vscode-web --version 1.113.0
```

The CLI creates and uses working folders under that directory for the upstream checkout, patched checkout, patch files, and build output.

## Local Development

If you are developing this repository itself, use [Yarn](https://yarnpkg.com/) to build and run the CLI:

```bash
yarn build
yarn cli --help
```
