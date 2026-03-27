import { execSync } from "child_process";

const runCommand = (command: string, cwd: string): void => {
  console.log(`Running ${command} in ${cwd}...`);
  execSync(command, {
    cwd,
    stdio: "inherit",
  });
  console.log(`Finished running ${command} in ${cwd}`);
};

export const compileWebMin = async (sourceDir: string): Promise<void> => {
  console.log("Compiling web-min...");
  runCommand("npm run gulp compile-build-without-mangling", sourceDir);
  runCommand("npm run gulp compile-extension-media", sourceDir);
  runCommand("npm run gulp compile-extensions-build", sourceDir);
  runCommand("npm run gulp minify-vscode", sourceDir);
  runCommand("npm run gulp vscode-web-min-ci", sourceDir);
  console.log("Finished compiling web-min.");
}
