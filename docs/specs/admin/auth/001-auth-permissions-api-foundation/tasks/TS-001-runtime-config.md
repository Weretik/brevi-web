# TS-001 — Brevi runtime config

- **ID задачі:** TS-001
- **Охоплює:** SC-001, SC-007
- **Залежить від:** немає
- **Точні шляхи:** `libs/admin/shared/config/`,
  `apps/admin-react/src/{main.tsx,environments/,test-setup.ts}`,
  products/references test utilities as affected
- **Рівень тестування:** модульний + integration configuration verification

## Робота

- [x] Red: зафіксувати parsing/fallback і URL behavior для Brevi config,
      включно з dev/prod base URL та logging flag.
- [x] Адаптувати source `config/` і `env/` structure до current environment
      inputs; не переносити назву «Кабінет менеджера» або kedr feature flags.
- [x] Надати один typed public config contract і deterministic test injection;
      мігрувати всі `configureApiEnvironment`/`apiUrl` consumers атомарно.
- [x] Видалити старий mutable path лише після source search без consumers.
- [x] Перевірити architecture baseline, public barrel, tags/targets і
      відповідальності змінених files; записати рішення в audit.

## Свідчення

- Шлях: `libs/admin/shared/config/src/config/app-config.unit.test.ts`.
- Red: `npx nx test admin-shared-config` — 2 tests failed на placeholder mapping.
- Green: `npx nx test admin-shared-config` — 2/2 passed.
- Refactor: pure `createAppConfig` відокремлено від runtime binding;
  `src/lib/api-environment*` видалено, focused suite повторено.
- Regression: `nx lint/typecheck/typecheck-tests admin-shared-config` passed;
  affected app/products/references suites і `nx build admin-react` passed.

## Контрольна точка

Виконано: усі Admin consumers отримують Brevi config через root alias; пошук не
знаходить `configureApiEnvironment` або `apiUrl`.
