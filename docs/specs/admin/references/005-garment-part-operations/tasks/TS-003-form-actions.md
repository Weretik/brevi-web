# TS-003 — Створення, перегляд і редагування

- **ID задачі:** TS-003
- **Охоплює:** SC-002, SC-003
- **Залежить від:** TS-002
- **Точні шляхи:** `libs/admin/references/feature/src/components/garment-part-operations/`, `libs/admin/references/data-access/src/garment-part-operations/`
- **Рівень тестування:** компонентний + інтеграційний

## Робота

- [x] Додано створення, перегляд і редагування; видалення завершено в TS-004.
- [x] Поля ID, елемент, назва, хвилини й межі перевірено за OpenAPI; field errors лишають форму відкритою зі значеннями.
- [x] Успішний запис повторно завантажує список; write автоматично не повторюється.
- [x] Правила валідації, стан редактора й form component мають окремі відповідальності.

## Свідчення

- Фокусний тест: `garment-part-operations-page.component.test.tsx` — помилка створення зберігає значення, перегляд переходить у редагування й оновлює список; `garment-part-operation-validation.unit.test.ts` — межі полів; `garment-part-operations.api.integration.test.ts` — write paths/bodies.
- Red: окремий виконуваний Red для цієї задачі не зафіксовано; до зміни форми робіт не було.
- Green: component suite 5/5, validation unit 2/2, data-access suite 23/23, E2E форма й підтвердження — успішно.
- Refactor: form state винесено в hook, validation в чисту функцію; feature suite повторено успішно.
- Regression: `npx nx test admin-references-feature`, typecheck, lint, build і E2E — успішно.

## Контрольна точка

Форма відтворює старий результат з перевіреними даними.
