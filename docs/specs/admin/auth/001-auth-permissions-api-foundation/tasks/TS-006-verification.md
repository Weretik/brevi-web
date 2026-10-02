# TS-006 — Regression і delivery gate

- **ID задачі:** TS-006
- **Охоплює:** SC-001–SC-008
- **Залежить від:** TS-001, TS-002, TS-003, TS-004, TS-005
- **Точні шляхи:** усі paths feature, affected Admin projects,
  `docs/specs/admin/auth/001-auth-permissions-api-foundation/`
- **Рівень тестування:** verification + targeted E2E only if EN-002 names a route journey

## Робота

- [x] Завершити code audit; усі in-scope AF-* перевести у `verified`.
- [x] Повторити contract check, affected lint/typecheck/typecheck-tests/tests
      і `npx nx build admin-react`.
- [x] Перевірити project graph, aliases/barrels, відсутність deep/direct
      transport imports, duplicate API/config owners, empty projects і stale files.
- [x] Запустити current products/references component/integration regression.
- [x] E2E додати лише якщо погоджений permission/auth journey перетинає route
      boundary; інакше записати, чому focused integration достатньо.
- [x] Перевірити всі змінені файли на цілісність відповідальності й повторити
      affected tests після останнього split/refactor.

## Свідчення

- Фокусні тести: усі TS-001–TS-005 evidence.
- Red/Green: зберігаються у behavioral tasks, не дублюються тут.
- Refactor: final audit decisions.
- Regression: lint для 10 affected projects passed; tests для 9 projects passed;
  auth 7/7, shell 6/6, app composition 1/1; app production build passed із
  наявним chunk-size warning.
- `contracts:sync`, `contracts:generate` і `contracts:check` passed на
  `79cccf9b88168b726ac588640f6b397c0ed9afd4`; snapshot/generated/provenance узгоджені.

## Контрольна точка

Усі SC-* verified; current Admin journeys не регресували; contract, graph,
security review, docs і code узгоджені.
