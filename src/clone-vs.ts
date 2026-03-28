import { execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const VSCodeRepoUrl = `https://github.com/microsoft/vscode.git`;
const VSCodeLocRepoUrl = `https://github.com/microsoft/vscode-loc.git`

export const cloneVSCodeRepo = (repoPath: string, version: string): void => {
  // Ensure the target directory exists, automatically create it if it doesn't
  const fullRepoPath = path.resolve(repoPath);
  try {
    fs.mkdirSync(fullRepoPath, { recursive: true });
  } catch (error) {
    console.error('Error creating target directory:', error);
    throw error;
  }

  try {
    console.log(`Cloning VS Code repository to ${repoPath}...`);
    execFileSync('git', ['clone', '--depth', '1', '--branch', version, VSCodeRepoUrl, fullRepoPath], { stdio: 'inherit' });
    console.log('VS Code repository cloned successfully.');
  } catch (error) {
    console.error('Error cloning VS Code repository:', error);
    throw error;
  }
}

export const cloneLocalVSCodeRepo = (sourcePath: string, targetPath: string): void => {
  const fullSourcePath = path.resolve(sourcePath);
  const fullTargetPath = path.resolve(targetPath);

  try {
    fs.mkdirSync(fullTargetPath, { recursive: true });
  } catch (error) {
    console.error('Error creating target directory:', error);
    throw error;
  }

  try {
    console.log(`Cloning local VS Code repository from ${sourcePath} to ${targetPath}...`);
    execFileSync('git', ['clone', '--depth', '1', fullSourcePath, fullTargetPath], { stdio: 'inherit' });
    console.log('Local VS Code repository cloned successfully.');
    // Preserve the cloned source state as the patch baseline, even when the source repo is on a detached HEAD.
    execFileSync('git', ['-C', fullTargetPath, 'branch', 'patched-base', 'HEAD'], { stdio: 'inherit' });
    console.log('Created "patched-base" branch in the cloned repository.');
    // Create a branch named "patched" in the cloned repository
    execFileSync('git', ['-C', fullTargetPath, 'switch', '-c', 'patched'], { stdio: 'inherit' });
    console.log('Checked out to "patched" branch in the cloned repository.');
    // Use the baseline branch as upstream so patch generation can diff against the original cloned state.
    execFileSync('git', ['-C', fullTargetPath, 'branch', '--set-upstream-to=patched-base', 'patched'], { stdio: 'inherit' });
    console.log('Set upstream of "patched" branch to "patched-base".');
    
  } catch (error) {
    console.error('Error cloning local VS Code repository:', error);
    throw error;
  }
}


export const cloneVSCodeLocRepo = (repoPath: string, version: string): void => {
  // Ensure the target directory exists, automatically create it if it doesn't
  const fullRepoPath = path.resolve(repoPath);
  try {
    fs.mkdirSync(fullRepoPath, { recursive: true });
  } catch (error) {
    console.error('Error creating target directory:', error);
    throw error;
  }

  try {
    console.log(`Cloning VS Code Localization repository to ${repoPath}...`);
    execFileSync('git', ['clone', '--depth', '1', '--branch', version, VSCodeLocRepoUrl, fullRepoPath], { stdio: 'inherit' });
    console.log('VS Code Localization repository cloned successfully.');
  } catch (error) {
    console.error('Error cloning VS Code Localization repository:', error);
    throw error;
  }
}
