# EN-001 — Supplier GET-by-ID contract

- **ID задачі:** EN-001
- **Уможливлює:** SC-003–SC-005
- **Залежить від:** немає
- **Точні шляхи:** backend suppliers OpenAPI, frontend snapshot/generated types
- **Рівень тестування:** контрактний
- **Статус:** blocked

## Робота

- [ ] Додати `getSupplierById` з SupplierRow response і 404.
- [ ] Pin backend SHA, sync/generate/check frontend contracts.
- [ ] Перевірити generated types/provenance й tooling responsibilities.

## Свідчення

- Behavioral Red не має сенсу до operationId.
- Replacement: `npm run contracts:check` — passed; snapshot і generated types
  відповідають pinned provenance, але operationId відсутній.
- Pinned snapshot `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea`:
  `/api/reference/suppliers/{id}` містить лише PUT/DELETE.
- Read-only перевірка latest backend HEAD
  `5d97cc098ade99068d1da70ccc0f6562ec852f2c` дала той самий результат:
  controller і OpenAPI не мають GET-by-ID.
- Blocker: backend зміна й новий immutable SHA відсутні; frontend repository не
  може достовірно додати transport contract або синхронізувати неіснуючу operation.
- Уможливлює TS-001.

## Контрольна точка

Generated GET supplier by ID доступний для frontend implementation.
