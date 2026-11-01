# P6 registry UI and new-selection creation — 2026-11-01

## Scope and result

User authorized the next two P6 items with multiple agents. FE-009 now consumes TS-017 registry management; FE-011 closes the agreed new-selection creation deferral. P6-A owned application models/runtime mapping/API; P6-B owned separate registry UI/orchestration; P6-C owned introduction integration. Coordinator owned routes, permission composition, shared evidence and integration checks. Previous P5 status edits and send-only changes were preserved.

Admin can page/read immutable email versions, create a plain-text subject/body version and activate it only after explicit confirmation against the current settings revision. Manager reads only. Create never autoactivates or sends. Unknown writes retain the captured same-key payload and lock editing, conflicts preserve the form, stale detail responses are ignored, and access loss clears private state. Mutation-denied recovery reloads the page because the existing action hook keeps denied writes locked.

New seasonal selections choose an actual immutable email version from a paged registry. Explicit choice survives paging. A historical saved reference is preserved until deliberately changed, including a transient registry outage; new/changed IDs must be known from a successful registry read. Arbitrary IDs, loading/empty/error registry and access denial do not permit new references. Existing save/check/apply/server-price behavior is reused. Quotes and Introductions both link to /crm/email-templates.

## Contract and boundaries

Provenance remains SOURCE.json backend SHA cc7629de24a09333f644eea77ba51fb1363468c7. All five registry operations already exist in the aggregate and generated API. New transport inputs derive from operation-specific generated types; application views stay in model. Runtime mapping validates IDs, text bounds, time, settings revision, duplicates and page metadata. Detail and activation responses must match the requested version. Successful writes invalidate registry/settings and the existing compact active-template query; denied responses remain observable before private-cache clearing.

The initial UI implementation attempted a forbidden feature-to-core auth import. This was caught by scoped Nx ESLint and fixed without exemptions: app EmailTemplateAccess reads core session and supplies a lightweight feature-owned context around only the registry route. The lazy page remains lazy. The default context and refreshing/denied session block writes. No backend, module dependency rule, HTTP operation or schema was changed.

## Red / Green and integration evidence

- P6-A mapper Red2failed/8passed; HTTP Red1failed/7passed caught the incorrect detail route. Canonical detail is /api/crm/email-templates/{versionId}.
- P6-B validator Red5failed/2passed covered bounds, CR/LF and unsupported placeholders.
- P6-C Red4failed/7passed covered arbitrary IDs and loading/empty/error registry guards.
- Coordinator route Red1failed/4passed on the missing registered route; subsequent route/navigation regression passed5.

Final behavior checks, **76 unique passing tests**, zero failed/skipped:

| Boundary                                                       | Command/filter                                                                                                                  | Passed |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -----: |
| Registry mapping/HTTP plus existing delivery consumer          | npx vitest run --config libs/admin/clients/data-access/vitest.config.mts email-template-registry p6-documents                   |     31 |
| Registry validation/role injection/replay/conflict/access loss | npx vitest run --config libs/admin/clients/feature/vitest.config.mts email-template-draft.unit use-email-template-registry.unit |     15 |
| Registry pure UI                                               | npx vitest run --config libs/admin/clients/ui/vitest.config.mts email-template-registry.component                               |      3 |
| Introduction editor and page                                   | npx vitest run --config libs/admin/clients/feature/vitest.config.mts use-introduction-editor.unit introductions-page.component  |     16 |
| Introduction form UI                                           | npx vitest run --config libs/admin/clients/ui/vitest.config.mts introduction-editor.component                                   |      4 |
| Integrated registry page + Quotes route                        | npx vitest run --config libs/admin/clients/feature/vitest.config.mts email-templates-page.integration quotes-page.component     |      6 |
| App permission adapter                                         | npx vitest run --config apps/admin-react/vitest.config.mts email-template-access.component                                      |      1 |

The real-page integration uses real RTK Query state and runtime mapping with a recording fake fetch. It verifies create is a separate POST, activation has no request until dialog confirmation, the confirmed PUT contains the saved version/current revision, and active read state refreshes. It is not a browser E2E or deployed API proof. Agent tests also verify same-key retry, Manager read-only behavior, no-provider fail-closed default, missing activation settings, registry pagination and preserved historical selection references.

Data-access lib TypeScript and spec TypeScript with explicit --types node,vitest/globals passed. Default data-access spec config lacks Node fixture types already used by existing tests; no shared config was changed. Feature/UI spec TypeScript passed after permission-context repair, including the integrated page test. Scoped agent ESLint/Prettier checks passed. Coordinator app-type/lint/documentation check results are appended below.

Contract verification initially reported stale generated types solely because the Windows working copy was CRLF and temporary generation LF. Normalized contents were identical. Existing contracts:generate recreated the same pinned artifact; contracts:check then passed, and git diff for contract snapshot/provenance/generated types was empty. No manual generated DTO or provenance edit was made.

## Structure and limits

Types, registry mapping, cache-loss handling, API, pure input validation, permission context, orchestration and three presentational components have separate files. The registry hook is174 lines; UI components47–57 lines; context19 lines. Introduction registry choices live in a dedicated small hook. App-level permissions remain outside clients feature. No duplicate price engine, template expansion, quote store or send pipeline was added.

Remaining P6 work: operator-confirmed unknown outcome-resolution API/UI and actual configured OAuth/controlled send acceptance. No real Gmail request, sending, production database operation, build/deployment, browser check, commit or push was performed. Existing temporary anonymous mode is preserved. The complete CRM migration/archive scope remains separate.

Final coordinator checks: app tsconfig.spec.json exited0. Scoped ESLint for app composition/routes/integration files exited0 after refreshing the stale Nx project graph with nx show project; no rules were disabled. This also resolved false app-import errors on existing dashboard/reminders aliases. Contract check passed, snapshot/provenance/generated semantic diff is empty, and git diff --check exited0. Documentation check result is recorded with the final handoff.

Documentation verification: npm run docs:check passed540 Markdown files with no broken links, empty files or duplicates.
