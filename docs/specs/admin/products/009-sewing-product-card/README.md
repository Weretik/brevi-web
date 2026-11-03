# 009 — Sewing product card

**Status:** implemented 2026-11-03. **Backend:** BreviERP CAT-007 (`GET /api/v1/products/{productId}/articles/pricing-summary`, optional `comment` on composition lines).

Stage 3 of moving «Товари» from the Calculator. The card of a sewing model (`/references/products/:id`) replaces the long detail page with a «Цех» card. It follows the sheet tabs «Прайс на сайт» (columns N–Y), «Комплектація» and «Трудовитрати». PPE keeps the old detail page until stage 4.

## Rules

| ID   | Rule                                                                                                                                                                                                                                                                              |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-01 | The header shows «Швейна продукція», the model name, code · section · season, status pills (active, «Готово до розрахунку» or the reason it cannot be calculated) and the buttons «На сайті», «Видалити», «Редагувати». «Редагувати» opens the same drawer as the «Товари» table. |
| R-02 | A metric strip shows the number of articles, how many are calculated, the full cost range, the price range and whether prices are published.                                                                                                                                      |
| R-03 | Tabs «Артикули», «Комплектація», «Трудовитрати», «Ціни» are kept in `?tab=`.                                                                                                                                                                                                      |
| R-04 | «Артикули» is a table of the model's articles with material, labour and full cost, the 3 prices, status with the sheet reason, and «Ціна в прайсі». A row click opens that article's composition.                                                                                 |
| R-05 | «Комплектація» edits shared and per-article materials (fabric, підкладка, синтепон, accessories). An accessory with the reference unit «м» is counted in metres. Each line can have a comment up to 500 characters.                                                               |
| R-06 | «Трудовитрати» shows the model operations with minutes and cost per minute of the seamstress, a totals row, and the operations editor. Operations belong to the model, so the tab switches the editor scope to the model.                                                         |
| R-07 | «Ціни» shows the article chips and the existing per-article pricing and publishing workflow.                                                                                                                                                                                      |
| R-08 | Backend blocker codes and messages are shown as the sheet's Ukrainian reasons, for example «Немає трудовитрат», «Немає тканини», «Неповна комплектація», «Немає параметрів ціноутворення».                                                                                        |
| R-09 | Site texts, SEO and photos are not shown on the card; they go to the «Контент сайту» module.                                                                                                                                                                                      |

## Code

- model: `entities/sewing-card/`, `queries/sewing-card/` (blocker reasons, totals, labour lines), `comment` in composition drafts and validators
- data-access: `api/sewing-pricing/article-summary.api.ts`, DTO, validator, mapper; composition mappers and validators carry `comment`
- ui: `components/sewing-card/` (header, status pill, metric strip, article grid, labour table); comment fields in the composition rows; editor `sections`
- feature: `components/sewing-card/` (card, metrics, articles and pricing tabs), `hooks/sewing-card/` (tab, card data, composition), `SewingCompositionScreen section`, `composition-scope-chips.tsx`; `pages/product-detail/product-detail-page.tsx` renders the card for Sewing

The old `ui/product-detail/sewing-product-detail.tsx` was removed.

## Verification 2026-11-03

- `npx nx test admin-products-model`: 30 passed; `admin-products-data-access`: 32 passed; `admin-products-ui`: 14 passed; `admin-products-feature`: 39 passed, 1 failed (`use-product.unit.test.tsx`, fails on master too); `admin-react -- app-router`: 10 passed.
- Lint and typecheck pass for the 4 products libraries.
- Structure audit: card logic split into 3 hooks, the card component is 156 lines, the legacy sewing detail view was removed.
