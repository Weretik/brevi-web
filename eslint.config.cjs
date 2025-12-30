const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const nx = require("@nx/eslint-plugin");
const importPlugin = require("eslint-plugin-import");

const only = (configs, files) =>
  configs.map((c) => ({
    ...c,
    files,
  }));

module.exports = [
  {
    ignores: [
      "**/dist/**",
      "**/coverage/**",
      "**/.angular/**",
      "**/node_modules/**",
      "**/.nx/**",
      "**/tmp/**",
      "**/.vite/**",
    ],
  },

  {
    files: ["**/*.{js,mjs,cjs}"],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  ...only(tseslint.configs.recommended, ["**/*.{ts,tsx,mts,cts}"]),
  ...only(angular.configs.tsRecommended, ["apps/**/*.ts", "libs/**/*.ts"]),
  ...only(angular.configs.templateRecommended, ["apps/**/*.html", "libs/**/*.html"]),

  {
    files: ["apps/**/*.html", "libs/**/*.html"],
    rules: {
      "@angular-eslint/template/alt-text": "off",
    },
  },
  {
    files: ["**/*.spec.ts", "**/*.test.ts", "**/vitest.setup.ts", "**/test/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },

  {
    files: ["**/*.config.{js,ts,mjs,cjs}", "tools/**/*.{js,ts}", "scripts/**/*.{js,ts}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    files: ["apps/**/*.ts", "libs/**/*.ts"],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/component-selector": "off",
      "@angular-eslint/directive-selector": "off",
      "@angular-eslint/use-lifecycle-interface": "off",
    },
  },
];
