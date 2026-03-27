import { execFileSync } from "child_process";
import { resolveGitRepoPath, resolvePatchFiles } from "./patch-utils";

export const applyGitPatches = (repoPath: string, patchesDir: string): void => {
  const fullRepoPath = resolveGitRepoPath(repoPath, "Patched repository");
  const { fullPatchesDir, patchFiles } = resolvePatchFiles(patchesDir);

  if (patchFiles.length === 0) {
    console.log(`No patch files found in ${fullPatchesDir}; nothing to apply.`);
    return;
  }

  console.log(`Applying ${patchFiles.length} patch(es) from ${fullPatchesDir} to ${fullRepoPath}...`);
  execFileSync("git", ["-C", fullRepoPath, "am", "--3way", ...patchFiles], {
    stdio: "inherit",
  });
  console.log(`Applied ${patchFiles.length} patch(es) to ${fullRepoPath}`);
};
