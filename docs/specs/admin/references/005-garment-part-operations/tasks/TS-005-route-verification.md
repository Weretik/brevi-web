# TS-005 — Маршрут, меню і приймання

- **ID задачі:** TS-005
- **Охоплює:** SC-005
- **Залежить від:** TS-004
- **Точні шляхи:** `apps/admin-react/src/app/router/`, `libs/admin/references/feature/src/`, `apps/admin-react-e2e/src/`
- **Рівень тестування:** інтеграційний + E2E

## Робота

- [x] Наявний public `GarmentPartsPage` і route збережені; меню «Операції» веде до спільної сторінки з активною вкладкою «Роботи».
- [x] Direct URL, back/forward, mobile drawer, фокус, обидві теми та 320/768/1280 px перевірено E2E.
- [x] Nx targets звірено; relevant lint/typecheck/test, build і E2E виконано.
- [x] Router лише компонує public export; стан вкладок лишається на сторінці.

## Свідчення

- Фокусний тест: `app-router.integration.test.tsx`; `garment-part-operations.spec.ts` — direct URL, shell, вкладки, форма, видалення, 3 ширини й 2 теми.
- Red: до зміни route відкривав лише «Елементи»; окремий виконуваний Red для цієї задачі не зафіксовано.
- Green: app router 7/7; нові E2E 3/3.
- Refactor: route залишено через наявний public export без другого URL; перевірки повторено успішно.
- Regression: `npx nx test admin-react` — 13/13; `npx nx build admin-react` — успішно; `npx nx e2e admin-react-e2e` — 17/17.

## Контрольна точка

Сторінка доступна напряму й через меню, усі SC-* verified.
