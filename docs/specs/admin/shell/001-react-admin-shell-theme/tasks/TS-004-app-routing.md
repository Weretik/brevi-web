# TS-004 — Композиція маршрутів і fallback

- **ID задачі:** TS-004
- **Охоплює:** SC-001, SC-002, SC-006
- **Залежить від:** TS-002, TS-003
- **Точні шляхи:** `apps/admin-react/src/app/app.tsx`, `apps/admin-react/src/app/router/app-router.tsx`, `apps/admin-react/src/app/pages/start-page.tsx`, `apps/admin-react/src/app/pages/not-found-page.tsx`, `apps/admin-react/src/app/providers/app-providers.tsx`, `apps/admin-react/src/app/providers/color-mode-provider.tsx`, `apps/admin-react/src/app/router/app-router.integration.test.tsx`, `apps/admin-react-e2e/src/admin-react.shell.spec.ts`
- **Рівень тестування:** інтеграційний + один критичний E2E

## Робота

- [x] Написати інтеграційний тест композиції: `/` відображає вміст у
      спільному shell; невідомий URL показує доступний fallback з поверненням
      на `/`. Прямий URL перевірити browser test.
- [x] Підключити єдиний router, theme provider і layout у `apps/admin-react`.
      Початковий `/` є нейтральною сторінкою каркаса, не удаваним dashboard.
- [x] Перевірити, що майбутня feature-сторінка може бути вкладеним маршрутом
      без копіювання header/sidebar; у test fixture дозволено другу сторінку,
      production menu показує лише реальні маршрути.
- [x] Запустити relevant lint, typecheck, tests, build та E2E target після
      перевірки `npx nx show project <project> --json`; записати результати.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності.
      Розділити лише файли, що поєднують незалежні ролі або складні для
      підтримки; зберегти невеликий цілісний файл незалежно від кількості рядків.

## Свідчення

- Шлях або назва фокусного тесту: `app-router.integration.test.tsx`, `admin-react.shell.spec.ts`.
- Команда Red: `npx nx test admin-core-shell` спочатку не знаходив route
  content у порожньому layout. App integration tests додані після первинної
  композиції, окремий Red для них не зафіксовано.
- Команда Green: `npx nx test admin-react` — 7/7; `/` і unknown URL
  проходять через один layout із доступним поверненням.
- Рефакторинг: початковий `/` лишено нейтральним, без удаваного dashboard;
  повторні app і shell suites пройшли.
- Регресія: `npx nx lint admin-react`, `npx nx typecheck admin-react`,
  `npx nx run admin-react:typecheck-tests`, `npx nx lint
admin-react-e2e`, `npx nx run admin-react-e2e:typecheck` пройшли.
- Build output і E2E: `npx nx build admin-react` пройшов (Vite,
  923 modules); `npx nx e2e admin-react-e2e` — 4/4.

## Контрольна точка

`/` і невідомий URL проходять через один shell; direct URL, повернення з
fallback і browser navigation працюють після збірки.
