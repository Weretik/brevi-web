# 016 — Fabric variants and immediate-save tables

**Status:** implemented 2026-11-04. **Backend:** BreviERP [CAT-015](https://github.com/Weretik/BreviERP/blob/master/docs/sdd/specs/catalog/015-fabric-variants/README.md) (the fabric and its metres belong to the variant; one shared composition per model; variant update and delete; the per-Article composition endpoint removed).

Client feedback items 4, 5, 6, 7, 9, 10 and 11 (2026-11-03). In the client's sheet a model has one set of accessories and operations, and each fabric is a separate site article. The old card split the composition into «Модель» and «Артикул» scopes with drafts, scope chips and an unsaved-changes dialog; owners did not understand which scope they edited.

## Decisions

- A variant = fabric + metres + sale SKU + «Продається». Composition (accessories, other costs) and operations are shared by the model. A variant's price = shared part + its fabric.
- Every change is saved at once and the server recalculates and publishes the prices (CAT-012). No drafts, no scope switch, no navigation blocker.
- Add, view and edit happen in the right side panel (`ReferenceEditorDrawer`), as in «Довідники». Deleting asks for confirmation.
- «Ручний час, хв» stays as an optional field of an operation; empty means the reference norm.
- No "minimum two fabrics" rule: it is not confirmed by the client.

## Scenarios

- **S-01:** The first card tab is «Тканини»: one row per fabric with fabric name, SKU, metres, materials, labour, overhead, cost and three prices. A missing price shows its reason; a switched-off fabric shows «Вимкнена». Nothing else is marked.
- **S-02:** «Додати тканину» opens the panel «Нова тканина» with a searchable fabric list, metres (taken from the other fabrics of the model), SKU and «Продається». The SKU must be unique in the model.
- **S-03:** A row opens the panel in view mode; «Редагувати» enables the fields; «Зберегти» saves the variant. Deleting a variant with saved prices is refused by the server with the advice to switch it off.
- **S-04:** «Комплектація» is a table of the shared lines (type, name, quantity, unit, price, sum, comment) with a total without fabric; lines are added, changed and deleted through the panel «Матеріал».
- **S-05:** «Трудовитрати» is the labour table with time and pay; operations are added, changed and deleted through the panel «Операція» (search by name, part or OP code; optional manual time).
- **S-06:** «Розрахунок» switches between fabrics by fabric name. The header metric «Артикули N з N» became «Тканини N» with a note only when something has no price.
- **S-07:** «Нова модель» steps 2–4 are the same three tabs («Тканини», «Комплектація», «Операції»).

## Code

- Model: `forms/sewing-variant`, `validators/sewing-variant`, `forms/sewing-material`, `forms/sewing-operation`, `queries/sewing-variants/sewing-variant-rows.ts`, `queries/sewing-card/sewing-material-lines.ts`. Removed: composition drafts, dirty checks, scope validators, `SewingArticleCreateDraft`, article `readiness`, `translateCompositionBlockers`.
- Data access: `updateSewingArticle`, `deleteSewingArticle`; `replaceSewingArticleComposition` removed.
- UI: `sewing-variants-grid.tsx`, `sewing-materials-table.tsx`, `sewing-line-actions.tsx`, `sewing-line-delete-dialog.tsx`, the three side-panel forms; the labour table got row actions. Removed: `forms/sewing-articles`, `forms/sewing-composition`, `hooks/sewing-composition`, `components/sewing-articles`.
- Feature: `hooks/sewing-model` (model queries, writes, panel state, card hook) and `components/sewing-model` (three tabs and three drawers). Removed: `components/sewing-composition`, `hooks/sewing-composition`, `model/sewing-composition`.

## Verification 2026-11-04

See the PR description for the commands and results.
