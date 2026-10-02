# RM-004 — References domain model boundary

- **Findings:** AF-003
- **Requirements:** AR-002
- **Depends on:** RM-001, RM-002
- **Exact paths:** `libs/admin/references/model/src/{entities,validators}/<capability>/`,
  legacy `references/data-access/src/**/*.model.ts`, legacy
  `references/feature/src/model/`, reference consumers/tests.

## Work

- [x] Створити canonical entities/drafts/value types/validation у model project.
- [x] Залишити DTO/request adapters і runtime response validation у data-access.
- [x] Оновити feature/data-access imports через public model entry point.
- [x] Згрупувати entities і validators за однаковими reference capabilities;
      tests залишити поруч із відповідним validator.

## Evidence

- Reference entities, drafts і pure validators перенесені до
  `@admin/references/model`; transport mappers залишені private у data-access.
- Model, mapper та API integration tests пройшли з окремим test typecheck.

## Checkpoint

Reference domain types і pure validation мають одного owner; generated/private
transport contracts не експортуються; focused mapper/model tests green.
