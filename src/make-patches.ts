import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { resolveGitRepoPath } from "./patch-utils";

const removeExistingPatches = (outputDir: string): void => {
  for (const entry of fs.readdirSync(outputDir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".patch")) {
      fs.rmSync(path.join(outputDir, entry.name), { force: true });
    }
  }
};

export const makeGitPatches = (repoPath: string, outputDir: string, upstream: string): void => {
  const fullRepoPath = resolveGitRepoPath(repoPath, "Patched repository");
  const fullOutputDir = path.resolve(outputDir);

  fs.mkdirSync(fullOutputDir, { recursive: true });
  removeExistingPatches(fullOutputDir);

  try {
    execFileSync("git", ["-C", fullRepoPath, "rev-parse", "--verify", upstream], {
      stdio: "ignore",
    });
  } catch {
    throw new Error(`Upstream ref not found: ${upstream}`);
  }

  const commitCount = Number(
    execFileSync("git", ["-C", fullRepoPath, "rev-list", "--count", `${upstream}..HEAD`], {
      encoding: "utf8",
    }).trim(),
  );

  if (commitCount === 0) {
    console.log(`No commits ahead of ${upstream}; no patch files generated.`);
    return;
  }

  console.log(`Generating patches from ${fullRepoPath} against ${upstream}...`);
  execFileSync("git", ["-C", fullRepoPath, "format-patch", upstream,"--no-stat", "--minimal", "-N", "-o", fullOutputDir], {
    stdio: "inherit",
  });
  console.log(`Patches written to ${fullOutputDir}`);
};
