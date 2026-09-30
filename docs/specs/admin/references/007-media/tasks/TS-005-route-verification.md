# TS-005 — Route, menu і browser journey

- **ID задачі:** TS-005
- **Охоплює:** SC-001, SC-004, SC-006–SC-008
- **Залежить від:** TS-002, TS-003, TS-004
- **Точні шляхи:** `libs/admin/products/feature/src/index.ts`,
  `apps/admin-react/src/app/router/legacy-menu.ts`, `app-router.tsx`,
  `navigation-config.unit.test.ts`, `app-router.integration.test.tsx`,
  `apps/admin-react-e2e/src/media.spec.ts`
- **Рівень тестування:** інтеграційний і E2E

## Робота

- [x] Експортувати page через public API, додати один menu item і route
      `/references/media`; оновити menu count 27 → 28 і references count 6 → 7.
- [x] Router integration доводить deep link і Brevi shell; navigation test
      доводить, що link активний лише за зареєстрованого route.
- [x] Один Playwright journey з mock transport доводить menu/deep link,
      responsive gallery, upload, delete confirm/success і 409 без дублювання всіх
      component edge cases.
- [ ] 401/403 E2E deferred: у React Admin немає shared auth boundary, а backend
      Admin controllers використовують `AllowAnonymous`.
- [x] Завершити `code-audit/audit.md`, повторити перевірки після структурних змін
      і заповнити delivery checklist.

## Свідчення

- Шлях або назва фокусного тесту: `navigation-config.unit.test.ts`,
  `app-router.integration.test.tsx`, `apps/admin-react-e2e/src/media.spec.ts`.
- Команда Red та очікувана поведінкова помилка: `npx nx test admin-react --
navigation-config` — item/route відсутні; Playwright deep link дає Not Found.
- Фактичний Red: navigation test показав відсутні item/route і старі counts.
- Команда Green і результат: router unit/integration 17/17; `media.spec.ts` 2/2.
- Примітка про рефакторинг: route lazy export і menu item додані в чинні owners;
  локальну auth boundary не створено.
- Команда регресійної перевірки та результат: lint/typecheck/test для
  `admin-products-data-access`, `admin-products-feature`, `admin-react`,
  `admin-react-e2e`; `npm run contracts:check`; `npx nx build admin-react`.

## Контрольна точка

Критичний journey працює з меню та direct URL, а всі affected targets і
delivery audit мають записані результати.
