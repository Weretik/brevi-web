# TS-003 — Створення, перегляд і редагування

- **ID задачі:** TS-003
- **Охоплює:** SC-002, SC-003
- **Залежить від:** TS-002
- **Точні шляхи:** `libs/admin/references/feature/src/components/garment-accessories/`, `libs/admin/references/data-access/src/garment-accessories/`
- **Рівень тестування:** компонентний + інтеграційний

## Робота

- [x] Створення, перегляд і редагування в MUI Dialog; видалення винесено в TS-004.
- [x] ID, назва, постачальник і ціна відповідають OpenAPI; selector використовує перевірений `listSuppliers`. Помилки полів і значення залишаються в формі.
- [x] Після успіху список перечитується; write не повторюється автоматично.
- [x] Validation, editor state, Dialog і HTTP відокремлено за ролями.

## Свідчення

- Фокусний тест: `garment-accessories-page.component.test.tsx` (form error, view→edit→save).
- Red: focused command — 1 failed, після натискання «Створити» форма не відкривалася.
- Green: focused command — 2 passed після форми; після розширення 5 passed.
- Refactor: client validation у `model`, write state у editor hook, MUI поля у Dialog; повторний аудит вилучив дубльований lookup стан і підключив наявний `useSuppliers`. Focused suite повторено: 5 passed.
- Regression: `npx nx test admin-references-feature` — 12 passed; E2E form error — passed; lint/typecheck/build — успішно.

## Контрольна точка

Форма відтворює старий результат з перевіреними даними.
