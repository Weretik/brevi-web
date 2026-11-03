# 014 — «Товари» list from one server page

**Status:** implemented 2026-11-03. **Backend:** BreviERP [CAT-013](https://github.com/Weretik/BreviERP/blob/master/docs/sdd/specs/catalog/013-product-list-page/README.md) (`getProductOverview` is a page with prices and fabric variants, `getProductOverviewItem` serves the card, `getProductOverviewPrices` removed).

Client feedback items 15–17 (2026-11-03). After opening or refreshing «Швейна продукція», the rows stayed «—» and had no expand arrow for about a minute: the list loaded the rows, then a second request recalculated every price. The owner asked for the usual design: one request per page, with search, filters, sort and paging on the server; a direct way to the full card; and no "all good" marks, only problems.

## Scenarios

- **S-01:** Each page of «Швейна продукція» and «ЗІЗ» is one request: search (debounced), section chip, «Без ціни», column sort (ID, name, 1–9 шт.) and the page go to the server; the page arrives with its three prices and fabric variants, so prices and the expand arrow appear with the rows. Changing a filter or the sort goes back to the first page. The chips show the counts of the whole type.
- **S-02:** The arrow opens the model's fabric variants (column «Тканин»): «Габардин · арт. 602» with its prices. Search also finds a model by variant SKU or fabric name.
- **S-03:** A row with a price shows no status. A row without one shows the reason in the 1–9 column («Немає трудовитрат», «Неповна комплектація», «Ціну ще не опубліковано» …), with every reason in the tooltip.
- **S-04:** The row actions have «Відкрити повну картку» next to «…» (one click) and in the menu, besides «Швидкий перегляд» (the side panel).
- **S-05:** The sewing and PPE cards read their own row (`getProductOverviewItem`) instead of the whole list. Their header shows a status only for a problem («Без ціни: 1 з 2», a PPE reason); «Готово до розрахунку» and «Активна» are gone («Вимкнена» stays). The «Артикули» table has no «Статус розрахунку» or «Ціна в прайсі» column: a missing price shows its reasons in the 1–9 column.

## Code

- Removed: `product-overview-prices.api.ts`, its DTO, mapper, validator and test; `use-product-list-rows.ts`; the model types `ProductOverviewPrices`, `ProductArticlePrices`, `ProductPriceStatus`; client filtering `filterProductOverview` and `countProductsBySection`; `sewingReadyStatus`, `ppeReadyStatus`.
- Added: model `ProductVariant`, `ProductOverviewPage`, `ProductOverviewListQuery`, `orderSectionCounts`, `productProblemReasons`; data-access `getProductOverviewItem`, `productOverviewSearchParams`; feature `use-product-overview-row.ts`; shared grid `server` (paging and sorting on the server), `openHref` and `viewLabel` in `ReferenceDataGrid` / `ReferenceRowMenu`; `hooks/debounce/use-debounced-value.ts` (moved from `ppe-create`).
- Changed: `use-product-overview.ts` (server query state), `product-overview-content.tsx`, `product-overview-grid.tsx`, `product-price-cells.tsx`, `product-list-rows.ts`, the drawer and price block, `use-product-panel-prices.ts`, `use-sewing-card.ts`, `use-ppe-card.ts`, `sewing-card-header.tsx`, `ppe-card-prices.tsx`, `sewing-article-summary-grid.tsx`.

## Verification 2026-11-03

See the PR description for the commands and results.
