# Операції (роботи) — споживання API-контракту

Правило: `docs/architecture/api/contract-workflow.md`. Точний `operationId` мусить бути зафіксований до реалізації кожної API-операції.

## Джерело та версія

- Backend repository: `C:/Users/Віталій/RiderProjects/BreviERP` (локальний checkout, наданий користувачем).
- Канонічний entry point: `docs/sdd/contracts/openapi.yaml`.
- Зафіксована версія backend: commit `9f75e832525ea96a327be227f6ec756e01ddfa67` (2026-09-28).
- Операції визначені в `docs/sdd/contracts/reference/garment-part-operations.openapi.yaml`; lookup має `getGarmentParts` у `reference/garment-parts.openapi.yaml` того самого commit.
- Frontend snapshot: `docs/contracts/openapi/backend/`, provenance: `docs/contracts/openapi/SOURCE.json`; generated types: `libs/admin/api-contract/src/generated/openapi.ts`. `contracts:sync`, `contracts:generate`, `contracts:check` виконані.
- Статус: **реалізовано й перевірено** за вказаним commit.

| `operationId`                | Метод і шлях, перевірені за backend controller       | Сценарії       | Статус у канонічному OpenAPI |
| ---------------------------- | ---------------------------------------------------- | -------------- | ---------------------------- |
| `getGarmentPartOperations`   | `GET /api/reference/garment-part-operations`         | SC-001, SC-005 | підтверджено                 |
| `createGarmentPartOperation` | `POST /api/reference/garment-part-operations`        | SC-003         | підтверджено                 |
| `updateGarmentPartOperation` | `PUT /api/reference/garment-part-operations/{id}`    | SC-003         | підтверджено                 |
| `deleteGarmentPartOperation` | `DELETE /api/reference/garment-part-operations/{id}` | SC-004         | підтверджено                 |
| `getGarmentParts`            | `GET /api/reference/garment-parts` (lookup)          | SC-003         | підтверджено                 |

## Рішення клієнта

- Request mapping: форма → generated body конкретної операції після локальної перевірки; selector використовує назву елемента, яку приймає backend request.
- Response validation/mapping: runtime-перевірка мережевої відповіді → модель рядка/форми; generated DTO залишаються в transport/data-access.
- Помилки: 400 → помилки полів/форми, 401/403 → стан доступу, 404/409 → зрозуміле повідомлення та оновлення стану; не показувати raw transport текст.
- Пагінація/сортування: тільки клієнтська для поточного непагінованого списку після підтвердження контрактом; не створювати фальшиві серверні параметри.
- Кеш: список зберігається в локальному стані вкладки `garment-part-operations`; успішні write-операції запускають повторне читання. Lookup елементів повторно читається при наступному відкритті вкладки. Спільного key-value cache у наявній архітектурі довідників немає.
- Повтори/скасування: retry лише для читання з поточними умовами; скасовувати застарілий read при виході. Write не повторювати автоматично без гарантії ідемпотентності.
- Обмеження: створення вимагає завантаженого lookup елементів. Backend приймає клієнтський ID; форма пропонує наступний ID за вже завантаженим списком.

## Перевірки та передумови

- [x] Backend OpenAPI має точні `operationId`, responses/errors і зафіксований commit.
- [x] Snapshot із provenance синхронізований; типи згенеровані, YAML/DTO не редаговані вручну.
- [x] Runtime validation та mapping покриті focused tests.
- [x] Виконано `contracts:sync`, `contracts:generate`, `contracts:check`.
- [x] Виконано relevant lint/typecheck/test і `npx nx build admin-react`.
