# FE-008 ready/PDF presentation checkpoint — 2026-10-29

**Outcome:** partial FE-008 implementation. Ready and private PDF artifact states have pure frontend models and separate MUI presentation components. The components are not mounted in the quote editor and do not call backend operations. Backend TS-009/010 are locally verified; FE-EN-002 contract handoff remains pending.

## Implemented boundary

- `model/src/models/documents/{quote-ready-view,quote-pdf-view}.ts` derives only presentation blockers and allowed buttons from an existing `QuoteDetail`, issuer availability and the server artifact status. The server remains authoritative for ready validation, number allocation, PDF status and SHA-256.
- `ui/src/components/documents/{quote-ready-checklist,quote-pdf-actions}.tsx` shows ready requirements, queued/processing/succeeded/failed status, retry, refresh and download actions through callbacks. No local PDF, pricing calculation or network DTO is introduced.
- `model/src/index.ts` and `ui/src/index.ts` expose the new small boundaries. The earlier issuer/template forms remain separate.

## Focused verification

- From `libs/admin/clients/model`: `node ../../../../node_modules/vitest/vitest.mjs run src/models/documents/quote-ready-view.unit.test.ts src/models/documents/quote-pdf-view.unit.test.ts` — 2 files, **4/4** tests passed.
- `node ../../../../node_modules/typescript/bin/tsc --noEmit -p tsconfig.lib.json` — passed separately from `model` and `ui`; `model` spec typecheck also passed.
- Prettier check on the eight changed model/UI paths and `git diff --check` passed. Narrow ESLint stalled for more than 60 seconds and was stopped; no lint pass is claimed.

## Remaining FE-008 work

Obtain the clean immutable backend P5 SHA required by FE-EN-002, then run contract sync/generate/check. Add typed data-access for issuer settings and ready/PDF operations, mount these components in the quote editor with its existing write locks, verify retries/access/error mapping and integrated download. The UI slice alone does not satisfy FE-008 acceptance or deployment.
