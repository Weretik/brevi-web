# 015 — Remove review marks

**Status:** implemented 2026-11-03. **Backend:** BreviERP [CAT-014](https://github.com/Weretik/BreviERP/blob/master/docs/sdd/specs/catalog/014-remove-review-marks/README.md) (review and required fields dropped from the API and the database; the comment «Спільна складова для всіх артикулів моделі» cleared).

Client feedback items 8, 11, 12, 17 and 18 (2026-11-03). Nobody checks the imported data by hand, so the «Перевірено» marks only blocked prices and cluttered the card. The owner's rule: show a mark only when there is a problem, with its reason.

## Scenarios

- **S-01:** Composition lines have no «Обов’язковий» or «Перевірено» checkbox; a line counts as soon as it is saved. The reasons «Операції не підтверджено» and «Комплектацію не перевірено» are gone.
- **S-02:** The model card header has no «Перевірено …» / «Не перевірено» pill; the «Товари» side panel and form have no «Перевірено» switch; «Нова модель» step 4 has no «Перевірено та підтверджено» switch; «Новий ЗІЗ» has no «Перевірено вручну» item.
- **S-03:** The metric «Ціна в прайсі» is removed from the card (prices are published automatically, so it was always «Актуальна»). «Артикули N з N» is no longer green: it is marked only when some Article has no price.
- **S-04:** «Розрахунок» has no line «Розраховано … · Версія складу N · Налаштування N».
- **S-05:** The labour table has no «Статус перевірки» column; the Article list shows only a problem («Активний · Немає тканини»), not «Готовий до розрахунку» or «Готовність не перевірена»; «Нова модель» shows «Не готово до розрахунку» only while something is missing.
- **S-06:** The Operations reference has no «Дата перевірки» field and no «Перевірено» column.

## Code

- Removed: `validators/sewing-composition/is-sewing-review-metadata.ts`; `isSewingPricePublished` and `SewingCardTotals.unpublished`; the check key `reviewed`; `required`/`reviewed` in composition drafts and views, `isVerified`/`verifiedOn` in the overview, `sourceReviewed` in PPE offer values, `normCheckedAt` in operations.
- Changed: `sewing-card-header.tsx`, `sewing-card-metrics.tsx`, `sewing-calculation-section.tsx`, `sewing-article-list.tsx`, `sewing-composition-editor.tsx`, `sewing-create-layout.tsx`, `sewing-create-operations-step.tsx`, `use-sewing-create-overview.ts`, the material and operation rows, the overview form and details, PPE publication fields and readiness, the operations form, details and grid.

## Verification 2026-11-03

See the PR description for the commands and results.
