import { copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const source = path.resolve('workbench.html');
const targetDir = path.resolve('dist');
const target = path.join(targetDir, 'workbench.html');

mkdirSync(targetDir, { recursive: true });
copyFileSync(source, target);

console.log(`Copied ${source} -> ${target}`);
