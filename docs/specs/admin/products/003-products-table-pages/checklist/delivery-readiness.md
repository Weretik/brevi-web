# Товари — готовність до постачання

- [x] Усі SC-* verified або явно deferred.
- [x] Усі TS-* мають Red/Green/Refactor/Regression evidence.
- [x] Українські MUI-підписи перевірені для всіх доступних grid controls.
- [x] Контекстне меню перевірене мишею й клавіатурою.
- [x] Detail/create/edit перевірені в обох темах і на 320/768/1280 px.
- [x] `contracts:check`, affected lint/typecheck/test/E2E/build пройшли.
- [x] `code-audit/audit.md`, traceability і changed-files report завершені.

## Changed-files report

- App locale/integration: `apps/admin-react/src/app/theme/brevi-theme.ts`, theme
  unit test і `app-router.integration.test.tsx`.
- Product list: `products-page.tsx`, окремі filters/columns/row-menu components
  та component test.
- Product detail: detail page/components, новий section component і component test.
- Product editor: `product-editor.tsx`, новий form-section component і component test.
- Browser verification: `apps/admin-react-e2e/src/products.spec.ts`.
- Delivery evidence: feature README, task graph/TS-001–TS-005, traceability,
  code audit і цей checkpoint.

## Delivery checkpoint

**Результат:** passed, 2026-10-01. SC-001–SC-008 verified; blocked або deferred
задач немає. Production build завершено з наявним warning про main chunk понад
500 kB; зміна не додавала залежностей або нового build tooling.

## Post-delivery code audit

Незалежні filters і column schema додатково винесено з list page. Focused feature
checks, app/data-access regression, contracts check і production build пройшли.
Повний post-audit E2E зупинено за вказівкою користувача; останній завершений
pre-audit run лишається 27/27.
