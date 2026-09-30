# TS-001 — Read model і data-access

- **ID задачі:** TS-001
- **Охоплює:** SC-001, SC-005
- **Залежить від:** EN-001, EN-002
- **Точні шляхи:** `libs/admin/references/data-access/src/garment-part-operations/`, `libs/admin/references/feature/src/`
- **Рівень тестування:** модульний + інтеграційний

## Робота

- [x] Повторно використано наявні `admin-references-feature` і `admin-references-data-access` з test/lint/typecheck targets; `nx show project` звірено.
- [x] GET типізовано через `getGarmentPartOperations`, runtime mapper перевіряє rows, DTO не виходить з data-access.
- [x] Loading/empty/error, retry та скасування застарілого read реалізовані; список оновлюється після write.
- [x] API, mapper, model і error лишаються окремими файлами за наявною структурою.

## Свідчення

- Фокусний тест: `garment-part-operations.mapper.unit.test.ts`, `garment-part-operations.api.integration.test.ts`.
- Red: `npx nx test admin-references-data-access -- garment-part-operations.mapper.unit.test.ts` — 1 із 2 тестів впав: пошкоджена відповідь проходила через mapper.
- Green: та сама команда — 2/2; transport test — 2/2.
- Refactor: transport, error, mapper і model розділено; фокусний тест повторено успішно.
- Regression: `npx nx test admin-references-data-access` — 23/23; lint/typecheck і `contracts:check` — успішно.

## Контрольна точка

Список повертає перевірені рядки й зрозумілу помилку.
