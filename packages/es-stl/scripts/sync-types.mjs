import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const typeTargets = [['../dist/index.d.ts', '../dist/index.d.mts']];

for (const [source, target] of typeTargets) {
  const sourcePath = fileURLToPath(new URL(source, import.meta.url));
  const targetPath = fileURLToPath(new URL(target, import.meta.url));

  if (!existsSync(sourcePath)) {
    throw new Error(`Cannot sync missing declaration file: ${source}`);
  }

  mkdirSync(dirname(targetPath), { recursive: true });
  copyFileSync(sourcePath, targetPath);
}
