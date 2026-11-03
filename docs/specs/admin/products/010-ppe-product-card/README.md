# 010 — PPE product card

**Status:** implemented 2026-11-03. **Backend:** BreviERP CAT-008 (`GET`/`PUT /api/v1/products/{productId}/ppe-offer`).

Stage 4 of moving «Товари» from the Calculator. The card of a PPE product (`/references/products/:id`) replaces the old detail page with a «Цех» card that shows what the sheet tab «ЗІЗ» holds for the product and its three prices from «Прайс на сайт» (H–J). It follows the [sewing card](../009-sewing-product-card/README.md).

## Rules

| ID   | Rule                                                                                                                                                                                                                                                                                                                                    |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-01 | The header shows «ЗІЗ», the name, article · section, pills (status, active, «Перевірено») and «На сайті», «Видалити», «Редагувати». «Редагувати» opens the same drawer as the «Товари» table.                                                                                                                                           |
| R-02 | A metric strip shows the supplier price with its update date, the retail (from 1), wholesale (from 11) and large wholesale (from 41) prices, and whether the price is manual or auto-updated.                                                                                                                                           |
| R-03 | The «Постачальник» form edits supplier (from «Контрагенти»), supplier product link (opens in a new tab), supplier article, unit, supplier price, «Дозволити ручну ціну» and the pricing rule (from «Параметри ціноутворення»). A rule that no longer exists is shown with a warning. Readers see the form disabled and no save buttons. |
| R-04 | Saving sends the current offer version; a newer version returns 409 and the card asks to reload. A changed price or rule recalculates the three prices on the server.                                                                                                                                                                   |
| R-05 | The «Ціни» panel shows «Готово до розрахунку» and the three prices, or the sheet reasons («Немає ціни постачальника», «Не вибрано правило ціноутворення» …), the rule's markups, its «Примітка в прайсі» (the wholesale note of «Прайс на сайт» M) and the Insight XML prices when they exist.                                          |
| R-06 | Site texts, SEO and photos are not shown; they go to the «Контент сайту» module. The old offer and rule version editors on the product page are removed: rules are edited in «Параметри ціноутворення», supplier prices on the card.                                                                                                    |

## Reference tables: one side panel (same stage)

The owner asked (2026-11-03) that «Додати» works the same in every «Довідники» table. «Контрагенти → Постачальники» used a centered dialog and «Клієнти» a separate page. Both now use `ReferenceEditorDrawer`, like «Тканини», «Фурнітура», «Операції», «Типи і розділи». The rule is in the [design system](../../../../standards/admin/design-system.md) («Reference list pattern», item 6). `/crm/clients/new` redirects to the clients tab.

## Code

- model: `entities/ppe-card/`, `forms/ppe-card/`, `validators/ppe-card/`, `queries/ppe-card/` (blocker reasons)
- data-access: `api/ppe-card/ppe-supplier-offer.api.ts`, DTO, validator, mapper
- ui: `components/ppe-card/` (supplier form, prices panel); `SewingCardHeader` takes `kindLabel`
- feature: `components/ppe-card/` (card, metrics), `hooks/ppe-card/` (card data, form); `pages/product-detail/product-detail-page.tsx` picks the sewing or PPE card
- removed: `ui/product-detail/` content, gallery, header, section, information and characteristics views; `ui/components/ppe-pricing/`, `ui/forms/ppe-pricing/`; `feature/components/ppe-pricing/`, `feature/components/product-detail/`, `hooks/ppe-pricing/use-ppe-version-*`
- references: `ui/components/suppliers/supplier-editor-drawer.tsx`, `feature/components/suppliers/supplier-drawer.tsx`; clients: `components/customers/customer-create-drawer.tsx`, `hooks/customers/use-customer-create.ts`; the create page was removed

## Verification 2026-11-03

- `npx nx test admin-products-model`: 33 passed; `admin-products-data-access`: 34 passed; `admin-products-ui`: 12 passed; `admin-products-feature`: 33 passed, 1 failed (`use-product.unit.test.tsx`, fails on master too); `admin-references-ui`: 7 passed; `admin-references-feature`: 47 passed; `admin-clients-feature`: 182 passed; `admin-react -- app-router`: 10 passed.
- Lint and typecheck pass for the products, references and clients libraries.
- Structure audit: card data and form state are separate hooks, the card component is about 120 lines, dead detail and version-editor code was removed.
