# FE-005 independent comparison checkpoint — 2026-10-28

P3 is authorized. TS-005 backend is prepared and verified; its new immutable revision and FE-EN-002 contract sync are pending explicit local commit permission. This checkpoint implements only independent model/presentation work and does not claim connected history, lifecycle operations or completed FE-005.

## Implemented

- `model/src/entities/quotes/quote-price-source.ts`: typed source provenance value, referenced optionally by existing price basis. Optional means old in-memory bases may lack provenance; comparison reports unknown rather than unchanged.
- `model/src/entities/quotes/quote-basis-comparison.ts` and `mappers/quotes/compare-quote-basis.ts`: compares all three stored/server-preview amounts and source versions; preserves nulls, reports blockers and mismatched selection; copies reference IDs before sorting. No pricing formulas or HTTP/React/generated imports.
- `ui/src/components/quotes/quote-price-comparison.tsx`: Ukrainian old/new tier table, source-change state, missing-price and selection-mismatch warnings, responsive horizontal container. Pure props; no requests or write action. Public UI/model exports added.

The component is prepared for the FE-005 confirmation flow and is not yet mounted on a route. Existing P2 behavior, contract snapshot and generated types remain unchanged. No unpinned operation consumer or handwritten transport DTO was added.

## Verification

Red: `vitest run --config libs/admin/clients/model/vitest.config.mts compare-quote-basis.unit.test.ts` — 4 behavior tests failed because the newly introduced comparison entry point had no implementation (explicit throwing scaffold; no compile/runner failure).

Green/regression:

| Command (run through `node node_modules/...`)                        | Result                   |
| -------------------------------------------------------------------- | ------------------------ |
| Vitest model complete target                                         | 20 passed across 7 files |
| Vitest feature `quote-price-comparison.component.test.tsx`           | 2 passed                 |
| TypeScript `--noEmit -p libs/admin/clients/model/tsconfig.spec.json` | Passed                   |
| TypeScript `--noEmit -p libs/admin/clients/ui/tsconfig.lib.json`     | Passed                   |
| Scoped ESLint on new/changed comparison files                        | Passed                   |
| Prettier on new/changed comparison files                             | Formatted                |

`NX_DAEMON=false`, `NX_ISOLATE_PLUGINS=false` used. No browser/manual/visual checks. Existing model tests provide regression of draft/basis lifetime and ordering. No commit/push performed.

## Dependency

Subsequent checkpoint: user authorized TS-005 commit; [P3 audit/handoff](p3-audit-handoff-2026-10-28.md) records `f185138fc1cfc6c71cf94fe4e7103652e6719b5b` and successful sync/generate/check. The original pending-permission state below is historical; connected FE-005 remains implementation work.

Repository `AGENTS.md` requires direct commit permission. Frontend `docs/architecture/api/contract-workflow.md` requires a clean checkout at the pinned backend revision. The prior permission was used for P2; a new local TS-005 commit request is pending. Continue FE-005 by committing the verified backend only if authorized, synchronizing/generating/checking its contract and implementing data-access plus history/reprice/copy/transfer/archive flows.
