# TS-001 — Read model і data-access

- **ID задачі:** TS-001
- **Охоплює:** SC-001, SC-005
- **Залежить від:** EN-001, EN-002
- **Точні шляхи:** `libs/admin/references/data-access/src/garment-parts/`, `libs/admin/references/feature/src/`
- **Рівень тестування:** модульний + інтеграційний

## Робота

- [x] Повторно використано наявні Nx libraries/targets `admin-references-feature` і `admin-references-data-access`; окремі targets уже доступні.
- [x] GET типізовано через `getGarmentParts`, відповідь перевіряється runtime mapper перед передаванням UI.
- [x] `useGarmentParts` керує loading/empty/error/retry та скасовує застарілий read. Успішні write викликають reload; generated DTO не імпортуються в UI.
- [x] API, error mapper і runtime mapper розділені за відповідальностями.

## Свідчення

- Фокусні тести: `garment-parts.mapper.unit.test.ts`, `garment-parts.api.integration.test.ts`.
- Red: `npx nx test admin-references-data-access -- garment-parts.mapper.unit.test.ts` — 2 behavioral failures: не відхилялася пошкоджена відповідь і втрачався коректний рядок.
- Green: `npx nx test admin-references-data-access -- garment-parts` — 5 тестів успішно.
- Refactor: модель, mapper, transport і error mapping лишено окремими файлами; повторний focused run успішний.
- Regression: `npx nx lint admin-references-data-access`, `npx nx typecheck admin-references-data-access`, `npx nx test admin-references-data-access` — успішно, 19 тестів; `npx nx build admin-react` — успішно.

## Контрольна точка

Список повертає перевірені рядки й зрозумілу помилку.
