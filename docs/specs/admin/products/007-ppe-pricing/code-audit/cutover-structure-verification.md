# TS-007 structural verification — 2026-10-25

Scope: AF-PP07, extract current-price section from the detail page. The Product route, deletion/composition ownership, API hooks, current-price readiness and explicit onboarding behavior remain unchanged. No new library, store, generated type or contract pin is needed. Earlier uncommitted work was preserved.

- Feature production TypeScript (`tsc --noEmit --project libs/admin/products/feature/tsconfig.lib.json`): passed.
- Scoped ESLint for `components/product-detail/product-current-pricing.tsx` and `pages/product-detail/product-detail-page.tsx`: passed after applying the configured import order.
- Prettier for both production files: passed.
- `node node_modules/vitest/vitest.mjs run --config libs/admin/products/feature/vitest.config.mts --maxWorkers=1 --testTimeout=15000 libs/admin/products/feature/src/pages/product-detail/product-detail-page.component.test.tsx libs/admin/products/feature/src/components/ppe-pricing/ppe-pricing-feature.component.test.tsx`: 11 passed.

Existing tests cover the observable behavior; a structural move needs no artificial Red case. No browser, full suite, production build, deployment or commit was performed. Final test types/navigation/diff results are recorded below.

Feature test TypeScript (`tsc --noEmit --project libs/admin/products/feature/tsconfig.spec.json`), local document links and final `git diff --check`: passed. AF-PP07 is verified.
