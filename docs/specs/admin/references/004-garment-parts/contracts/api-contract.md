# Елементи виробу — споживання API-контракту

Правило: `docs/architecture/api/contract-workflow.md`. Точний `operationId` мусить бути зафіксований до реалізації кожної API-операції.

## Джерело та версія

- Backend repository: `C:/Users/Віталій/RiderProjects/BreviERP` (локальний checkout, наданий користувачем).
- Канонічний entry point: `docs/sdd/contracts/openapi.yaml`.
- Зафіксована версія backend для feature: commit `2757080afbaf994884de5745b53d7bc7c8d83b1b` (2026-09-28).
- Feature contract: `docs/sdd/contracts/reference/garment-parts.openapi.yaml`; агрегований entry point посилається на нього.
- Frontend snapshot/provenance: `docs/contracts/openapi/`; generated types: `libs/admin/api-contract/src/generated/openapi.ts`.
- Статус: **implemented** — snapshot і типи відтворені та перевірені на зазначеному commit.

| `operationId`       | Метод і шлях, перевірені за backend controller | Сценарії       | Статус у канонічному OpenAPI |
| ------------------- | ---------------------------------------------- | -------------- | ---------------------------- |
| `getGarmentParts`   | `GET /api/reference/garment-parts`             | SC-001, SC-005 | зафіксований                 |
| `createGarmentPart` | `POST /api/reference/garment-parts`            | SC-003         | зафіксований                 |
| `updateGarmentPart` | `PUT /api/reference/garment-parts/{id}`        | SC-003         | зафіксований                 |
| `deleteGarmentPart` | `DELETE /api/reference/garment-parts/{id}`     | SC-004         | зафіксований                 |

## Рішення клієнта

- Request mapping: форма → параметри конкретної операції після локальної перевірки; точні поля визначає майбутній OpenAPI, не ручний DTO старого Angular.
- Response validation/mapping: runtime-перевірка мережевої відповіді → модель рядка/форми; generated DTO залишаються в transport/data-access.
- Помилки: 400 → помилки полів/форми, 401/403 → стан доступу, 404/409 → зрозуміле повідомлення та оновлення стану; не показувати raw transport текст.
- Пагінація/сортування: тільки клієнтська для поточного непагінованого списку після підтвердження контрактом; не створювати фальшиві серверні параметри.
- Стан списку: `useGarmentParts` тримає рядки в межах сторінки; успішні write-операції повторно читають список. Між сторінками persistent cache не використовується.
- Повтори/скасування: retry лише для читання з поточними умовами; скасовувати застарілий read при виході. Write не повторювати автоматично без гарантії ідемпотентності.
- Обмеження: Додаткових endpoint-залежностей для форми немає. Backend повертає 404 для порожньої колекції; read boundary відображає її як порожній список.

## Перевірки та передумови

- [x] Backend OpenAPI має точні `operationId`, responses/errors і зафіксований commit.
- [x] Snapshot із provenance синхронізований; типи згенеровані, YAML/DTO не редаговані вручну.
- [x] Runtime validation та mapping покриті focused tests.
- [x] Виконано `npm run contracts:sync -- C:\Users\Віталій\RiderProjects\BreviERP 2757080afbaf994884de5745b53d7bc7c8d83b1b`, `npm run contracts:generate`, `npm run contracts:check` — успішно.
- [x] Relevant lint/typecheck/test для libraries і `npx nx build admin-react` — успішно; app regression тест після route оновлено.
