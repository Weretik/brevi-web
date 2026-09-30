# TS-005 — Маршрут, меню і приймання

- **ID задачі:** TS-005
- **Охоплює:** SC-005
- **Залежить від:** TS-004
- **Точні шляхи:** `apps/admin-react/src/app/router/`, `libs/admin/references/feature/src/`, `apps/admin-react-e2e/src/`
- **Рівень тестування:** інтеграційний + E2E

## Робота

- [x] `/references/garment-accessory` підключений через public export; наявний пункт «Тканина та фурнітура» активується, вкладка «Тканини» чекає SDD 003.
- [x] Playwright перевіряє direct URL, back, mobile drawer keyboard/focus, дві теми й 320/768/1280 px.
- [x] Relevant Nx lint/typecheck/test, build, E2E та contract scripts виконані.
- [x] App router лише компонує route й public feature export; бізнес-стан залишається у feature/data-access.

## Свідчення

- Фокусний тест: `app-router.integration.test.tsx`, `garment-accessories.spec.ts`.
- Red: `npx nx test admin-react -- app-router.integration.test.tsx` — 1 failed: route відкривав fallback «Сторінку не знайдено».
- Green: та сама команда — 6 passed; `npx nx e2e admin-react-e2e` — 10 passed.
- Refactor: public export із feature, один route registry визначає активність legacy menu; focused test повторено успішно.
- Regression: `npx nx lint admin-react`, `npx nx typecheck admin-react`, `npx nx typecheck-tests admin-react`, `npx nx build admin-react`, `npx nx e2e admin-react-e2e` — успішно. Build повідомляє про chunk >500 kB, збірку не блокує.

## Контрольна точка

Сторінка доступна напряму й через меню, усі SC-* verified.
