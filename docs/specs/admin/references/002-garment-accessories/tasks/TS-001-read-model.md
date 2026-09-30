# TS-001 — Read model і data-access

- **ID задачі:** TS-001
- **Охоплює:** SC-001, SC-005
- **Залежить від:** EN-001, EN-002
- **Точні шляхи:** `libs/admin/references/data-access/src/garment-accessories/`, `libs/admin/references/feature/src/`
- **Рівень тестування:** модульний + інтеграційний

## Робота

- [x] Наявні `admin-references-feature` і `admin-references-data-access` мають lint/typecheck/test targets; звірено `npx nx show project admin-references-feature --json`.
- [x] GET типізований через `getGarmentAccessories`; runtime mapper перевіряє рядки та повертає окрему модель.
- [x] Хук має loading/empty/error/retry й скасування при unmount. Поточний непагінований список запитується повторно після write; окремого довгоживучого кешу немає. 404 списку нормалізується до порожнього стану згідно з backend handler.
- [x] Mapper/transport відділено від React hook; generated DTO не виходить у UI.

## Свідчення

- Фокусні тести: `garment-accessories.mapper.unit.test.ts`, `garment-accessories.api.integration.test.ts`.
- Red: `npx nx test admin-references-data-access -- garment-accessories.mapper.unit.test.ts` — 1 failed: damaged row passed mapper.
- Green: та сама команда — 2 passed; `npx nx test admin-references-data-access -- garment-accessories` — 6 passed.
- Refactor: модель, mapper, HTTP та React hook лишено за окремими відповідальностями; під час повторного аудиту розбір HTTP-помилок винесено в `garment-accessories.error.ts`, а public error export збережено через `src/index.ts`. Focused suite повторено: 6 passed.
- Regression: `npx nx test admin-references-data-access` — 10 passed; lint/typecheck/build/E2E — успішно.

## Контрольна точка

Список повертає перевірені рядки й зрозумілу помилку.
