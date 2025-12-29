import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 0) Игноры для Nx/монорепо
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
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // 2) TypeScript recommended
  ...tseslint.configs.recommended,

  // 3) Angular TS rules —  apps/libs
  ...angular.configs.tsRecommended.map((cfg) => ({
    ...cfg,
    files: ["apps/**/*.ts", "libs/**/*.ts"],
  })),

  // 4) Inline templates в TS (Angular components)
  {
    files: ["apps/**/*.ts", "libs/**/*.ts"],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/use-lifecycle-interface": "off",
    },
  },

  // 5) Angular HTML template rules — apps/libs
  ...angular.configs.templateRecommended.map((cfg) => ({
    ...cfg,
    files: ["apps/**/*.html", "libs/**/*.html"],
  })),

  // 6) Test (минимально)
  {
    files: ["**/*.spec.ts", "**/*.test.ts", "**/vitest.setup.ts", "**/test/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },

  // 7) Node-configs/scripts
  {
    files: ["**/*.config.{js,ts,mjs,cjs}", "tools/**/*.{js,ts}", "scripts/**/*.{js,ts}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]);
