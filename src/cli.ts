import { cloneLocalVSCodeRepo, cloneVSCodeRepo } from "./clone-vs";
import { applyGitPatches } from "./apply-patches";
import { installNodeDependencies } from "./install";
import { makeGitPatches } from "./make-patches";
import { program } from "commander";
import path from "path";
import fs from "fs";
import { compileWebMin } from "./compile";

const WorkDir = path.join(process.cwd(), "vsc-work");

program
  .name("vscode-web-build-tools")
  .description("CLI for VS Code web build tools")
  .showHelpAfterError();

program
  .command("clone")
  .description("Clone VS Code repository")
  .option("-d, --dir <path>", "Work directory", WorkDir)
  .option("-v, --version <version>", "VS Code version to clone", "1.113.0")
  .action((options) => {
    const cloneDir = path.join(options.dir, "vscode");
    const patchedDir = path.join(options.dir, "vscode-patched");
    // Delete existing directories if they exist
    [cloneDir, patchedDir].forEach((dir) => {
      if (fs.existsSync(dir)) {
        console.log(`Removing existing directory: ${dir}`);
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });

    cloneVSCodeRepo(cloneDir, options.version);
    cloneLocalVSCodeRepo(cloneDir, patchedDir);
  });

program
  .command("make-patches")
  .description("Generate patch files for commits ahead of upstream in vscode-patched")
  .option("-d, --dir <path>", "Work directory", WorkDir)
  .action((options) => {
    const patchedDir = path.join(options.dir, "vscode-patched");
    const outputDir = path.join(options.dir, "patches");

    makeGitPatches(patchedDir, outputDir, "@{upstream}");
  });

program
  .command("apply-patches")
  .description("Apply patch files from patches to vscode-patched")
  .option("-d, --dir <path>", "Work directory", WorkDir)
  .action((options) => {
    const patchedDir = path.join(options.dir, "vscode-patched");
    const patchesDir = path.join(options.dir, "patches");

    applyGitPatches(patchedDir, patchesDir);
  });

program
  .command("install")
  .description("Install node dependencies in vscode-patched")
  .option("-d, --dir <path>", "Work directory", WorkDir)
  .action((options) => {
    const patchedDir = path.join(options.dir, "vscode-patched");

    installNodeDependencies(patchedDir);
  });

program
  .command("compile")
  .description("Compile vscode-patched for web")
  .option("-d, --dir <path>", "Work directory", WorkDir)
  .action((options) => {
    const patchedDir = path.join(options.dir, "vscode-patched");
    const outputDir = path.join(options.dir, "vscode-web");
    compileWebMin(patchedDir);
    // copy workbench.html to outputDir
    const sourceWorkbench = path.join(process.cwd(), "workbench.html");
    const targetWorkbench = path.join(outputDir, "workbench.html");
    fs.copyFileSync(sourceWorkbench, targetWorkbench);
  });

if (process.argv.length <= 2) {
  program.help();
}

program.parse();
