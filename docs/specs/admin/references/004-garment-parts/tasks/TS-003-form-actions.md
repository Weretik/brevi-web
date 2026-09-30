# TS-003 — Створення, перегляд і редагування

- **ID задачі:** TS-003
- **Охоплює:** SC-002, SC-003
- **Залежить від:** TS-002
- **Точні шляхи:** `libs/admin/references/feature/src/components/garment-parts/`, `libs/admin/references/data-access/src/garment-parts/`
- **Рівень тестування:** компонентний + інтеграційний

## Робота

- [x] Створення, перегляд та редагування перенесені у MUI Dialog; видалення виконує TS-004.
- [x] ID і назву звірено з Angular формою та OpenAPI; назва обов'язкова, максимум 150 символів. Помилки показано біля полів, форма залишається відкритою.
- [x] Успішний запис оновлює список; write не повторюється автоматично.
- [x] Validation, editor hook і dialog розділені за відповідальностями.

## Свідчення

- Фокусний тест: `garment-parts-page.component.test.tsx` (validation error, view→edit, refresh).
- Red: первинний `npx nx test admin-references-feature -- garment-parts-page.component.test.tsx` — дія створення відсутня; 3 behavioral failures.
- Green: та сама команда — 5 тестів успішно; E2E підтвердив field error і збереження введеної назви.
- Refactor: форма передає взаємодії в editor hook, API лишається в data-access; повторний focused run успішний.
- Regression: `npx nx lint admin-references-feature`, `npx nx typecheck admin-references-feature`, `npx nx test admin-references-feature` — успішно.

## Контрольна точка

Форма відтворює старий результат з перевіреними даними.
