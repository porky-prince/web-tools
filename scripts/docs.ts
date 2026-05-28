import { emptyDir, pathExists, readdir, readJson, writeFile } from 'fs-extra';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { PACKAGES_PATH, ROOT } from './consts';

const DOCS_PATH = join(ROOT, 'docs');

interface PackageJson {
  name?: string;
  scripts?: Record<string, string>;
}

interface DocsPackage {
  name: string;
}

async function run(command: string, args: string[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      shell: true,
      stdio: 'inherit',
    });

    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(`${command} ${args.join(' ')} exited with code ${code}`)
      );
    });
  });
}

async function getDocsPackages(): Promise<DocsPackage[]> {
  const packageDirectories = await readdir(PACKAGES_PATH);
  const docsPackages: DocsPackage[] = [];

  for (const directory of packageDirectories) {
    const packageJsonPath = join(PACKAGES_PATH, directory, 'package.json');

    if (!(await pathExists(packageJsonPath))) {
      continue;
    }

    const packageJson = (await readJson(packageJsonPath)) as PackageJson;

    if (!packageJson.name || !packageJson.scripts?.docs) {
      continue;
    }

    docsPackages.push({
      name: packageJson.name,
    });
  }

  return docsPackages;
}

async function main(): Promise<void> {
  const docsPackages = await getDocsPackages();

  if (docsPackages.length === 0) {
    throw new Error('No packages with a docs script were found.');
  }

  await emptyDir(DOCS_PATH);
  await writeFile(join(DOCS_PATH, '.nojekyll'), '');

  for (const docsPackage of docsPackages) {
    console.log(`Building docs for ${docsPackage.name}...`);
    await run('pnpm', ['--filter', docsPackage.name, 'run', 'docs']);
  }

  console.log(
    `Built docs for ${docsPackages
      .map((docsPackage) => docsPackage.name)
      .join(', ')}.`
  );
}

void main();
