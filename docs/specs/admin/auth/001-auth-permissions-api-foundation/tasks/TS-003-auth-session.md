# TS-003 — Auth session lifecycle

- **ID задачі:** TS-003
- **Охоплює:** SC-001, SC-002, SC-003, SC-004, SC-005
- **Залежить від:** EN-001, TS-002
- **Точні шляхи:** `libs/admin/core/auth/`, `tsconfig.base.json`,
  auth generated operations in `@admin/shared/contracts`
- **Рівень тестування:** фокусний інтеграційний

## Робота

- [x] Створити Nx library з Brevi tags/alias та executable
      lint/typecheck/typecheck-tests/test targets за current project pattern.
- [x] Red: session tests для bootstrap refresh, memory-only token, CSRF header,
      login/logout, failed refresh та adapter callbacks.
- [x] Адаптувати `session-state`, transport і lifecycle до generated operations;
      raw Axios для session endpoints не проходить через refresh interceptor.
- [x] Не зберігати token у storage і не експортувати mutable state internals.
- [x] Публічно експортувати лише stable lifecycle/actions/types.
- [x] Перевірити security threat model, architecture baseline і відповідальності;
      записати audit decisions.

## Свідчення

- Фокусний тест: `auth-session.integration.test.ts` та pure cookie/transport tests.
- Red: `npx nx test admin-core-auth` — обидва suites не могли resolve відсутні
  production modules.
- Green/refactor: `npx nx test admin-core-auth` — 2 files, 7/7 passed.
- Regression: auth lint/typecheck/typecheck-tests passed; API/domain/app suites
  та production build passed.
- Refactor: повторний suite після поділу session/transport responsibilities.
- Регресія: auth lint/typecheck/typecheck-tests/test + api-client test.

## Контрольна точка

Session operations використовують generated contract; token memory-only;
adapter підтримує deterministic init/refresh/logout без рекурсії.
