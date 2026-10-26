# Structural refactor verification — 2026-10-25

Scope: AF-SP05–07, TS-001/002/003. Internal decomposition only; no new behavior. Existing feature characterization replaces an artificial Red cycle for file extraction.

## Automated evidence

All commands run from the frontend repository and completed with exit code 0.

- Before refactor: `node node_modules/vitest/vitest.mjs run --config libs/admin/products/feature/vitest.config.mts --maxWorkers=1 --testTimeout=15000 libs/admin/products/feature/src/components/sewing-pricing/sewing-pricing-feature.component.test.tsx` — 6 passed.
- After refactor: same command — 6 passed. Covers explicit calculation/publication, dirty/read permissions, blockers, retry UUID/scope isolation, stale conflict and retained published tiers.
- `node node_modules/vitest/vitest.mjs run --config libs/admin/products/data-access/vitest.config.mts libs/admin/products/data-access/src/mappers/sewing-pricing libs/admin/products/data-access/src/api/sewing-pricing` — 10 passed. Includes three added batch-boundary regression cases: stored values/transport-field exclusion, duplicate/count inconsistency, malformed amount/identity/date.
- `node node_modules/typescript/bin/tsc --noEmit --project libs/admin/products/<project>/tsconfig.lib.json` for `ui`, `feature`, `data-access`, plus `data-access/tsconfig.spec.json` — passed.
- Scoped ESLint with `NX_DAEMON=false`, `NX_ISOLATE_PLUGINS=false`; Prettier write/check for affected files; `git diff --check` — passed.

## Review

UI sections use only application models and callbacks. Narrow `Pick` props share the existing public panel contract without widening exports. Feature write state holds only retry identity and transient error/conflict flags; server payloads remain in RTK Query. Saved calculation selection remains in the read orchestrator. Existing keyed Article entry resets workflow state. All validation guards and explicit three-tier copies are retained. No request loops, raw error display, token storage, new route or global state were added.

No production directory reaches eight direct files in the changed pricing capability. No old breakdown/blocker import remains. Existing Ukrainian text, locale, responsive MUI props and gates are preserved. Backend adapter was inspected statically and retained as a cohesive bounded read; no backend source, API contract or database change was made.

Only focused automated checks were run. No full suite, browser, visual test, production build, import, migration or publication was performed. Unrelated working-tree changes were preserved.
