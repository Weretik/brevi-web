# EN-001 — Production media API contract

- **ID задачі:** EN-001
- **Уможливлює:** SC-001, SC-004–SC-008
- **Залежить від:** немає
- **Точні шляхи:** backend `docs/sdd/contracts/openapi.yaml` і media contract;
  frontend `docs/contracts/openapi/backend/catalog/product-dependencies.openapi.yaml`,
  `docs/contracts/openapi/SOURCE.json`,
  `libs/admin/api-contract/src/generated/openapi.ts`
- **Рівень тестування:** contract/tooling verification

## Робота

- [ ] Захистити GET/POST/DELETE погодженою Admin authorization і описати
      401/403 — deferred до спільної React Admin auth feature.
- [x] Додати `DELETE /api/catalog/media/{id}` зі стабільним `operationId`, 204,
      404 та 409 для media, яке використовується; backend перевірка використання
      має бути атомарною з delete.
- [x] Для upload зафіксувати точне multipart field name/casing, допустимі MIME,
      max bytes, 400 response і семантику статусів обробки.
- [x] Зберегти поточний непагінований GET; ризик росту та окрема майбутня зміна
      pagination/search зафіксовані в design.
- [x] Синхронізувати snapshot з чистого backend checkout за повним commit SHA,
      згенерувати types і виконати contract check; snapshot/generated код не
      редагувати вручну.
- [x] Перевірити змінені contract/tooling файли на одну відповідальність і
      записати результат у `code-audit/audit.md`.

## Свідчення

- Чому поведінковий Red не має сенсу: frontend не може коректно довести delete,
  authorization, limits або 409 до появи канонічного backend contract.
- Перевірені наявні інструменти або генератор: `contracts:sync`,
  `contracts:generate`, `contracts:check`, `openapi-typescript`.
- Альтернативна команда або перевірка та результат: backend commit
  `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea`; `contracts:sync`,
  `contracts:generate` і `contracts:check` пройшли.
- Уможливлена поведінкова задача: TS-001.

## Контрольна точка

Усі три media operations мають operationId і generated types із одного pinned
backend commit; upload validation, 404/409 і status semantics перевірені.
Authorization лишається явним platform-wide deferred item.
