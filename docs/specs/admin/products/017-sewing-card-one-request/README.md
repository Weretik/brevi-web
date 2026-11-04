# 017 — Sewing card in one request, labour in UAH, all prices

**Status:** implemented 2026-11-04. **Backend:** BreviERP [CAT-016](https://github.com/Weretik/BreviERP/blob/master/docs/sdd/specs/catalog/016-sewing-card-one-request/README.md) (the pricing summary also returns variant fabrics and the shared composition with reference names).

Client feedback items 1, 2, 3, 12, 13 and 14 (2026-11-03).

## Scenarios

- **S-01 (item 14):** The card reads one response (`getSewingArticleSummary`) for fabrics, prices, materials and operations, plus the access and «Товари» row queries. Reference lists (fabrics, accessories, operations) load only when a side panel that chooses from them is open.
- **S-02 (items 1, 2):** «Трудовитрати» in the card header shows UAH with minutes as its note; the «Товари» side panel shows «N хв · N грн». Both come from the server calculation, so the card no longer shows 0 where the side panel has a value.
- **S-03 (item 3):** The header shows «1–9 шт.», «10–40 шт.» and «Від 41 шт.» (ranges across fabrics).
- **S-04 (item 12):** «Розрахунок» names the fabric of the price: the title «Ціна: <fabric>» and the line «Тканина «…»: N грн за м × N м = N грн».
- **S-05 (item 13):** The calculation shows three tiles: «Час операцій», «Вартість хвилини» and «Трудовитрати, грн» (time × minute cost).

## Code

- Model: `SewingArticleSummary` gains `materials`/`operations`, rows gain fabric fields; `sewingCardToDraft`; `sewingVariantRows(summary)`, `sewingVariantsFromSummary`; `sewingMaterialLines(materials)`; totals gain `labour`, `wholesale`, `largeWholesale`. Removed `sewingCompositionToDraft`.
- Feature: `useSewingModel` reads the summary; new `useSewingReferenceOptions` for the drawers.
- UI: metric strip wraps to 2/3/6 columns; `SewingPricingPanel` takes `fabric`; the breakdown uses the metric strip.

## Verification 2026-11-04

See the PR description for the commands and results.
