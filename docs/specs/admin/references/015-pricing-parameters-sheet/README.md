# 015 — Pricing parameters: Calculator sheet «Налаштування цін»

- **Surface:** React Web (Admin)
- **SDD status:** implemented 2026-11-02
- **Owner:** admin/references
- **Backend:** BreviERP spec `docs/sdd/specs/reference/003-pricing-parameters-sheet` (REF-003), contract `reference/pricing-parameters.openapi.yaml` 2.0.0
- **Replaces:** [006](../006-additional-references/README.md) and [011](../011-additional-references-pages/README.md) («Додаткові довідники»)

The client's Calculator sheet keeps all pricing numbers on the tab «Налаштування цін»:
a parameter table (40 rows) and a PPE markup table (10 rows). The product owner
decided on 2026-11-02 to rename «Додаткові довідники» to «Параметри ціноутворення»,
switch the data to the sheet's shape, move the sheet data and delete the old rows.

## Rules

| ID   | Rule                                                                                                                                                                                                       |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-01 | The page lives at `/references/pricing-parameters` with tabs «Параметри» and «Націнки ЗІЗ» (`?tab=ppe`); the old `/references/additional-reference` redirects; the menu item is «Параметри ціноутворення». |
| R-02 | Parameter fields: group, code, name, value, unit, manual or calculated, update date, comment.                                                                                                              |
| R-03 | The code (`^[A-Z][A-Z0-9_]*$`) is set on create and is read-only afterwards.                                                                                                                               |
| R-04 | A calculated parameter has no editable value; the backend computes it (minute cost = salary / (work days × shift minutes)).                                                                                |
| R-05 | Values with unit `%` and all PPE markups are stored as fractions and shown and typed as percents.                                                                                                          |
| R-06 | The update date is read-only; the backend sets it when the value or type changes.                                                                                                                          |
| R-07 | Parameters filter by section chips with counts and search by name, code, group; PPE rules search by name, note, goods.                                                                                     |
| R-08 | Both tables use the «Цех» reference list pattern B, no height limit, row menu, bulk delete.                                                                                                                |

## Scenarios

| ID    | Scenario                                                  | Test                                         |
| ----- | --------------------------------------------------------- | -------------------------------------------- |
| SC-01 | List shows percents, calculated row, section chip filters | `pricing-parameters-page.component.test.tsx` |
| SC-02 | Editing a percent sends a fraction to PUT                 | `pricing-parameters-page.component.test.tsx` |
| SC-03 | `?tab=ppe` opens PPE rules with percents                  | `pricing-parameters-page.component.test.tsx` |
| SC-04 | Form converts percents and validates fields               | `pricing-parameter-form.unit.test.ts`        |
| SC-05 | Responses are validated before mapping                    | `pricing-parameters.mapper.unit.test.ts`     |
| SC-06 | Old URL redirects; menu shows the new name                | `app-router.integration.test.tsx`            |

## Data transfer

One-time load by the team through `POST /api/reference/pricing-parameters/import`
(both tables in one request, `deleteMissing: true`): preview with `dryRun: true`,
the owner says yes, then the same rows with `dryRun: false`. Matching is by code
for parameters and by name for PPE rules.
