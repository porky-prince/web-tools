import { readFileSync } from 'node:fs';
import { posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);
const sourceEntry = fileURLToPath(new URL('./src/index.ts', import.meta.url));

function getExportDefault(condition) {
  const rootExport = packageJson.exports?.['.'];
  const conditionalExport = rootExport?.[condition];

  if (typeof conditionalExport === 'string') {
    return conditionalExport;
  }

  return conditionalExport?.default;
}

function getBuildOutput(outputPath) {
  if (!outputPath) {
    return null;
  }

  const normalized = outputPath.replace(/^\.\//, '');

  return {
    fileName: posix.basename(normalized),
    outDir: posix.dirname(normalized),
  };
}

const cjsOutput = getBuildOutput(
  packageJson.main ?? getExportDefault('require')
);
const esmOutput = getBuildOutput(
  packageJson.module ?? getExportDefault('import')
);
const outputDirs = new Set(
  [cjsOutput, esmOutput].filter(Boolean).map((output) => output.outDir)
);
const formats = [esmOutput && 'es', cjsOutput && 'cjs'].filter(Boolean);

if (outputDirs.size > 1) {
  throw new Error('All package entry files must be written to the same dir.');
}

if (formats.length === 0) {
  throw new Error('package.json must define a main or module entry.');
}

export default defineConfig({
  plugins: [
    dts({
      exclude: ['**/*.test.*'],
    }),
  ],
  build: {
    lib: {
      entry: sourceEntry,
      fileName: (format) => {
        if (format === 'es' && esmOutput) {
          return esmOutput.fileName;
        }

        if (format === 'cjs' && cjsOutput) {
          return cjsOutput.fileName;
        }

        throw new Error(`Unsupported package format: ${format}`);
      },
      formats,
    },
    minify: false,
    outDir: Array.from(outputDirs)[0] ?? 'dist',
    rollupOptions: {
      treeshake: true,
      output: {
        exports: 'named',
      },
    },
    target: 'es2015',
  },
});
