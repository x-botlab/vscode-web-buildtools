# vscode-web-buildtools

## CLI

This package is exposed as a CLI through the `bin` field in `package.json`.

### Local development

Build the CLI:

```bash
yarn build
```

The build is produced by Vite using `src/cli.ts` as the single entrypoint.

Run the built CLI in this Yarn workspace:

```bash
yarn cli clone --help
```

Or invoke it explicitly through Yarn's Node wrapper:

```bash
yarn node dist/cli.js clone --help
```

Generate patch files for commits ahead of the current upstream in `vscode-patched/patches`:

```bash
yarn cli make-patches
```

Apply patch files from `vsc-work/patches` to `vsc-work/vscode-patched`:

```bash
yarn cli apply-patches
```

Install dependencies in `vsc-work/vscode-patched`:

```bash
yarn cli install
```

### After publishing

Once published to npm, you can inspect the CLI with:

```bash
npx vscode-web-buildtools --help
```

Or run a command directly:

```bash
npx vscode-web-buildtools clone --help
```
