# 013 — Automatic Sewing prices in the Admin

**Status:** implemented 2026-11-03. **Backend:** BreviERP [CAT-012](https://github.com/Weretik/BreviERP/blob/master/docs/sdd/specs/catalog/012-sewing-price-auto-publication/README.md) (`recalculateSewingPrices` removed; prices are published after every saved input change and nightly).

The owner found two prices («опубліковано» and «зараз»), the «застаріли» marker and the «Перерахувати всі» button confusing, and chose automatic publication. The Admin now shows one price per Article and has no price buttons; the backend keeps the history.

## Scenarios

- **S-01:** «Товари» shows one price per model and Article: the published one. Only before its very first publication is the live price shown, muted. No stale marker, no «Перерахувати всі», no «Перерахувати ціни» in the side panel, no dialog. A price that cannot be calculated still reads «Не розраховано»; «Без ціни» still filters.
- **S-02:** The sewing card «Розрахунок» tab and the composition screen show the Article price (three tiers, «Оновлено …») and the breakdown of the calculation behind it, with the note that the price updates by itself. There are no «Розрахувати ціну» / «Опублікувати ціну» buttons. Unsaved composition changes show «Збережіть зміни складу, щоб ціна перерахувалася.»; no price shows «Ціни ще немає: перевірте, чи заповнений склад артикула.»
- **S-03:** After saving a composition or an Article, and after saving a fabric, accessory, operation, pricing parameter or PPE rule, the cached product prices are refreshed (`Product` tags), so the new price appears without a page reload.

## Code

- Removed: `sewing-recalculation-dialog.tsx`, `use-sewing-recalculation.ts`, `workflow/sewing-pricing-actions.tsx`, `use-sewing-pricing-actions.ts`, the `recalculateSewingPrices`, `saveSewingCalculation` and `publishSewingCalculation` RTK endpoints and their DTOs, validators, mappers and model types.
- Changed: `product-price-cells.tsx`, `product-overview-price-panel.tsx`, `product-overview-content.tsx`, the drawer and price block, `sewing-pricing-panel(-props).tsx`, publication and calculation sections, `use-sewing-pricing.ts`, `sewing-pricing-feature.tsx`, the pricing tab callers; tag invalidation in `sewing-composition.api.ts`, `sewing-articles.api.ts` and the Reference price-input APIs (`productPricesTag` in `reference-api.shared.ts`).

## Verification 2026-11-03

- `npx nx test` for admin-products-ui (12), -data-access (38), -model (53), admin-references-data-access (39), admin-references-feature (47): all passed. admin-products-feature: 42 passed, 1 failed (`hooks/product-detail/use-product.unit.test.tsx`, react-redux context; that test already failed before this change).
- `npx nx lint` and `npx nx typecheck` for the same projects: passed. `npm run contracts:check`: snapshot matches BreviERP 1a7bb68.
