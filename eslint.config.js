// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const boundaries = require("eslint-plugin-boundaries");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,

    ],
    processor: angular.processInlineTemplates,

    plugins: {
      boundaries: require("eslint-plugin-boundaries"),
    },
    settings: {
      "boundaries/elements": [
        // --- storefront features:
        { type: "storefront-home",    pattern: "src/app/storefront/features/home/**" },

        // --- admin features:
        { type: "admin-reference",    pattern: "src/app/admin/features/reference/**" },
        { type: "admin-crm",    pattern: "src/app/admin/crm/reference/**" },

        // --- zone shells (layout, routes, etc.) ---
        { type: "storefront",         pattern: "src/app/storefront/**" },
        { type: "admin",              pattern: "src/app/admin/**" },

        // --- general layers ---
        { type: "core",               pattern: "src/app/core/**" },
        { type: "shared",             pattern: "src/app/shared/**" },
        { type: "theme",             pattern: "src/app/theme/**" },
      ],
    },

    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "allow",
          rules: [
            {
              from: ["storefront", "storefront-home", "storefront-catalog"
              ],
              allow: ["storefront", "storefront-home", "shared", "core", "theme"],
            },

            {
              from: "admin",
              allow: ["admin", "shared", "core"],
            },
            // INTERNAL DOMAINS admin: everyone can use
            // only themselves, the admin shell, shared, and core
            {
              from: "admin-reference",
              allow: ["admin-reference", "admin", "shared", "core"],
            },
            {
              from: "admin-crm",
              allow: ["admin-crm", "admin", "shared", "core"],
            },

            {
              from: ["core", "shared"],
              allow: [
                "storefront",
                "storefront-home",
                "admin",
                "admin-reference",
                "admin-crm",
                "core",
                "shared"],
            },
          ],
        },
      ],

      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  }
]);
