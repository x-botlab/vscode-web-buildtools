import fs from "fs";
import path from "path";

export const resolveGitRepoPath = (repoPath: string, repoLabel: string): string => {
  const fullRepoPath = path.resolve(repoPath);

  if (!fs.existsSync(fullRepoPath)) {
    throw new Error(`${repoLabel} not found: ${fullRepoPath}`);
  }

  if (!fs.existsSync(path.join(fullRepoPath, ".git"))) {
    throw new Error(`Not a git repository: ${fullRepoPath}`);
  }

  return fullRepoPath;
};

export const resolvePatchFiles = (patchesDir: string): { fullPatchesDir: string; patchFiles: string[] } => {
  const fullPatchesDir = path.resolve(patchesDir);

  if (!fs.existsSync(fullPatchesDir)) {
    throw new Error(`Patches directory not found: ${fullPatchesDir}`);
  }

  const patchFiles = fs
    .readdirSync(fullPatchesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".patch"))
    .map((entry) => path.join(fullPatchesDir, entry.name))
    .sort((left, right) => left.localeCompare(right));

  return { fullPatchesDir, patchFiles };
};
