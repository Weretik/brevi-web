# 019 Full photos, cost only for Admin, supplier cards

The owner asked (2026-11-05) for six changes after the old-site photo import ([018](../018-product-photos/README.md)).

## Rules

- **R-01:** The «Товари» button «Імпорт зі старого сайту» and its panel are removed: the import is done. The backend endpoint stays unused.
- **R-02:** Product photos are never cut to a square: the table preview (40 × 48 px), the КП item photo, the КП photo pickers and the КП settings model picker show the whole photo (`object-fit: contain`), so a person is seen at full height. The PDF already fits the photo in its box.
- **R-03:** The КП takes the product's main photo by itself (backend crm R-29): the catalogue picker, the introduction setup, the editor and the PDF. Items of the imported КП with an old-site photo show the main photo. A photo picked with «Змінити фото» stays.
- **R-04:** The quick view of «Товари» (sewing and PPE) shows the main photo at the top, full size (`mainPhotoFullUrl`), or «Без фото».
- **R-05:** «Розрахунок» has no «Вартість хвилини». Cost and purchase price are for Admin only (the Director holds Admin; `canSeeCost`): the card metric «Собівартість», the «Тканини» columns «Матеріали», «Праця», «Накладні», «Собівартість», the «Складові ціни» breakdown, the quick view «Собівартість» and «Ціна постачальника», and the PPE card «Ціна постачальника» (metric and field). The backend still returns these numbers to managers; hiding them there is a separate change.
- **R-06:** A supplier name opens the supplier card of «Контрагенти → Постачальники» (view, «Редагувати» as there): the «Тканини» and «Фурнітура» tables and panels, «Імпорт цін» (table and panel) and the PPE card («Переглянути постачальника»). A supplier is found by ID, else by name ignoring case; an unknown one shows a warning.

## Code

- `libs/admin/products/feature/src/hooks/product-access/use-can-see-cost.ts` — `canSeeCost`.
- `libs/admin/products/ui/src/components/product-overview/product-main-photo.tsx` — quick view photo.
- `libs/admin/references/ui/src/components/suppliers/supplier-name-button.tsx`, `libs/admin/references/feature/src/components/suppliers/supplier-preview.tsx` (`useSupplierPreview`).

## Tests

`sewing-pricing-feature.component.test.tsx`, `ppe-product-card.component.test.tsx`, `sewing-access.mapper.unit.test.ts`, `supplier-preview.component.test.tsx`, `product-overview.mapper.unit.test.ts`.
