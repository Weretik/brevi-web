# EN-001 — Characterization і test typecheck baseline

- **Enables:** RM-001–RM-010
- **Depends on:** none
- **Exact paths:** `libs/admin/**/project.json`, `libs/admin/**/tsconfig*.json`,
  existing Vitest configs/tests, `apps/admin-react`, audit inventory.

## Work

- [x] Зафіксувати current project graph, aliases, imports і forbidden patterns.
- [x] Визначити existing tests, що зберігають routes/CRUD/media/states.
- [x] Додати відсутній executable test typecheck для data-access projects і
      focused config test для runtime API URL owner до structural moves.
- [x] Записати точні uncached baseline commands/results у audit.

## Evidence

- `npx nx run-many -t typecheck-tests -p admin-products-data-access,admin-references-data-access,admin-util --skip-nx-cache` — passed після виправлення `admin-util` spec `rootDir/include`.
- `npx nx test admin-util --skip-nx-cache` — 1 file, 2 tests passed.
- `npx nx run-many -t test -p admin-products-data-access,admin-products-feature,admin-references-data-access,admin-references-feature,admin-core-shell,admin-util --skip-nx-cache` — 6/6 projects passed.
- `npx nx run-many -t lint -p admin-products-data-access,admin-references-data-access,admin-util --skip-nx-cache` — 3/3 projects passed.
- Додано `typecheck-tests` для обох data-access projects і
  `lint/typecheck/typecheck-tests/test` для `admin-util`.

## Checkpoint

Source і tests affected projects компілюються окремо; observable behavior має
виконуваний regression safety net до moves.

**Статус:** complete — 2026-10-01.
