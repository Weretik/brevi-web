# EN-001 — Контракти detail тканини й фурнітури

- **ID задачі:** EN-001
- **Статус:** deferred — не потрібна для погодженого Drawer scope
- **Уможливлює:** SC-004, SC-005, SC-006
- **Залежить від:** немає
- **Точні шляхи:** backend OpenAPI garment accessories/fabrics, frontend
  `docs/contracts/openapi/`, generated `libs/admin/shared/contracts/`
- **Рівень тестування:** контрактний

## Робота

- [ ] Узгодити й додати `getGarmentAccessoryById` та `getFabricById` з 404.
- [ ] Зафіксувати immutable backend commit; sync/generate/check snapshot.
- [ ] Перевірити generated types без ручних DTO та записати provenance.
- [ ] Перевірити відповідальність contract tooling; сторонній refactor не робити.

## Свідчення

- Behavioral Red неможливий до появи operationId.
- 2026-10-01 перевірено backend HEAD
  `5d97cc098ade99068d1da70ccc0f6562ec852f2c`: у
  `GarmentAccessoriesController` і `FabricsController` є лише collection GET;
  у двох OpenAPI `{id}` paths є PUT/DELETE без GET та operationId.
- Перед delivery checkpoint повторно виконано `git ls-remote
https://github.com/Weretik/BreviERP.git HEAD` і перевірено чистий shallow
  checkout: remote HEAD лишається
  `5d97cc098ade99068d1da70ccc0f6562ec852f2c`, потрібних controller actions та
  operationId досі немає.
- Blocker: backend має реалізувати й опублікувати два GET-by-ID endpoints та
  immutable commit. Frontend snapshot не змінюється припущенням про неіснуючий API.
- `npm run contracts:check` — success для чинного pinned snapshot
  `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea`; це підтверджує синхронність
  наявних types, але не завершує EN-001.
- Після backend commit виконати `npm run contracts:sync -- <checkout> <sha>`,
  `npm run contracts:generate`, `npm run contracts:check`.
- Уможливлює TS-001.

## Контрольна точка

Обидва GET-by-ID доступні через generated types із pinned provenance.
