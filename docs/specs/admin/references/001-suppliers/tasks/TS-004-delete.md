# TS-004 — Одиночне та масове видалення

- **ID задачі:** TS-004
- **Охоплює:** SC-004
- **Залежить від:** TS-003
- **Точні шляхи:** `libs/admin/references/feature/src/components/suppliers/`, `libs/admin/references/data-access/src/suppliers/`
- **Рівень тестування:** компонентний + інтеграційний

## Робота

- [x] Одиночне й bulk видалення використовують `deleteSupplier(id)` і спільний Dialog із кількістю записів.
- [x] Після дії список оновлюється; невдалі ID показуються й лишаються вибраними, попередній вибір інших рядків зберігається.
- [x] Bulk button недоступний без вибору; MUI Dialog забезпечує клавіатуру й focus. Підтвердження перевірено в browser journey.
- [x] HTTP delete ізольовано в data-access, orchestration — на сторінці.

## Свідчення

- Фокусні тести: `suppliers-page.component.test.tsx` (confirm, partial failure, selection) і browser journey у `admin-react.shell.spec.ts`.
- Red: `npx nx test admin-references-feature` — після невдалого одиночного видалення втрачався вибір іншого рядка (1 з 6 failed).
- Green: `npx nx test admin-references-feature` — 6/6, вибір збережено; Playwright підтвердив відсутність DELETE до підтвердження.
- Refactor: selection оновлюється від попереднього стану, без додаткового store; повторний focused suite пройшов.
- Regression: `npx nx lint admin-references-feature`, `npx nx typecheck admin-references-feature`, `npx nx e2e admin-react-e2e` — успішно.

## Контрольна точка

Видаляються тільки підтверджені записи, часткові помилки видимі.
