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
    ignores: ['**/.angular/**', '**/dist/**', '**/coverage/**', '**/node_modules/**'],
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

  // 0) Forbid relative imports into admin/storefront (force aliases)
  {
    files: ['src/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../**/admin/**', './**/admin/**'],
              message: 'Use @admin/* imports. Relative imports into admin are forbidden.',
            },
            {
              group: ['../**/storefront/**', './**/storefront/**'],
              message: 'Use @storefront/* imports. Relative imports into storefront are forbidden.',
            },
          ],
        },
      ],
    },
  },

  // 1) Admin does not have the right to import from Storefront
  {
    files: ['src/app/admin/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/storefront/**'],
              message:
                'Admin cannot import from Storefront. Move shared code to src/app/shared (or core).',
            },
          ],
        },
      ],
    },
  },

  // 2) Storefront does not have the right to import from Admin
  {
    files: ['src/app/storefront/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/admin/**'],
              message:
                'Storefront cannot import from Admin. Move shared code to src/app/shared (or core).',
            },
          ],
        },
      ],
    },
  },

  // 3) prohibition of relative imports between contexts
  {
    files: ['src/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@admin/features/*/*', '@admin/features/*/**'],
              message:
                'Do not deep-import from admin feature internals. Import only from @admin/pages/<feature> (public API index.ts).',
            },
            {
              group: ['@storefront/features/*/*', '@storefront/features/*/**'],
              message:
                'Do not deep-import from storefront feature internals. Import only from @storefront/features/<feature> (public API index.ts).',
            },
          ],
        },
      ],
    },
  },
  // 4) Core does not depend on pages
  {
    files: ['src/app/admin/core/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@admin/features/**'],
              message: 'admin/core must not depend on admin/features.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/app/storefront/core/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@storefront/features/**'],
              message: 'storefront/core must not depend on storefront/features.',
            },
          ],
        },
      ],
    },
  },

  // 5) Shared does not depend on features
  {
    files: ['src/app/admin/shared/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@admin/features/**'],
              message: 'admin/shared must not depend on admin/features.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/app/storefront/shared/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@storefront/features/**'],
              message: 'storefront/shared must not depend on storefront/features.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['**/*.{ts,js,html}'],
    ...prettierConfig,
  },
];
