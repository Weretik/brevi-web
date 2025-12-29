const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

const only = (configs, files) =>
  configs.map((c) => ({
    ...c,
    files,
  }));

module.exports = [
  {
    ignores: [
      '**/.angular/**',
      '**/dist/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.{ts,js}'],
    ...eslint.configs.recommended,
  },

  ...only(tseslint.configs.recommended, ['**/*.ts']),
  ...only(angular.configs.tsRecommended, ['**/*.ts']),

  {
    files: ['**/*.ts'],
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
      '@angular-eslint/use-lifecycle-interface': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  ...only(angular.configs.templateRecommended, ['**/*.html']),

  {
    files: ['**/*.{ts,js,html}'],
    ...prettierConfig,
  },
];
