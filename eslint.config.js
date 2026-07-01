const { join } = require('node:path');
const { defineConfig } = require('eslint/config');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const { configs, includeIgnoreFiles } = require('eslint-config-porky');

module.exports = defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  configs.recommended,
  includeIgnoreFiles([join(__dirname, '.prettierignore')]),
]);
