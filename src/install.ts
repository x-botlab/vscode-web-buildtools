import { execSync } from "child_process";

export const installNodeDependencies = (target: string): void => {

  console.log(`Running npm i in ${target}...`);
  execSync("npm i", {
    cwd: target,
    stdio: "inherit",
  });
  console.log(`Installed dependencies in ${target}`);
};
