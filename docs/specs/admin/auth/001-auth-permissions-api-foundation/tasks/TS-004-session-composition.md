# TS-004 — Shell/app session composition

- **ID задачі:** TS-004
- **Охоплює:** SC-001, SC-004, SC-005
- **Залежить від:** TS-003
- **Точні шляхи:** `libs/admin/core/shell/src/providers/`, shell public barrel/tests,
  `apps/admin-react/src/{main.tsx,app/providers/,app/router/}` as needed
- **Рівень тестування:** компонентний + app integration

## Робота

- [x] Red: provider exposes the injected logout action; logout clears session
      and RTK cache on success or transport failure.
- [x] Адаптувати `AdminShellSessionProvider` without importing auth
      implementation into shell; type hook return explicitly.
- [x] Compose auth initialization/provider at app boundary in deterministic order;
      define failed bootstrap behavior without inventing a login screen.
- [x] Export provider/hook only via shell root barrel.
- [x] Перевірити provider order, no circular dependency, architecture baseline
      і file responsibilities; оновити audit.

## Свідчення

- Фокусні тести: shell session provider component test, app provider integration test.
- Red: shell suite failed на відсутньому provider module.
- Green: shell 2 files, 6/6; app provider integration 1/1 passed.
- Regression: app suite, lint/typechecks і production build passed.
- Refactor: repeat focused tests.
- Регресія: shell/app lint/typechecks/tests and app build.

## Контрольна точка

App володіє wiring, shell отримує лише logout action, auth володіє session, а
logout завжди очищає local session/API cache.
