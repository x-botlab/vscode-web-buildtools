import { cloneLocalVSCodeRepo, cloneVSCodeLocRepo, cloneVSCodeRepo } from "./clone-vs";
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

program
  .command("make-nls")
  .description("Generate nls files")
  .option("-d, --dir <path>", "Work directory", WorkDir)
  .action((options) => {
    const vscodeWebDir = path.join(options.dir, "vscode-web");
    const nlsDir = path.join(options.dir, "nls");
    const nlsOutputDir = path.join(options.dir, "nls-out");

    const nlsKeysPath = path.join(vscodeWebDir, "out", "nls.keys.json");
    const nlsMessagesPath = path.join(vscodeWebDir, "out", "nls.messages.json");

    if (!fs.existsSync(nlsKeysPath) || !fs.existsSync(nlsMessagesPath)) {
      console.error("nls.keys.json or nls.messages.json not found in vscode-web output directory. Please run the compile command first.");
      process.exit(1);
    }

    if (!fs.existsSync(nlsDir)) {
      console.error("nls directory not found. Please make sure to place your nls source files in the nls directory.");
      process.exit(1);
    }

    // [["module1",["key1","key2",...]],["module2",["key1","key2",...]],...]
    const nlsKeys = JSON.parse(fs.readFileSync(nlsKeysPath, "utf-8")) as [string, string[]][];
    // ["message1","message2",...]
    const nlsMessages = JSON.parse(fs.readFileSync(nlsMessagesPath, "utf-8"));

    // Scan nlsDir for {locale}.json files and generate corresponding {locale}/nls.messages.js files
    fs.readdirSync(nlsDir).forEach(file => {
      if (file.endsWith(".json")) {
        const locale = path.basename(file, ".json");
        const localeOutputDir = path.join(nlsOutputDir, locale);
        if (!fs.existsSync(localeOutputDir)) {
          fs.mkdirSync(localeOutputDir, { recursive: true });
        }

        const nlsSourcePath = path.join(nlsDir, file);
        // { "contents": { "module1": { "key1": "message1", ... }, ... } }
        const nlsSource = JSON.parse(fs.readFileSync(nlsSourcePath, "utf-8"));

        // ["message1","message2",...]

        const nlsTranslatedMessages = [] as string[];
        nlsKeys.forEach(([moduleName, keys]) => {
          keys.forEach(key => {
            nlsSource.contents[moduleName] = nlsSource.contents[moduleName] || {};
            const message = nlsSource.contents[moduleName][key] || nlsMessages[nlsTranslatedMessages.length] || "";
            nlsTranslatedMessages.push(message);
          })
        });

        const outputPath = path.join(localeOutputDir, "nls.messages.js");
        fs.writeFileSync(outputPath, `globalThis._VSCODE_NLS_MESSAGES=${JSON.stringify(nlsTranslatedMessages)};\nglobalThis._VSCODE_NLS_LANGUAGE=${JSON.stringify(locale)};`, "utf-8");
        console.log(`Generated ${outputPath}`);
      }
    });
  });

if (process.argv.length <= 2) {
  program.help();
}

program.parse();
