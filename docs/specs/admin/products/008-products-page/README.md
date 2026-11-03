# 008 — «Товари»: two tables from the Calculator sheet

**Status:** implemented 2026-11-03. **Backend:** BreviERP CAT-006 (`/api/v1/products/overview`, `/api/v1/products/{id}/overview`).

Stage 2 of moving «Товари» from the Calculator. Product owner decisions of 2026-11-03: a sewing row is a **model**, not an article; site texts, SEO, photos and site categories move to the future «Контент сайту» module and quote calculation to the future «Розрахунок КП» module (planning specs in BreviERP `docs/sdd/specs/content/001-site-content` and `docs/sdd/specs/quotes/001-quote-calculation`). A product keeps the link to its page on the current public site so a quote can take photos from it; temporary, until photos are on our CDN. «Перевірено» is set by the director.

## Rules

| ID   | Rule                                                                                                                                                                                                                                                                                                                                            |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-01 | `/references/products` has tabs «Швейна продукція» and «ЗІЗ» (`?tab=ppe`) on the reference list pattern: search row, section chips with counts, then the table.                                                                                                                                                                                 |
| R-02 | Sewing columns: ID моделі, Назва моделі, Категорія, Сезон, Статус, Перевірено (date), Сайт (opens the current site page in a new tab). PPE has Артикул сайту, Назва товару, Розділ / категорія and no season.                                                                                                                                   |
| R-03 | Chips are the «Типи і розділи» sections used by the rows, plus «Без розділу»; search looks in code, name and quote description.                                                                                                                                                                                                                 |
| R-04 | A drawer shows and edits code, section (only sections of the same type), season (sewing), active, «Перевірено», the current site link and «Короткий опис для КП». A row that stays checked keeps its date; a newly checked row gets today from the backend. «Відкрити повну картку» opens the existing product card for composition and prices. |
| R-05 | «Додати товар» opens the existing create page; «Видалити» appears next to it when rows are selected and asks for confirmation.                                                                                                                                                                                                                  |
| R-06 | The page does not show Russian name, slug, descriptions, information blocks, characteristics or photos; they stay in the database for the Content module.                                                                                                                                                                                       |

## Code

- model: `entities/product-overview/`, `queries/product-overview/`, `validators/product-overview/`, `forms/product-overview/`
- data-access: `api/product-overview/`, contract, validator, mapper
- ui: `components/product-overview/` (grid, section chips, form, details, delete dialog)
- feature: `pages/product-list/products-page.tsx` (tabs), `product-overview-content.tsx`, `hooks/product-overview/`, `components/product-overview/product-overview-drawer.tsx`

The old paged list (`hooks/product-list/`, `components/product-list/`, `ui/product-list/products-list-filters.tsx`) was removed. `@admin/references/ui` now also exports `ReferenceDataGrid`, `ReferenceFilterChip`, `ReferenceFormSection` and `ReferenceDetailsList`, and `@admin/references/feature` exports `useReferenceDeletion`, so «Товари» use the same list pattern without copies.

## Verification 2026-11-03

- `npx nx test admin-products-model`: 27 passed; `admin-products-data-access`: 30 passed; `admin-products-ui`: 15 passed; `admin-references-ui`: 7 passed; `admin-products-feature`: 36 passed, 1 failed (`use-product.unit.test.tsx`, fails on master too); `admin-react -- app-router`: 10 passed.
- Lint for the products and references libraries passes. Typecheck passes for the products libraries and `admin-react`.
