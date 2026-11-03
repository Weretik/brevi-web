# 012 — Prices on the «Товари» list

**Status:** implemented 2026-11-03. **Backend:** BreviERP [CAT-011](https://github.com/Weretik/BreviERP/blob/master/docs/sdd/specs/catalog/011-product-list-prices/README.md) (`getProductOverviewPrices`, `recalculateSewingPrices`).

The client's old site showed every article with its three prices. The owner chose list design B (one row per model, the lowest prices «від …», an arrow opens the articles with their prices) with the side panel of design C (short quote description, materials, labour, cost, price date) and one-button recalculation for sewing. PPE prices stay live.

## Scenarios

- **S-01:** «Швейна продукція» shows per model ID, name, category, article count and three prices for 1–9, 10–40 and from 41 pieces. With more than one article the prices read «від …». The arrow under «⌄» shows each article: fabric name and sale SKU, its published prices.
- **S-02:** A stale price (inputs changed since publication) is orange with a hint; an article tooltip shows the price after recalculation. A model without published prices shows «Не опубліковано» or «Не розраховано».
- **S-03:** «ЗІЗ» shows the live rule price; no recalculation button.
- **S-04:** Search also finds a model by article SKU. «Без ціни N» shows only rows without a price and combines with the section chip.
- **S-05:** «Перерахувати всі» runs a dry run and opens a dialog: how many new prices in how many models, the first 50 changes (before → after for 1–9 pieces), blocked articles with reasons. «Перерахувати і опублікувати» publishes; «Скасувати» writes nothing.
- **S-06:** The view panel shows «Ціни і собівартість»: materials, labour minutes, full cost (ranges across articles) and the price date for sewing; supplier price, rule, price and date for PPE; reasons when blocked; «Перерахувати ціни» for one sewing model with the same dialog.
- Tabs, section chips, row selection, bulk delete and the edit panel stay as in [008](../008-products-page/README.md).

## Design

- `products/model`: `entities/product-overview/product-overview-prices.ts`, `queries/product-overview/product-list-rows.ts` (model rows followed by article rows with negative ids), `queries/product-overview/product-panel-metrics.ts`.
- `products/data-access`: `api/product-overview/product-overview-prices.api.ts`, its DTOs, validator and mapper.
- `products/ui`: `product-overview-grid.tsx` (columns), `product-price-cells.tsx`, `product-overview-price-panel.tsx`, `sewing-recalculation-dialog.tsx`; the «Без ціни» chip in `product-overview-section-chips.tsx`.
- `products/feature`: `hooks/product-overview/use-product-list-rows.ts` (search, chips, «Без ціни», expanded models), `use-sewing-recalculation.ts`, `use-product-panel-prices.ts`; `components/product-overview/product-overview-price-block.tsx`.
- `references/ui` `ReferenceDataGrid`: optional `isDetailRow` (no checkbox, no menu, tinted) and `sortable` (off here, because article rows follow their model).

## Tests

`libs/admin/products/feature/src/pages/product-list/products-page.component.test.tsx` (S-01…S-05), `libs/admin/products/model/src/queries/product-overview/product-list-rows.unit.test.ts`, `libs/admin/products/data-access/src/validators/product-overview/validate-product-overview-prices.unit.test.ts`.
