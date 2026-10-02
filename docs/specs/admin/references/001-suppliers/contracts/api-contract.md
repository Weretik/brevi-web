# Постачальники — споживання API-контракту

Правило: `docs/architecture/api/contract-workflow.md`. Точний `operationId` мусить бути зафіксований до реалізації кожної API-операції.

## Джерело та версія

- Backend repository: `C:/Users/Віталій/RiderProjects/BreviERP` (локальний checkout, наданий користувачем).
- Канонічний entry point: `docs/sdd/contracts/openapi.yaml`.
- Зафіксована версія backend: `f74c01f7784b1bccaae3234dfee63d8adac5da76` (2026-09-27; OpenAPI введено в попередньому commit `403280e519161116ff743f337fb5668f9e948e40`).
- Versioned contract: `docs/sdd/contracts/reference/suppliers.openapi.yaml`; агрегований entry point посилається на нього.
- Frontend snapshot: `docs/contracts/openapi/backend/`; provenance: `docs/contracts/openapi/SOURCE.json`; generated types: `libs/admin/shared/contracts/src/generated/openapi.ts`.
- Статус: **контракт синхронізовано**; HTTP-код має використовувати цю версію.

| `operationId`    | Метод і шлях, перевірені за backend controller | Сценарії       | Статус у канонічному OpenAPI |
| ---------------- | ---------------------------------------------- | -------------- | ---------------------------- |
| `getSuppliers`   | `GET /api/reference/suppliers`                 | SC-001, SC-005 | наявний                      |
| `createSupplier` | `POST /api/reference/suppliers`                | SC-003         | наявний                      |
| `updateSupplier` | `PUT /api/reference/suppliers/{id}`            | SC-003         | наявний                      |
| `deleteSupplier` | `DELETE /api/reference/suppliers/{id}`         | SC-004         | наявний                      |

## Рішення клієнта

- Request mapping: форма → параметри конкретної операції після локальної перевірки; точні поля визначає майбутній OpenAPI, не ручний DTO старого Angular.
- Response validation/mapping: runtime-перевірка мережевої відповіді → модель рядка/форми; generated DTO залишаються в transport/data-access.
- Помилки: 400 → помилки полів/форми, 401/403 → стан доступу, 404/409 → зрозуміле повідомлення та оновлення стану; не показувати raw transport текст.
- Пагінація/сортування: тільки клієнтська для поточного непагінованого списку після підтвердження контрактом; не створювати фальшиві серверні параметри.
- Кеш: ключ списку `suppliers`; успішні write-операції інвалідовують список. Не змінювати інші таблиці без підтвердженої залежності.
- Повтори/скасування: retry лише для читання з поточними умовами; скасовувати застарілий read при виході. Write не повторювати автоматично без гарантії ідемпотентності.
- Обмеження: Додаткових endpoint-залежностей для форми не встановлено. Записів OpenAPI немає; будь-які припущення старого коду потребують узгодження.

## Перевірки та передумови

- [x] Backend OpenAPI має точні `operationId`, responses/errors і зафіксований commit.
- [x] Snapshot із provenance синхронізований; типи згенеровані, YAML/DTO не редаговані вручну.
- [ ] Runtime validation та mapping покриті focused tests.
- [ ] Після створення tooling виконано `npm run contracts:sync -- <checkout> <commit>`, `npm run contracts:generate`, `npm run contracts:check`.
- [ ] Виконано relevant lint/typecheck/test і `npx nx build admin-react`.
