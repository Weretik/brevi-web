const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const nx = require('@nx/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const prettierConfig = require('eslint-config-prettier');

const only = (configs, files) =>
  configs.map((c) => ({
    ...c,
    files,
  }));

module.exports = [
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/.angular/**',
      '**/node_modules/**',
      '**/.nx/**',
      '**/tmp/**',
      '**/.vite/**',
    ],
  },

  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  ...only(tseslint.configs.recommended, ['**/*.{ts,tsx,mts,cts}']),
  ...only(angular.configs.tsRecommended, ['apps/**/*.ts', 'libs/**/*.ts']),
  ...only(angular.configs.templateRecommended, ['apps/**/*.html', 'libs/**/*.html']),

  {
    files: ['apps/**/*.html', 'libs/**/*.html'],
    rules: {
      '@angular-eslint/template/alt-text': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/vitest.setup.ts', '**/test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },

  {
    files: ['**/*.config.{js,ts,mjs,cjs}', 'tools/**/*.{js,ts}', 'scripts/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    files: ['apps/**/*.ts', 'libs/**/*.ts'],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/component-selector': 'off',
      '@angular-eslint/directive-selector': 'off',
      '@angular-eslint/use-lifecycle-interface': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx,mts,cts,js,mjs,cjs}'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    plugins: {
      '@nx': nx,
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],

          // Important: we prohibit “deep” imports into src/lib/*
          // We only allow public entry points (index.ts) via importPath aliases.
          banTransitiveDependencies: true,

          depConstraints: [
            // brevi-app can depend on everything
            {
              sourceTag: 'scope:brevi-app',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:storefront', 'scope:admin'],
            },

            // storefront can only depend on shared and storefront

            // admin can only depend on shared and admin
            {
              sourceTag: 'scope:admin',
              onlyDependOnLibsWithTags: ['scope:admin', 'scope:shared'],
            },

            // shared — from no one (except shared)
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },

            // UI libraries should not pull data access
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:util', 'type:feature', 'scope:shared'],
            },

            // data-access can be used from feature, but data-access should not pull feature
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:util', 'scope:shared'],
            },

            // feature can pull ui/util/data-access into its scope
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:util',
                'type:data-access',
                'scope:shared',
              ],
            },
          ],
        },
      ],
    },
  },

  prettierConfig,
];
