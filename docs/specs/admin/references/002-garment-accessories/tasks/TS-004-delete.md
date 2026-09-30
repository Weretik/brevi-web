# TS-004 — Одиночне та масове видалення

- **ID задачі:** TS-004
- **Охоплює:** SC-004
- **Залежить від:** TS-003
- **Точні шляхи:** `libs/admin/references/feature/src/components/garment-accessories/`, `libs/admin/references/data-access/src/garment-accessories/`
- **Рівень тестування:** компонентний + інтеграційний

## Робота

- [x] Один confirmation Dialog із кількістю для row та bulk; кожен підтверджений ID викликає `deleteGarmentAccessory`.
- [x] Список перечитується; часткові невдачі повідомляють failed IDs і зберігають їх вибір.
- [x] Bulk кнопка disabled без вибору; MUI Dialog має focus trap/restore, browser E2E перевіряє підтвердження.
- [x] Delete state у hook, confirmation UI в окремому компоненті.

## Свідчення

- Фокусний тест: `garment-accessories-page.component.test.tsx` (bulk partial failure), `garment-accessories.spec.ts` (single confirmation).
- Red: focused component command — 1 failed: після bulk click confirmation відсутнє.
- Green: focused component command — 3 passed; E2E single confirmation — passed.
- Refactor: спільна delete state machine для single/bulk у hook; focused suite повторено успішно.
- Regression: `npx nx test admin-references-feature` — 12 passed; `npx nx e2e admin-react-e2e` — 10 passed; lint/typecheck/build — успішно.

## Контрольна точка

Видаляються тільки підтверджені записи, часткові помилки видимі.
