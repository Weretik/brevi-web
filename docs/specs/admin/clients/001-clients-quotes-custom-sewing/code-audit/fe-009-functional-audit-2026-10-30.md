# FE-009 functional and responsibility audit — 2026-10-30

## Scope and sources

User asked to audit/refactor only the just-delivered P6 frontend: explicit delivery/history, production ZIP and API integration. One agent reviewed current model/data-access/feature/UI, captured write actions, editor locks/scope keys, private access loss, binary checks, loading/error/empty states and the pinned contract. Sources: root AGENTS, Admin code organization/UI/API rules, FE-009 and its P6 design. Unrelated existing working changes, backend/Google setup, generated DTO and public routes/schema are preserved. This is a scoped code/behavior audit, not repository-wide or visual browser acceptance.

## Findings

| ID           | Severity/status         | Exact path/evidence                                                                                                                                                                                                                   | Rule, impact and resolution                                                                                                                                                                                                                       | Owner/task/dependency/verification                                                                                                                                                                               |
| ------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AF-FE-P6-001 | Medium / verified       | `libs/admin/clients/data-access/src/cache/quotes/quote-document-access-loss.ts:18`: resetApiState ran synchronously after the lifecycle rejection. In the HTTP regression, history unwrap resolved undefined instead of rejecting403. | Expected API errors must remain observable and private cache must clear. Defer reset to the next event-loop turn after the rejected result settles. Keep one shared document lifecycle for P5/P6, not a second duplicate handler.                 | Frontend data-access, FE-009/SC-D03; shared PDF dependency tested. Red1failed/5passed (history expected403 reject, actual resolvedundefined); Green tests403/404 for history/enqueue/export and cache emptiness. |
| AF-FE-P6-002 | Low / verified refactor | `libs/admin/clients/data-access/src/api/documents/production-package.api.ts` contained metadata/export endpoint definitions and binary download/MIME/size/signature/hash work.                                                        | One primary responsibility per file. Move authenticated binary read and integrity verification to `download-production-package.ts`; metadata/export remain in production-package.api. Public barrel exports stay stable.                          | Frontend data-access, FE-009/SC-S06. Actual HTTP fixture verifies request selections, saved ZIP and tampered hash; feature download/access/late-result tests pass.                                               |
| AF-FE-P6-003 | Low / verified refactor | `libs/admin/clients/data-access/src/api/documents/quote-delivery.api.ts` also owned independent active email-template reads; shared base used a temporary P6 name and a mapper barrel existed only for tests.                         | Separate email-template.api; name the shared API/error/URL boundary `quote-document-api.ts`; remove the unnecessary private mapper barrel and import the real mappers in tests. Keep existing capability folders and public model/API boundaries. | Frontend data-access, FE-009/FE-EN-002. Active-template HTTP case, mapper cases, public-hook interaction tests, typechecks and scoped lint verify unchanged consumer imports.                                    |

All three findings are verified in the final state. No new independent Nx library/folder hierarchy is justified: Domain/application views, transport, orchestration and pure MUI components already occupy distinct roles. Small coherent hooks and dialog/history components remain together by scenario.

## Retained correctness and architecture

- Generated transport types remain inside data-access; immutable quote/version/PDF/template identities are checked before mapping. No pricing or tax formula enters UI.
- Explicit confirmation and captured requestId/intent/template remain intact. Network uncertainty freezes editable inputs; same-key retry is user-triggered; double clicks cannot submit twice. Late/unmounted owner/version scope responses cannot restore local artifacts.
- History remains bounded/paged/read-only; queued/unknown are never sent. Active-template absence blocks new send. Backend remains authoritative for readiness/access and exact issued source.
- ZIP download validates MIME/length/signature/SHA before local saving, with an opaque local filename. No server path/URL is trusted. Direct binary access denial still clears local/private state through the feature action.
- Reviewed MUI theme tokens, responsive Stack layouts, semantic buttons/dialog/checkbox labels and Ukrainian strings in code. No raw HTML, credentials, private localStorage, new route, global store or theme change. Browser/manual visual review was not run.

## Final file responsibilities

```text
data-access/src/api/documents/
  quote-document-api.ts               shared document API tags, URL and safe error mapping
  quote-delivery.api.ts                delivery history/detail/enqueue
  email-template.api.ts                active immutable email-template read
  production-package.api.ts            export/private artifact metadata
  download-production-package.ts       authenticated bytes and ZIP integrity
data-access/src/cache/quotes/
  quote-document-access-loss.ts        rejected outcome then private cache clearing
data-access/src/mappers/documents/     separate delivery/template/package runtime projections
feature/{hooks,components}/documents/  captured intent/editor lock and scoped panel composition
ui/src/components/documents/           pure confirmation/history/selection presentation
```

## Verification

- Red `npx vitest run --config libs/admin/clients/data-access/vitest.config.mts p6-documents.integration`: exit1,1failed/5passed; the intended history403 rejection was swallowed by immediate cache reset. Mutations already rejected; their assertions were retained.
- Final `npx vitest run --config libs/admin/clients/data-access/vitest.config.mts p6-documents quote-document-access-loss documents.integration`: exit0, **19passed**. Includes4mapper,9P6 HTTP cases (403/404 x3 operations),3shared access-lifecycle and3existing seller/ready/PDF HTTP cases. Repeats are not double-counted.
- `npx vitest run --config libs/admin/clients/feature/vitest.config.mts p6-panels.component use-quote-documents.unit`: exit0, **12passed** (9P6 interactions +3PDF regressions). Covers explicit confirmation/Enter, unknown status, captured ID/template, duplicate click, allowed custom selection, binary access loss and late responses.
- Total **31 unique focused tests passed**.
- `npx tsc --noEmit -p libs/admin/clients/data-access/tsconfig.spec.json`: exit0. Same feature spec target: exit0; it includes production source and UI imports.
- Scoped ESLint/Prettier applied only10 audited TypeScript files. Contract snapshot/generated source and backend SHA `3ad90271721bc58b61fa1efa11ae6c2cd87e9866` unchanged, so contract regeneration was not repeated for file-only boundary changes.
- Final diff/link/lint results appended below.

No backend/migration/commit/push or real mail action in this audit. Google consent/live-send acceptance and template-management/new-selection integration remain separate and are not closed by these automated checks. No confirmed open blocker remains in this bounded frontend scope.

Final audit closure: scoped ESLint10files exit0; local report/map/evidence links resolve; git -c core.safecrlf=false diff --check exit0. Final source line18 implements the deferred private reset. Pinned SOURCE commit remains3ad90271721bc58b61fa1efa11ae6c2cd87e9866.
