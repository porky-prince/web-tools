import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      exclude: ['**/*.test.*'],
    }),
  ],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      fileName: () => 'index.js',
      formats: ['cjs'],
    },
    minify: false,
    outDir: 'dist',
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
    target: 'es2015',
  },
});
