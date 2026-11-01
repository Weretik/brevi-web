# P6 registry/selection functional audit — 2026-11-01

## Scope and conclusion

User requested audit and justified restructuring of only the last implemented P6 items: TS-017 / FE-009 email registry UI and TS-016 / FE-011 new selections. Reviewed permission composition, immutable version creation/activation, unknown-request replay, detail races, denied-read recovery, paged template choice, historical references, layer boundaries, folder density and test ownership. No independent agent or browser was used. Previous send-only/backend/P5 edits were preserved.

Two functional defects and two structural findings were confirmed and corrected. All four findings below are **verified**. No unresolved finding remains in this reviewed scope. This is not a repository-wide audit or live Gmail/deployment acceptance.

## Findings

| ID           | Severity / status | Evidence and impact                                                                                                                                                                                                                                                                                | Rule/source                                                                                                                                                   | Fix, owner and verification                                                                                                                                                                                                                                                                                                         |
| ------------ | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AF-FE-P6-004 | Medium / verified | Original feature/hooks/documents/email-templates/use-email-template-registry.ts:48–50 denied writes after loss of Admin but did not recognize loss of both read roles. A refreshed User-only session retained selected private message and the draft. Red expected accessDenied=true, actualfalse. | FE-009 / SC-D03 current access and private-state clearing; design/p6-delivery-production.md permission boundary.                                              | Frontend FE-009: recognize loss of both Admin/Manager; latch denial, clear selected/draft, reject stale reads. Regression in use-email-template-registry.unit.test.tsx verifies role revocation.                                                                                                                                    |
| AF-FE-P6-005 | Medium / verified | Original registry hook:24–25 kept list/settings subscriptions mounted after403. Deferred private-cache reset caused automatic resubscription: the real-page Red recorded14 HTTP calls instead of the two initial reads.                                                                            | Explicit retry/error states in FE-009; data-access cache-loss handling must not become an automatic retry loop.                                               | Frontend FE-009: latch denied read, skip protected queries until explicit recovery, and keep the denial visible. Page uses retryReadAccess rather than refetching skipped subscriptions. Real RTK test verifies two calls on persistent403, then exactly two more only after user recovery, with successful empty settings display. |
| AF-FE-P6-006 | Low / verified    | Pure form defaults/types and deterministic placeholder/length validation lived in feature/src/hooks/documents/email-templates/email-template-draft.ts:1–30. The UI repeated its own equivalent Draft type.                                                                                         | docs/standards/admin/admin-code-organization.md Libraries/dependencies and Role folders: model owns form values and pure validators; hooks own orchestration. | Frontend FE-009: move form/default/error types to model/src/forms/documents/email-template-draft.ts and validation to model/src/validators/documents/email-template-draft-validation.ts. Export public contracts; UI and feature consume model. Seven colocated pure tests pass in Node.                                            |
| AF-FE-P6-007 | Low / verified    | The registry page embedded the full activation dialog, and forms/details plus a combined three-component test lived under ui/components. Presentation roles and test ownership were mixed.                                                                                                         | Same code-organization rule: ui/forms, ui/details, ui/dialogs; tests beside their production owner.                                                           | Frontend FE-009: separate ActivateEmailTemplateDialog in ui/dialogs; move form and detail to ui/forms and ui/details. Split existing three behavior tests beside form/detail/list. The page composes public UI exports; real-page create/confirm/activate flow remains green.                                                       |

## Final structure and split/keep decisions

All abbreviated paths below are under libs/admin/clients.

```text
model/src/
  forms/documents/email-template-draft.ts                 values, defaults and form error type
  validators/documents/email-template-draft-validation.ts pure input policy
  validators/documents/email-template-draft-validation.unit.test.ts
feature/src/
  hooks/documents/email-templates/
    email-template-session.tsx                           app-injected role context
    use-email-template-registry.ts                       one coordinated read/write workflow
    use-email-template-registry.unit.test.tsx
  pages/documents/email-templates-page.tsx                page composition
  pages/documents/email-templates-page.integration.test.tsx
ui/src/
  forms/documents/email-templates/email-template-fields.tsx
  forms/documents/email-templates/email-template-fields.component.test.tsx
  details/documents/email-templates/email-template-details.tsx
  details/documents/email-templates/email-template-details.component.test.tsx
  dialogs/documents/email-templates/activate-email-template-dialog.tsx
  components/documents/email-templates/email-template-versions-list.tsx
  components/documents/email-templates/email-template-versions-list.component.test.tsx
```

Folder inventory: data-access/api/documents has7 production files, mappers/documents4, registry feature hooks2 and introduction hooks6. None meets the project's8-production-file split-review threshold. Keep these existing capability groups: every API/mapper has a specific owner; introduction state/catalog/choice/error logic already has separate modules. The registry hook retains one shared write lock/request receipt for create/activate and one detail epoch; splitting those coordination invariants into independent hooks would increase synchronization. Duplicate state clearing was consolidated into one stable callback. The small introduction registry hook retains paged choices and historical references; no price or send logic is added. No new Nx library/module is justified.

## Verification

Behavior Red before fixes: registry hook + actual-page RTK integration **2failed/9passed**, proving role revocation and repeated403 requests. Structural moves reused existing behavior tests; compilation/import mistakes during extraction were corrected before final checks and are not counted as behavioral Red.

Final focused tests, **27 unique passed**, zero failed/skipped:

| Boundary                                                            | Command                                                                                                      | Passed |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -----: |
| Registry state / role loss / replay / conflict                      | npx vitest run --config libs/admin/clients/feature/vitest.config.mts use-email-template-registry.unit        |      9 |
| Real page, explicit activation, persistent denial and user recovery | npx vitest run --config libs/admin/clients/feature/vitest.config.mts email-templates-page.integration        |      2 |
| Introduction page link/options composition                          | npx vitest run --config libs/admin/clients/feature/vitest.config.mts introductions-page.component            |      2 |
| Pure form validation in model                                       | npx vitest run --config libs/admin/clients/model/vitest.config.mts email-template-draft-validation           |      7 |
| Relocated UI components and introduction form regression            | npx vitest run --config libs/admin/clients/ui/vitest.config.mts email-template introduction-editor.component |      7 |

Scoped ESLint passed after removing obsolete dialog imports; no dependency-rule exemption was added. TypeScript spec checks for model, ui and feature exited0. The API, generated contract, app permission adapter, backend, schema and migrations were unchanged by this audit. Documentation/diff check results are appended after completion.

[Feature task](../tasks/documents/fe-009.md), [last implementation evidence](../evidence/p6-registry-selections-2026-11-01.md). Manual unknown resolution and actual Gmail consent/send remain separate P6 items. No commit, push or deployment was performed.

Final documentation verification: npm run docs:check passed541 Markdown files, with no broken links, empty files or duplicates; git diff --check exited0.
