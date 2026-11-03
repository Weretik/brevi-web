# 011 — Product create pages «Новий ЗІЗ» and «Нова модель»

**Status:** implemented 2026-11-03. **Backend:** BreviERP CAT-009 (`POST /api/v1/products/overview`, `GET /api/v1/products/overview/code-check`, `GET /api/v1/pricing/ppe/rules/preview`).

The Calculator sheet has a tab «Инструкция новый товар» with separate steps for a sewing model and a PPE product. The admin now has a full page for each, built from those steps. The old create form (manual ID, slug, Russian fields, old PPE percents) is removed. Concepts: «ЗІЗ A» (one page with a checklist) and «Швейка A» (a 5-step wizard), chosen by the owner on 2026-11-03.

## Rules

| ID   | Rule                                                                                                                                                                                                                                                                                                                                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R-01 | On «Товари» the add button reads «Додати модель» on the sewing tab (`/references/products/new/sewing`) and «Додати ЗІЗ» on the PPE tab (`/references/products/new/ppe`). The old `/references/products/create` redirects to the list.                                                                                                                  |
| R-02 | «Новий ЗІЗ» is one page with four blocks in the order of the sheet instruction: «Товар» (назва, артикул на сайті, розділ, одиниця, посилання Brevi), «Постачальник» (постачальник, артикул, посилання), «Ціна» (ціна постачальника, правило націнки, «Дозволити ручну ціну»), «Публікація» («Активний», «Перевірено»).                                 |
| R-03 | A sticky right panel (below the form on narrow screens) shows «Готовність» (7 checks, «N з 7»), «Ціни в прайсі» (від 1 / від 11 / від 41 from the server preview, the rule's price note) and a collapsible «Інструкція». «Створити ЗІЗ» is enabled only when every required field is valid and the article is free.                                    |
| R-04 | The article and the model code are checked on the server while typing (debounced). A taken code shows «Такий артикул уже є: «назва»». Server field errors land on their fields; a 409 shows the server message.                                                                                                                                        |
| R-05 | After «Створити ЗІЗ» the PPE card opens. When the product was saved but its first price was not, the card says so and asks to save the price there.                                                                                                                                                                                                    |
| R-06 | «Нова модель» is a wizard: 1 Модель, 2 Артикули, 3 Матеріали, 4 Операції, 5 Перевірка. Step 1 has the suggested next MOD-XXX code prefilled. «Далі» on step 1 saves the model as an inactive draft, and the URL becomes `?id=…&step=2`, so a model can be filled in parts. Steps 2–5 open only for a saved draft.                                      |
| R-07 | Steps 2–4 reuse the sewing card editors (articles, composition with shared and per-article materials, operations and the labour table). Step 4 has «Перевірено та підтверджено». Step 5 shows the readiness status and prices, reminds that every price must be above the full cost, and «Запустити модель» makes the model active and opens its card. |
| R-08 | The right panel of the wizard shows «Що заважає розрахунку» (the sheet reasons), «Трудовитрати» and the instruction for the current step. The sewing card shows «Продовжити заповнення» while the model is inactive or not every article is calculated.                                                                                                |
| R-09 | A full create page is allowed only for objects with more than a short form (a product). List rows of «Довідники» keep the side panel ([design system](../../../../standards/admin/design-system.md), «Full create page»).                                                                                                                              |

## Code

- model: `entities/product-create/`, `forms|validators|queries/ppe-create/`, `entities|forms|validators|queries/sewing-create/`
- data-access: `api/product-create/product-create.api.ts` with its DTO, validators and mappers
- ui: `forms/ppe-create/`, `components/ppe-create/`, `forms/sewing-create/`, `components/sewing-create/`; shared PPE pieces taken out of the card (`components/ppe-card/ppe-supplier-select.tsx`, `ppe-link-field.tsx`, `ppe-price-rows.tsx`, `ppe-markup-format.ts`)
- feature: `hooks/ppe-create/`, `pages/ppe-create/ppe-create-page.tsx`; `hooks/sewing-create/`, `components/sewing-create/`, `pages/product-create/sewing-create-page.tsx`; routes in `products.routes.tsx`
- removed: `pages/product-editor/product-create-page.tsx`

## Verification 2026-11-03

- `npx nx test admin-products-model`: 50 passed; `admin-products-ui`: 12 passed; `admin-products-feature`: 42 passed, 1 failed (`use-product.unit.test.tsx`, fails on master too); `admin-products-data-access` typecheck passed.
- Lint and typecheck pass for the products libraries.
- Structure audit: every new component is under 150 lines and each hook has one job.
- Not run: browser and E2E checks. `apps/admin-react-e2e/src/products.spec.ts` still opens the removed create page in 5 tests and needs a rewrite before E2E is run again.
- Open: pieces per shift on the wizard uses a 480-minute shift; the real shift length from the pricing settings is not exposed to the frontend yet.
