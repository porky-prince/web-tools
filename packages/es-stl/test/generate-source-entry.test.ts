import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const packageRoot = join(__dirname, '..');
const scriptUrl = pathToFileURL(
  join(packageRoot, 'scripts/generate-source-entry.mjs')
).href;

describe('generateSourceEntry', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'es-stl-entry-'));
  });

  afterEach(() => {
    rmSync(tempDir, { force: true, recursive: true });
  });

  function runGenerateSourceEntry() {
    return spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '--eval',
        [
          `import { generateSourceEntry } from ${JSON.stringify(scriptUrl)};`,
          `generateSourceEntry(${JSON.stringify({
            sourceEntry: join(tempDir, 'index.ts'),
            srcDir: tempDir,
          })});`,
        ].join('\n'),
      ],
      {
        cwd: packageRoot,
        encoding: 'utf8',
      }
    );
  }

  function execGenerateSourceEntry() {
    execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '--eval',
        [
          `import { generateSourceEntry } from ${JSON.stringify(scriptUrl)};`,
          `generateSourceEntry(${JSON.stringify({
            sourceEntry: join(tempDir, 'index.ts'),
            srcDir: tempDir,
          })});`,
        ].join('\n'),
      ],
      {
        cwd: packageRoot,
      }
    );
  }

  it('throws when source files export duplicate names', () => {
    writeFileSync(join(tempDir, 'Queue.ts'), 'export class Queue {}\n');
    writeFileSync(
      join(tempDir, 'createQueue.ts'),
      'export function Queue() {}\n'
    );

    const result = runGenerateSourceEntry();

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "Duplicate export name 'Queue' found in ./Queue and ./createQueue."
    );
  });

  it('allows type and runtime exports with the same name in one source file', () => {
    writeFileSync(
      join(tempDir, 'Queue.ts'),
      ['export interface Queue {}', 'export class Queue {}', ''].join('\n')
    );

    execGenerateSourceEntry();

    expect(readFileSync(join(tempDir, 'index.ts'), 'utf8')).toContain(
      "export * from './Queue';"
    );
  });

  it('checks duplicate names against public export aliases', () => {
    writeFileSync(
      join(tempDir, 'Queue.ts'),
      [
        'const createQueue = () => null;',
        'export { createQueue as Queue };',
        '',
      ].join('\n')
    );
    writeFileSync(join(tempDir, 'createQueue.ts'), 'export class Queue {}\n');

    const result = runGenerateSourceEntry();

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "Duplicate export name 'Queue' found in ./Queue and ./createQueue."
    );
  });
});
