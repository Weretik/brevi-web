# TS-005 — Маршрут, меню і приймання

- **ID задачі:** TS-005
- **Охоплює:** SC-005
- **Залежить від:** TS-004
- **Точні шляхи:** `apps/admin-react/src/app/router/`, `libs/admin/references/feature/src/`, `apps/admin-react-e2e/src/`
- **Рівень тестування:** інтеграційний + E2E

## Робота

- [x] Підключити `/references/garment-accessory` через публічний route export і активувати тільки відповідний пункт меню; «Тканини» на тій самій сторінці, що й «Фурнітура виробу».
- [x] Перевірити direct URL, back/forward, mobile drawer, фокус, обидві теми й 320/768/1280 px.
- [x] Запустити relevant lint/typecheck/test після перевірки нових Nx targets, далі build і E2E; записати фактичні результати.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності: незалежні ролі розділити за наявними межами, невеликий цілісний файл зберегти.

## Свідчення

- Фокусний тест: описати/створити тест для маршрут, меню і приймання.
- Red: route відкриває fallback або меню веде до неготової вкладки
- Green: записати виконану команду і результат.
- Refactor: записати рішення щодо відповідальності файлів і повторити фокусний тест.
- Regression: записати relevant lint/typecheck/test/build/E2E і результат.

## Контрольна точка

Сторінка доступна напряму й через меню, усі SC-* verified.

## Виконання 2026-09-28

- Маршрут і пункт меню існували з 002; нова вкладка активована на тій самій сторінці. Окремий Red до розширення route integration test не зафіксовано.
- Фокус: `app-router.integration.test.tsx` перевіряє direct URL, Brevi shell і вкладку; `admin-react.shell.spec.ts` перевіряє grid тканин, незмінний URL, 320/768/1280 px та light/dark. Наявний `garment-accessories.spec.ts` перевіряє menu та back navigation.
- Green/refactor/regression: `npx nx lint admin-react`, `npx nx lint admin-react-e2e`, `npx nx build admin-react`, `npx nx e2e admin-react-e2e` — успішно; E2E 11/11. App router зберігає один route export.
