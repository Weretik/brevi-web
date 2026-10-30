# FE-006 functional audit and responsibility split — 2026-10-28

Scope: the recently implemented private custom editor and its model/runtime boundary. User explicitly requested audit and local restructuring. Earlier FE-005/FE-006 work and the pinned contract are preserved; no commit/push, browser check, new dependency or FE-007 implementation.

## Findings

| ID           | Severity/status         | Evidence and impact                                                                                                                                                                                                                                                                                                                   | Resolution/owner/verification                                                                                                                                                                                                                                                                                                       |
| ------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AF-FE-P4-003 | Medium / verified fixed | `libs/admin/clients/model/src/validators/custom-sewing/custom-configuration-validation.ts:19` prohibited repeated reference IDs, while canonical backend CustomConfiguration.Freeze permits separate rows for the same material/operation. The shared runtime mapper therefore rejected a valid saved server configuration on reopen. | FE-006 removes the extra uniqueness policy and preserves row order, quantity and per-row manual minutes without merging/recalculating. The validator also respects the existing backend 50-character material-unit bound. Positive duplicate model and DTO roundtrip tests reproduce the failure before the fix and pass afterward. |
| AF-FE-P4-004 | Low / verified fixed    | `components/custom-sewing/editor/custom-editor-form.tsx` owned composition/reference orchestration plus reload confirmation, modal state and async progress.                                                                                                                                                                          | FE-006 `editor/custom-reload-action.tsx:4` owns the reload button/dialog/progress; the editor hook retains authoritative refresh/uncertainty/access rules. Existing cancellation and a confirmed-reload interaction test verify input changes only after confirmation and no hidden calculation/write.                              |

Backend acceptance is source-backed: Domain CustomConfiguration.Freeze checks each row's reference/norm/unit, does not enforce distinct references, and freezes rows without merging. The canonical arrays have no uniqueItems rule. This audit changes client acceptance to match existing server behavior; it does not add a new backend feature or change authoritative pricing. The earlier test name mentioned duplicates but mixed them with invalid zero norms; new tests isolate otherwise-valid repeated rows.

Keep the coordinated pending/uncertain/forbidden state machine in useCustomEditor together: its synchronous guards and captured request must remain consistent across actions. Keep existing split material/operation/application/identity sections and scenario-local mappers. No extra Nx library or generic utility abstraction is needed. Form remains the composition orchestrator; reload interaction now has one independent component.

Review covered alternatives/pinned versions, explicit save/calculate/version flow, protected input, 403/404 vs transient failure, captured retries and confirmation. No further confirmed open finding remains in this scope. No visual/manual gate was introduced.

## Actual Red and final regression

Before the fix, existing configured Vitest runners executed the newly added positive duplicate cases:

- Model `src/validators/custom-sewing/custom-configuration-validation.unit.test.ts`: exit1, 1 failed/3 passed. The expected empty error map instead contained fabrics/operations errors.
- Data-access `src/mappers/custom-sewing/custom-response.unit.test.ts`: exit1, 1 failed/7 passed. Valid duplicate server rows threw `Некоректна конфігурація пошиття` from mapCustomConfiguration.

Final commands run from `libs/admin/clients/<library>`:

| Library / command                                                                                                                                                                                                                                                               | Actual result    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| model: `node ../../../../node_modules/vitest/vitest.mjs run src/validators/custom-sewing/custom-configuration-validation.unit.test.ts`                                                                                                                                          | Exit0, 5 passed  |
| data-access: `node ../../../../node_modules/vitest/vitest.mjs run src/mappers/custom-sewing/custom-response.unit.test.ts`                                                                                                                                                       | Exit0, 8 passed  |
| feature: `node ../../../../node_modules/vitest/vitest.mjs run src/hooks/custom-sewing/use-custom-editor.unit.test.tsx src/components/custom-sewing/editor/custom-editor-form.component.test.tsx src/components/custom-sewing/versions/custom-version-picker.component.test.tsx` | Exit0, 13 passed |

**26 passed, zero skipped.** Covers the fix, unit length boundary, roundtrip/intent whitelisting, independent alternatives, blockers, unknown retries, access loss, denied cached previews and reload cancel/confirm. The new confirmed reload case asserts no draft save, calculation or version write occurs.

Installed Prettier formatted six changed source/test files; scoped ESLint over those six exited0 (import ordering only). `node node_modules/typescript/bin/tsc --noEmit -p libs/admin/clients/<feature|model|data-access>/tsconfig.spec.json` executed separately, all exit0. These spec graphs include the modified production types/components. No full suite, production build, E2E or browser run.

OpenAPI/SOURCE/generated types are unchanged. Consumer remains pinned to backend31424453f4bef63363167e3dc11e0bfa2857e64f; no contract sync or new backend commit is required for these local changes.

Final checks: `git diff --check` passed; `npm run docs:check` passed for 501 Markdown files with no broken links, empty files or duplicates. SOURCE.json retains SHA256 `c39368f288abc2e6d8f36a0a4878621b675238e54e7f97918c4ffcab845e5e4e`. No commit or push was made during this audit.
