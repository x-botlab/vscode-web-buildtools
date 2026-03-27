import { builtinModules } from "module";
import { defineConfig } from "vite";

const external = new Set([
  ...builtinModules,
  ...builtinModules.map((moduleName) => `node:${moduleName}`),
]);

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: "src/cli.ts",
      formats: ["es"],
      fileName: () => "cli.js",
    },
    minify: false,
    outDir: "dist",
    rollupOptions: {
      external: (id) => external.has(id),
      output: {
        banner: "#!/usr/bin/env node",
      },
    },
    sourcemap: true,
    target: "node20",
  },
});
