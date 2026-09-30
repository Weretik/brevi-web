# TS-001 — Read model і data-access

- **ID задачі:** TS-001
- **Охоплює:** SC-001, SC-005
- **Залежить від:** EN-001, EN-002
- **Точні шляхи:** `libs/admin/references/data-access/src/suppliers/`, `libs/admin/references/feature/src/`
- **Рівень тестування:** модульний + інтеграційний

## Робота

- [x] Створено Nx libraries/targets; `npx nx show project admin-references-data-access --json` і `npx nx show project admin-references-feature --json` підтверджують test/lint/typecheck.
- [x] GET типізовано через `operations['getSuppliers']`, runtime mapper перевіряє кожен рядок і повертає локальну модель.
- [x] `useSuppliers` тримає останні рядки під час reload, показує loading/empty/error і повторює тільки GET; вихід скасовує read. Persistent cache не використовується.
- [x] Transport, mapper і UI state розділено; generated DTO не імпортуються в feature.

## Свідчення

- Фокусний тест: `libs/admin/references/data-access/src/suppliers/suppliers.mapper.unit.test.ts`.
- Red: `npx nx test admin-references-data-access -- --run` — malformed response не відхилялася (1 failed, 1 passed).
- Green: `npx nx test admin-references-data-access` — 4/4 тестів, включно з HTTP error boundary, пройшли.
- Refactor: runtime mapper залишено чистою функцією; transport окремо. Повторний focused suite пройшов.
- Regression: `npx nx lint admin-references-data-access`, `npx nx typecheck admin-references-data-access`, `npx nx build admin-react` — успішно.

## Контрольна точка

Список повертає перевірені рядки й зрозумілу помилку.
