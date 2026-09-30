# TS-005 — Маршрут, меню і приймання

- **ID задачі:** TS-005
- **Охоплює:** SC-005
- **Залежить від:** TS-004
- **Точні шляхи:** `apps/admin-react/src/app/router/`, `libs/admin/references/feature/src/`, `apps/admin-react-e2e/src/`
- **Рівень тестування:** інтеграційний + E2E

## Робота

- [x] `/references/garment-part-operation` підключено через public export; активується один пункт «Операції»; вкладка «Роботи» чекає SDD 005.
- [x] Direct URL, back, меню, фокус після закриття форми, теми й 320/768/1280 px перевірені E2E; mobile drawer охоплено наявною регресією shell.
- [x] Relevant lint/typecheck/test/build і focused E2E виконані; full E2E — 14/14.
- [x] Route лишається в app router; UI та API у відповідних libraries.

## Свідчення

- Фокусний тест: `app-router.integration.test.tsx` — direct route і активний пункт меню.
- Red: `npx nx test admin-react -- app-router.integration.test.tsx -t 'opens garment parts directly'` — route показав fallback замість сторінки.
- Green: route підключено, `npx nx test admin-react` — 13/13, focused E2E `npx nx e2e admin-react-e2e --grep 'garment parts'` — 3/3.
- Refactor: route імпортує лише public export feature library; повторні регресійні перевірки наведено нижче.
- Regression: `npx nx lint admin-react`, `npx nx lint admin-react-e2e`, typecheck обох проєктів, `npx nx build admin-react`, `npx nx e2e admin-react-e2e` — успішно (14/14). App integration тест очікував 2 активні посилання в групі; оновлено до 3 після нового route.

## Контрольна точка

Сторінка доступна напряму й через меню, усі SC-* verified.
