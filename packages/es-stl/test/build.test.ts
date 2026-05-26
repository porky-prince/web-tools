import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const packageRoot = join(__dirname, '..');
const root = join(packageRoot, '..', '..');

describe('build', () => {
  it('generates the public entry and package formats', () => {
    execFileSync('pnpm', ['--filter', 'es-stl', 'build'], {
      cwd: root,
      stdio: 'pipe',
    });

    const sourceEntry = join(packageRoot, 'src/index.ts');
    const cjsEntry = join(packageRoot, 'dist/index.js');
    const esmEntry = join(packageRoot, 'dist/index.mjs');
    const cjsTypes = join(packageRoot, 'dist/index.d.ts');

    const sourceEntryContent = readFileSync(sourceEntry, 'utf8');

    expect(sourceEntryContent).toContain("from './algorithm/binarySearch'");
    expect(existsSync(cjsEntry)).toBe(true);
    expect(existsSync(esmEntry)).toBe(true);
    expect(existsSync(cjsTypes)).toBe(true);
    expect(readFileSync(esmEntry, 'utf8')).toContain('export {');
  });
});
