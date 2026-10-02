const js = require('@eslint/js');
const nx = require('@nx/eslint-plugin');
const angular = require('angular-eslint');
const prettierConfig = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');
const globals = require('globals');
const tseslint = require('typescript-eslint');

const only = (configs, files) =>
  configs.map((c) => ({
    ...c,
    files,
  }));

module.exports = [
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.angular/**',
      '**/node_modules/**',
      '**/.nx/**',
      '**/tmp/**',
      '**/.vite/**',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
      '**/playwright-report/**',
      '**/test-results/**',
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
    files: [
      '**/*.spec.{ts,tsx}',
      '**/*.test.{ts,tsx}',
      '**/test-setup.{ts,tsx}',
      '**/vitest.setup.{ts,tsx}',
      '**/test/**/*.{ts,tsx}',
    ],
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
            // storefront can only depend on shared and storefront
            {
              sourceTag: 'scope:storefront',
              onlyDependOnLibsWithTags: ['scope:storefront', 'scope:shared'],
            },
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

            // Pure domain model stays framework and transport independent.
            {
              sourceTag: 'type:model',
              onlyDependOnLibsWithTags: ['type:model', 'type:util', 'scope:shared'],
            },

            // Generated contracts do not depend on runtime application layers.
            {
              sourceTag: 'type:contract',
              onlyDependOnLibsWithTags: ['type:contract', 'type:util', 'scope:shared'],
            },

            // Shared API client owns the transport base used by domain endpoints.
            {
              sourceTag: 'type:api-client',
              onlyDependOnLibsWithTags: [
                'type:api-client',
                'type:contract',
                'type:util',
                'scope:shared',
              ],
            },

            // Presentation can use domain models, but never feature or data-access.
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:model', 'type:util', 'scope:shared'],
            },

            // Domain endpoints map transport contracts into domain models.
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: [
                'type:data-access',
                'type:api-client',
                'type:contract',
                'type:model',
                'type:util',
                'scope:shared',
              ],
            },

            // Feature orchestrates domain UI, models and data access.
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:model',
                'type:util',
                'type:data-access',
                'type:api-client',
                'scope:shared',
              ],
            },

            // Core composes application capabilities without becoming a domain owner.
            {
              sourceTag: 'type:core',
              onlyDependOnLibsWithTags: [
                'type:core',
                'type:feature',
                'type:ui',
                'type:model',
                'type:data-access',
                'type:api-client',
                'type:contract',
                'type:util',
                'scope:shared',
              ],
            },

            // Application is the composition root.
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:core',
                'type:feature',
                'type:ui',
                'type:model',
                'type:data-access',
                'type:api-client',
                'type:contract',
                'type:util',
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
