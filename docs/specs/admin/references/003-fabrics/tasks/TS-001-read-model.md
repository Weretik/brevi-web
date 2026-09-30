# TS-001 — Read model і data-access

- **ID задачі:** TS-001
- **Охоплює:** SC-001, SC-005
- **Залежить від:** EN-001, EN-002
- **Точні шляхи:** `libs/admin/references/data-access/src/fabrics/`, `libs/admin/references/feature/src/`
- **Рівень тестування:** модульний + інтеграційний

## Робота

- [x] Створити потрібні Nx libraries/targets для feature та data-access, перевірити їх через `npx nx show project <project> --json`.
- [x] Типізувати конкретний GET через generated operation types, перевірити runtime response і перетворити DTO на модель застосунку.
- [x] Описати loading/empty/error, retry й кеш; не імпортувати generated DTO в UI.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності: незалежні ролі розділити за наявними межами, невеликий цілісний файл зберегти.

## Свідчення

- Фокусний тест: описати/створити тест для read model і data-access.
- Red: неправильна або пошкоджена відповідь проходить у UI
- Green: записати виконану команду і результат.
- Refactor: записати рішення щодо відповідальності файлів і повторити фокусний тест.
- Regression: записати relevant lint/typecheck/test/build/E2E і результат.

## Контрольна точка

Список повертає перевірені рядки й зрозумілу помилку.

## Виконання 2026-09-28

- Наявні `admin-references-data-access` і `admin-references-feature` мали Nx targets; повторно перевірено `npx nx show project admin-references-data-access --json` і `npx nx show project admin-references-feature --json`. Нових libraries не потрібно.
- Фокус: `fabrics.mapper.unit.test.ts`, `fabrics.api.integration.test.ts` — валідні рядки, пошкоджена відповідь, порожній 404, field errors без повтору write.
- Окремий Red перед реалізацією цього mapper не зафіксовано; ці тести додано після першої реалізації. Це прогалина TDD evidence.
- Green/refactor/regression: `npx nx test admin-references-data-access` — 14/14; `npx nx typecheck admin-references-data-access`, `npx nx lint admin-references-data-access` — успішно. Модель, mapper, error mapping і HTTP залишено окремими файлами.
