# TS-007 Admin consumer evidence — 2026-10-25

Contract pinned/synchronized/generated/checked from clean backend `0529daf910b837eb808a662695706dda4beaf833`. Canonical source: docs/sdd/contracts/catalog/product-catalog.openapi.yaml plus existing Sewing/PPE pricing contracts. Runtime operation IDs remain getAdminProducts/getAdminProductById/createProduct/replaceProduct and the existing pricing reads/version writes. No transport schema was copied or generated output edited manually.

Red: new model price-source-cutover test observed 999 instead of 0 for non-enrolled PPE. Green: both PPE selector files, 3 passed. Backend public mapper Red/Green is recorded in its SDD.

Current behavior: no legacy price fallback or 'legacy' Product price state; mapper discards metadata sale-price amounts for either type; manufacturing view has no old bands; archived percent inputs are hidden and existing initial base cost is read-only. The Product metadata amount can prefill an unsaved PPE offer with sourceReviewed=false, but only explicit manager action creates approval. Existing offer versions always override onboarding defaults.

Focused tests passed: 23 feature cases (9 PPE workflow/onboarding, 2 Product detail, 3 editor, 6 Sewing pricing, 3 Product list), 5 UI cases (metadata, price labels, archived controls), 15 data-access cases (boundary mapping and current pricing transport), and 3 model selector/cutover cases. Production library types passed for model/data-access/UI/feature. Test TypeScript checks passed for data-access/UI/feature. Scoped ESLint and Prettier passed; the new archived-control test import order was corrected to the project rule.

No browser, full suite, production build, historical quote migration or deployment was performed. Backend-only activation is not a safe rollout for a legacy-price client; the documented release order is frontend first. No frontend commit/push is part of the authorization.

Reproduction: run Vitest with the relevant library vitest.config.mts, --maxWorkers=1 and --testTimeout=15000. The final neighboring feature run selected pages/product-list/products-page.component.test.tsx and components/sewing-pricing/sewing-pricing-feature.component.test.tsx (9 passed); the final UI run selected product-editor/ppe/ppe-product-fields.component.test.tsx (1 passed). Earlier focused test paths remain under their owning model/data-access/UI/feature modules.
