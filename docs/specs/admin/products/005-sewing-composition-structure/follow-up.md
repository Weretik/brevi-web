# Composition controller and form follow-up — 2026-10-25

The user authorized both the structural audit and fixes for all delivered capabilities. This follow-up preserves routes, wire contracts, drafts, review reset, stale-save handling and navigation protection.

| Finding | Evidence / owner                                                                                                                                                            | Work and status                                                                                                                    |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| AF-007  | components/sewing-composition/sewing-composition-feature.tsx:27, initially 239 lines; hook orchestration and complete screen rendering combined.                            | Verified: thin public entry, controller hook and screen composition.                                                               |
| AF-008  | ui/src/forms/sewing-composition/sewing-composition-editor.tsx:55, initially 183 lines; local validation/key lifecycle, review invalidation rules and presentation combined. | Verified: model owns pure review-reset updates; UI hook owns local form actions/errors; editor and private props own presentation. |

No new Nx library is needed. Existing model, UI and feature owners are retained; cross-library imports stay on root aliases. Generated OpenAPI/types and RTK Query transport are untouched.

The composition hooks form one coordinated lifecycle rather than multiple independent resources. The controller increases this folder to eight cohesive hooks: keep the capability folder with named lifecycle owners, and record this decision rather than adding empty or generic subfolders. Material/operation rows remain cohesive UI components despite their line counts.

Existing feature and form component tests characterize the behavior, including review reset and leave/stay/stale handling. No browser, production build or full suite was run.

## Final verification

- node node_modules/vitest/vitest.mjs run --config libs/admin/products/feature/vitest.config.mts libs/admin/products/feature/src/components/sewing-composition/sewing-composition-feature.component.test.tsx: 4/4 passed.
- The corresponding command with UI vitest.config.mts and sewing-composition-editor.component.test.tsx: 4/4 passed.
- node node_modules/typescript/bin/tsc --noEmit -p libs/admin/products/{feature,ui,model}/tsconfig.lib.json, run separately: all three passed.
- ESLint on nine changed production files: exit 0. Prettier formatted only those files.
- The initial test invocation without the library configuration lacked path aliases and ran no tests; the commands above are the valid evidence.
- Controller extraction removed TypeScript's former alias-based narrowing. The screen now checks the blocker's actual discriminant before invoking reset/proceed, preserving leave/stay behavior without optional no-op actions.
- No generated contract, RTK Query endpoint/cache or application route changed.
