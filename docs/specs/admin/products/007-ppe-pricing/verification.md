# PPE integration evidence — 2026-10-25

## Contract prerequisite

Backend canonical docs/sdd/contracts/catalog/ppe-pricing.openapi.yaml; pin `c39c95127125c90b4f77bc00a531f0556cb728a2`. `npm run contracts:sync -- <clean-backend-checkout> <pin>`, `npm run contracts:generate`, `npm run contracts:check` all passed. No snapshot/type file was edited by hand. No backend schema was invented by the consumer.

## Behavioral evidence

Red: `node node_modules/vitest/vitest.mjs run --config libs/admin/products/model/vitest.config.mts libs/admin/products/model/src/queries/ppe-pricing` — 2 failed with legacy 999 instead of 136 and missing blocked state. Green/regression: PPE + Sewing selector directories plus rule-draft validator — 6 passed. The draft validator added two Red cases for omitted/invalid fractions before the explicit validation fix.

Focused commands from repository root:

- Data-access config, mapper/API directories for PPE and Sewing — 16 passed across six files (the final added cache-regression case was run separately and passed). PPE covers exact tier mapping, stripped transport fields, invalid identities/approval/readiness/amounts, draft blockers and batch/approval request body.
- Feature config `--maxWorkers=1 --testTimeout=15000`: PPE pricing component/hook, Sewing pricing component and Product detail/list pages — 19 passed initially. Added independent-draft regression: PPE component now 8 passed, including blank markup input; PPE hook 2, shared projection hook 1, Sewing component 6 and Product pages 5 give 22 distinct affected cases. Final workflow regression ran 17 cases across the four affected component/hook files; all passed.
- UI config `--maxWorkers=1 --testTimeout=15000`: product-wholesale-price-label.unit.test.ts and product-calculations.component.test.tsx — 5 passed, including enrolled PPE status and legacy/Sewing compatibility.
- Production tsc projects: products model/data-access/ui/feature; affected data-access/feature spec projects. Passed, exit code 0.
- Scoped ESLint/Prettier, local links and git diff --check. Passed, exit code 0.

Only focused automated checks were selected. No browser, visual check, E2E, full suite, production build or deployment was performed. Existing Product API legacy pricing retirement and representative catalogue comparison remain backend TS-007. No quote history was changed. Imported PPE inputs remain drafts until a manager explicitly confirms values; the client never auto-approves.

The real RTK store + mocked fetch regression keeps both card and list subscriptions active, approves a new offer and verifies both caches refetch to the server-provided new price. It adds coverage of cache invalidation beyond mocked-hook UI control tests. No price formula is duplicated in the client.

Final checks: model/data-access/ui/feature production tsc and data-access/feature test tsc passed; scoped ESLint and Prettier passed; contract source/generation/provenance check passed against c39c951. Documentation links and git diff --check passed. Distinct affected cases: 6 model, 16 data-access, 22 feature and 5 UI (49 total); repeated runs are not counted again. No frontend commit or push was made; unrelated working-tree changes were retained.

## Reproducible focused commands

```powershell
node node_modules/vitest/vitest.mjs run --config libs/admin/products/model/vitest.config.mts libs/admin/products/model/src/queries/ppe-pricing libs/admin/products/model/src/queries/sewing-pricing libs/admin/products/model/src/validators/ppe-pricing
node node_modules/vitest/vitest.mjs run --config libs/admin/products/data-access/vitest.config.mts libs/admin/products/data-access/src/mappers/ppe-pricing libs/admin/products/data-access/src/api/ppe-pricing libs/admin/products/data-access/src/mappers/sewing-pricing libs/admin/products/data-access/src/api/sewing-pricing
node node_modules/vitest/vitest.mjs run --config libs/admin/products/feature/vitest.config.mts --maxWorkers=1 --testTimeout=15000 libs/admin/products/feature/src/components/ppe-pricing/ppe-pricing-feature.component.test.tsx libs/admin/products/feature/src/hooks/ppe-pricing/use-ppe-product-prices.unit.test.tsx libs/admin/products/feature/src/hooks/pricing/use-product-prices.unit.test.tsx libs/admin/products/feature/src/components/sewing-pricing/sewing-pricing-feature.component.test.tsx
node node_modules/vitest/vitest.mjs run --config libs/admin/products/ui/vitest.config.mts --maxWorkers=1 --testTimeout=15000 libs/admin/products/ui/src/product-detail/product-wholesale-price-label.unit.test.ts libs/admin/products/ui/src/product-detail/product-calculations.component.test.tsx
```

Product detail/list page regression used the feature config with the same worker/timeout flags and `libs/admin/products/feature/src/pages/product-detail/product-detail-page.component.test.tsx libs/admin/products/feature/src/pages/product-list/products-page.component.test.tsx`. This was a separate five-case regression, not another end-to-end run.
