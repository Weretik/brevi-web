# P6 manual outcome functional and structure audit — 2026-11-01

Scope: only the newly implemented TS-011/FE-009 manual-outcome slice: pending/unknown/expired attempts, explicit decision/evidence, read recovery, request replay, private state and presentation. Audit plus local fixes/refactoring were explicitly requested. No full repository audit, OAuth setup, dispatch, application migration or deployment is included. Existing user changes are preserved. Rules: [Admin code organization](../../../../../standards/admin/admin-code-organization.md), accepted [manual design](../design/p6-delivery-production.md), current pinned contract and SC-D03.

| ID           | Severity / final status | Exact source and evidence                                                                                                                                                                                                                                                                                                      | Impact, owner and target                                                                                                                                                                                                                                                                | Verification                                                                                                                                                                                                      |
| ------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AF-FE-P6-008 | High / verified fixed   | feature/src/components/documents/delivery/quote-delivery-panel.tsx:127 passed parent disabled to retryDisabled. Parent QuoteEditorForm mirrors the same action's uncertain lock back into disabled. The parent-feedback regression failed at toBeEnabled before the fix.                                                       | FE-009 frontend: an ambiguous manual write could not be replayed from the actual editor. Retry must respect pending/access loss while using the captured intent through the parent's own lock.                                                                                          | New quote-delivery-resolution.component test reproduces the parent lock and proves enabled retry, locked evidence and exactly the same request body/key.                                                          |
| AF-FE-P6-009 | Medium / verified fixed | feature/src/hooks/documents/delivery/use-quote-delivery.ts had no denial handling for history/template reads; write-only denial handling did not clear the selected review or prevent a delayed response. The denied-history regression failed before the fix.                                                                 | FE-009 frontend: private evidence could remain visible after read access loss and a late resolution could repopulate accepted state. Add a sticky read-access guard, clear private state, skip protected subscriptions and reject stale callbacks. Release the parent's lock on denial. | History403 during a pending resolution clears target/note, parks reads after cache error clears, releases parent lock and ignores the late response. Template401 clears recipient/manager/review and parks reads. |
| AF-FE-P6-010 | Low / verified refactor | feature/src/hooks/documents/delivery/use-delivery-resolution.ts combined local review state, write capture, read recovery and read generations. ui/src/dialogs/documents/delivery/resolve-delivery-dialog.tsx combined the controlled form with dialog context/actions. Manual UI tests were mixed into common send/ZIP tests. | FE-009 frontend: separate scenario orchestration, read-only refresh, access latching, controlled fields and focused manual UI tests. Keep one shared document action for mutation/parent locking.                                                                                       | 21 feature tests pass after extraction, including existing send/ZIP regression; TypeScript and scoped ESLint verify boundaries.                                                                                   |
| AF-FE-P6-011 | Low / verified refactor | data-access/src/mappers/documents/delivery-resolution.mapper.ts performed only runtime parsing/validation of identical DTO field names.                                                                                                                                                                                        | FE-009 data-access: place runtime response validation under validators/documents/delivery-resolution-response.ts; keep the application view conversion in quote-delivery.mapper.ts. No private DTO adapter is exported.                                                                 | 30 mapper/localhost HTTP cases pass; body, endpoint and generated contract are unchanged.                                                                                                                         |

All shortened code paths above are relative to libs/admin/clients/. No open finding remains in this audited slice. This does not close unrelated historical audit findings or live Gmail acceptance.

## Resulting responsibilities

```text
data-access/src/validators/documents/delivery-resolution-response.ts   parse runtime evidence
data-access/src/mappers/documents/quote-delivery.mapper.ts             convert delivery view
feature/src/hooks/documents/delivery/
  use-quote-delivery.ts             compose send/history/manual state, shared action
  use-delivery-resolution.ts        review form and captured result write
  use-delivery-attempt-refresh.ts   explicit read recovery and stale-read guard
  use-delivery-read-access.ts       latch denied reads and clear private state
feature/src/components/documents/delivery/
  quote-delivery-panel.tsx          compose the existing delivery screen
  quote-delivery-resolution.component.test.tsx   manual UI/parent-lock scenarios
ui/src/forms/documents/delivery/delivery-resolution-fields.tsx         controlled inputs
ui/src/dialogs/documents/delivery/resolve-delivery-dialog.tsx          context/confirmation
```

No new Nx library or domain module is needed: the existing clients model/data-access/feature/ui boundaries own these roles. Refresh remains read-only; it does not capture an uncertain write or send an email. The parent action still owns mutation request capture. Backend transaction/record/configuration/API boundaries remain unchanged.

## Verification

Red:2failed/18passed in the two relevant feature files, specifically the disabled parent-feedback retry and missing denied-history latch. First Green20passed; added template-access and lock-release coverage21passed; moved manual UI tests to their own file and reran3files/21passed.

- Feature: npx vitest run --config libs/admin/clients/feature/vitest.config.mts use-delivery-resolution.component p6-panels.component quote-delivery-resolution.component — 21passed.
- Data-access: npx vitest run --config libs/admin/clients/data-access/vitest.config.mts delivery-resolution p6-documents — 30passed.
- UI: npx vitest run --config libs/admin/clients/ui/vitest.config.mts quote-delivery-history.component — 2passed.
- Model: npx vitest run --config libs/admin/clients/model/vitest.config.mts delivery-resolution-validation — 2passed.

Total55 scoped frontend cases. Existing contract snapshot/generated types remain pinned to431d799eb468f212f10bde3e058be3a3d94974ab without edits. Type/import/docs closing checks are appended after final verification. No browser/full suite/production build is claimed.

Closing checks: feature production/test TypeScript and data-access test TypeScript passed; scoped changed-file ESLint passed; docs:check passed for543 Markdown files; git diff --check passed in both repositories. Backend fresh Domain regression:10passed,0failed/0skipped. No API/generated DTO/database change was introduced by this audit. No open in-scope finding remains.
