# Delivery evidence

Date: 2026-10-25. All in-scope SC-001–SC-005 are implemented and verified. [Scope](README.md), [task graph](tasks/README.md) and [boundary review](code-audit/audit.md).

## Contract checkpoint

Backend repository: https://github.com/Weretik/BreviERP.git; full immutable commit `4f1727e833ed8ba4717562663382ed2b79b8b337`. A verified local checkpoint includes prior catalogue/pricing delivery and the new bounded publication projection. The pre-existing unrelated change to the backend general SDD index was excluded. Nothing was pushed.

`npm run contracts:sync -- <clean-backend-checkout> 4f1727e833ed8ba4717562663382ed2b79b8b337`, then `npm run contracts:generate` and `npm run contracts:check`: exit 0. The check regenerates into a temporary location and confirms exact snapshot provenance/types. A temporary detached clean checkout supplied the source; no snapshot/type file was hand-edited. Generator formatting explicitly bypasses general generated-artifact ignores while retaining .gitignore protection.

Backend enabler evidence: 40 focused Unit/contract checks, 9 pricing PostgreSQL/API checks, and 1 additional HTTP batch-binding/access check passed. The projection validates 1–100 unique positive IDs, uses two set queries, returns latest stored tiers and no actor/cost payload, and requires CatalogRead. No schema migration is added by TS-005.

## Red and Green

- `product-pricing.mapper.unit.test.ts`: both initial tests failed for the intended behavior — a legacy amount 999 remained visible, and null imported Sewing detail threw. Both pass after the consumer cutover.
- The first pricing component run exposed raw `Error.message` in the network-retry case (1 failed / 4 passed). The scoped error-message adapter now permits only normalized messages or a Ukrainian fallback; retry/scope-isolation passes.
- Data-access pricing checks: 7 passed. They cover mapped server totals, malformed values/readiness/scope, request UUID echo, missing publication, duplicate/wrong batch membership, POST identity/body and one-request batch transport.
- Pure model selection: 2 passed. Wholesale comes from published Articles; loading/error/no-publication never uses old amounts; PPE retains its original model.
- Feature pricing/composition/card/list checks: 15 passed across four selected files. Six new pricing cases cover explicit calculation/publication, dirty/readonly gates, blockers, retained old publication, UUID retry/Article isolation and stale conflict. Nine directly affected existing consumer cases passed.
- Product projection hook: 2 passed, covering one sorted Sewing-ID batch, PPE exclusion, recoverable error and retry without legacy fallback.
- UI price labels/manufacturing compatibility: 4 passed, covering missing/loading/error/published-zero distinctions and existing Sewing/PPE presentation.

Total: 30 focused frontend tests. No new rule is implemented through frontend monetary arithmetic; tests verify retained backend amounts and published-price selection.

## Exact focused commands

From repository root:

```powershell
node node_modules/vitest/vitest.mjs run --config libs/admin/products/data-access/vitest.config.mts libs/admin/products/data-access/src/mappers/sewing-pricing libs/admin/products/data-access/src/api/sewing-pricing
node node_modules/vitest/vitest.mjs run --config libs/admin/products/model/vitest.config.mts libs/admin/products/model/src/queries/sewing-pricing
node node_modules/vitest/vitest.mjs run --config libs/admin/products/feature/vitest.config.mts --maxWorkers=1 --testTimeout=15000 libs/admin/products/feature/src/components/sewing-pricing/sewing-pricing-feature.component.test.tsx libs/admin/products/feature/src/components/sewing-composition/sewing-composition-feature.component.test.tsx libs/admin/products/feature/src/pages/product-detail/product-detail-page.component.test.tsx libs/admin/products/feature/src/pages/product-list/products-page.component.test.tsx
node node_modules/vitest/vitest.mjs run --config libs/admin/products/feature/vitest.config.mts --maxWorkers=1 --testTimeout=15000 libs/admin/products/feature/src/hooks/sewing-pricing/use-published-product-prices.unit.test.tsx
node node_modules/vitest/vitest.mjs run --config libs/admin/products/ui/vitest.config.mts --maxWorkers=1 --testTimeout=15000 libs/admin/products/ui/src/product-detail/product-wholesale-price-label.unit.test.ts libs/admin/products/ui/src/product-detail/product-calculations.component.test.tsx
```

All final commands exited 0. Two existing MUI/JSDOM cases initially exceeded their default 5-second timeout on Windows. The scoped 15-second limit passed with their assertions unchanged; no timeout or assertion was disabled globally.

Type checks: `node node_modules/typescript/bin/tsc --noEmit --project libs/admin/products/<model|data-access|ui|feature>/tsconfig.lib.json` and the data-access/feature tsconfig.spec.json checks all exited 0. Boundary lint runs only affected files, with NX_DAEMON=false and NX_ISOLATE_PLUGINS=false after a daemon-backed preparation hang. The remaining import-order finding was corrected. Final formatting/navigation/diff results are recorded at completion below.

Final scoped ESLint and Prettier checks passed for 53 source/test/tool files and 20 documents. Data-access tests (7/7) and its test typecheck passed again after the final strict field-copy mapping. No DTO/operation imports were found outside data-access in the new model/UI/feature areas. `git diff --check` passed. The temporary clean contract checkout was removed after synchronization; its pinned commit remains available.

Final documentation verification resolved 75 links across 20 documents, confirmed the exact workspace contract pin, and passed Prettier and diff checks.

## Boundaries and limits

Server payloads remain in RTK Query. Feature state contains identities/transient flags only. Read and write operations are capability-gated; backend is the authorization/concurrency authority. Runtime mappers reject wrong scope, invalid IDs/dates/UUIDs, nonfinite amounts and inconsistent calculated/blocked data. User strings follow Ukrainian MUI conventions and existing theme/breakpoints.

Storefront currently uses local catalog UI and does not consume the old price fields searched in this scope. Its future Product API adoption, PPE pricing, global settings editing, quotes, browser/E2E/visual checks, production build and deployment were not performed. No actual imported composition was reviewed or real price published by implementation tools. The existing backend NU1903 advisory is unrelated to this consumer feature.

This Article consumer uses approved versioned references. Creating an entirely new/unversioned reference requires a unit-aware backend pricing onboarding workflow; this UI does not infer units, fabricate costs or create input versions. Existing imported reference baselines and their normal versioned price/norm edits are supported.
