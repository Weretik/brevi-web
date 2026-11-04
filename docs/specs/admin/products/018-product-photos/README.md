# 018 — Product photos, old-site photo import and the active switch

**Status:** implemented 2026-11-04. **Backend:** [CAT-018](../../../../contracts/openapi/backend/catalog/product-photos.openapi.yaml) (BreviERP `docs/sdd/specs/catalog/018-product-photos-and-old-site-import`).

The owner asked (2026-11-04) for product photos that quotes (КП) show, the old-site photos and missing sewing models brought over, and a visible «Активний» state with a filter on the «Товари» page.

## Rules

- **R-01:** The card tab «Фото» (sewing: `?tab=photos`; PPE: section «Фото» under the prices) shows the photos in order with the main one marked «Головне». Every staff member sees them.
- **R-02:** Only Admin (the Director also holds Admin; `canManagePhotos` from `/api/auth/session/me` roles) adds from the library (`MediaPickerDrawer`), uploads directly (library root), removes from the product (the file stays in the library), moves left/right and makes a photo main. Each action saves at once through `PUT /api/v1/products/{id}/photos`.
- **R-03:** The «Товари» table shows a 40 px preview of the main photo (`mainPhotoUrl`) in column «Фото», or a placeholder.
- **R-04:** Column «Активний» is a switch for staff who manage products (`canManage`); others see it read-only. The card header has the same switch. Saving sends the row through `PUT /api/v1/products/{id}/overview` with only `isActive` changed.
- **R-05:** Chips «Активні» and «Вимкнені» filter the list (`active=true|false`); a second click on the chosen chip shows both again. Counts come from the page (`all − inactive`, `inactive`).
- **R-06:** «Імпорт зі старого сайту» (Admin, tab «Швейна продукція») opens a side panel: pick `old-site-photo-import.json`, «Перевірити» (dry run, writes nothing), then «Імпортувати», which sends the file in parts of 20 products with progress and «Зупинити». The report lists counts, failed photos with reasons and products not found. A repeat adds nothing twice.

## Code

- `libs/admin/products/data-access/src/api/product-photos/product-photos.api.ts` — photos and import endpoints.
- `libs/admin/products/model/src/{entities,validators,mappers}/product-photos/`, `ordering/move-photo.ts` — types, file reading, report sum, moving.
- `libs/admin/products/feature/src/components/product-photos/` — tab «Фото» and the import panel; hooks in `hooks/product-photos/`.
- `libs/admin/products/feature/src/hooks/product-overview/use-product-active-switch.ts` — the switch.
- `libs/admin/products/ui/src/components/product-overview/product-overview-grid.tsx` (columns «Фото», «Активний»), `product-overview-section-chips.tsx` (chips), `sewing-card/sewing-card-header.tsx` (switch).

## Tests

`product-photos-tab.component.test.tsx`, `product-photos.mapper.unit.test.ts`, `old-site-photo-import-file.unit.test.ts`, `product-overview.mapper.unit.test.ts`, `sewing-access.mapper.unit.test.ts`.
