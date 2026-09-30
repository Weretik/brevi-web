# TS-005 — Маршрут, меню і приймання

- **ID задачі:** TS-005
- **Охоплює:** SC-005
- **Залежить від:** TS-004
- **Точні шляхи:** `apps/admin-react/src/app/router/`, `libs/admin/references/feature/src/`, `apps/admin-react-e2e/src/`
- **Рівень тестування:** інтеграційний + E2E

## Робота

- [x] `/references/supplier` підключено через `@admin/references/feature`; активовано лише пункт «Загальні довідники → Постачальники».
- [x] Playwright перевірив direct URL, back, mobile drawer/focus, теми й 320/768/1280 px.
- [x] Relevant lint/typecheck/test, build і E2E пройшли на поточному коді.
- [x] Router має лише composition і menu activation; feature не імпортує shell internals.

## Свідчення

- Фокусні тести: `apps/admin-react/src/app/router/app-router.integration.test.tsx`, `apps/admin-react-e2e/src/admin-react.shell.spec.ts`.
- Red: перед зміною router містив лише `/`, а чинний E2E перевіряв fallback для `/references/supplier`; окремий запуск Red не фіксувався.
- Green: `npx nx test admin-react` — 11/11; `npx nx e2e admin-react-e2e` на production preview `ADMIN_REACT_BASE_URL=http://localhost:4311` — 7/7.
- Refactor: route додано лише до `availableRoutes`; існуючий `createNavigation` автоматично активує один пункт. Повторні integration/E2E пройшли.
- Regression: `npx nx lint admin-react`, `npx nx typecheck admin-react`, `npx nx lint admin-react-e2e`, `npx nx typecheck admin-react-e2e`, `npx nx build admin-react` — успішно. Звичайний E2E на `4300` спершу впав через раніше запущений dev server зі старим alias; production preview на `4311` пройшов.

## Контрольна точка

Сторінка доступна напряму й через меню, усі SC-* verified.
