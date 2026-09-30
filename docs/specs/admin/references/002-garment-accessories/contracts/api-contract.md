# Фурнітура виробу — споживання API-контракту

Правило: `docs/architecture/api/contract-workflow.md`. Точний `operationId` мусить бути зафіксований до реалізації кожної API-операції.

## Джерело та версія

- Backend repository: `C:/Users/Віталій/RiderProjects/BreviERP` (локальний checkout, наданий користувачем).
- Канонічний entry point: `docs/sdd/contracts/openapi.yaml`.
- Зафіксована версія backend: `d2b011647ed14ec32eb42b76aac2e908fb3d95e6`; garment contract: `docs/sdd/contracts/reference/garment-accessories.openapi.yaml`.
- Frontend snapshot/provenance: `docs/contracts/openapi/`; generated types: `libs/admin/api-contract/src/generated/openapi.ts`.
- Статус: чотири garment operations і `getSuppliers` наявні у зафіксованому OpenAPI.

| `operationId`            | Метод і шлях, перевірені за backend controller   | Сценарії       | Статус у канонічному OpenAPI |
| ------------------------ | ------------------------------------------------ | -------------- | ---------------------------- |
| `getGarmentAccessories`  | `GET /api/reference/garment-accessories`         | SC-001, SC-005 | pinned                       |
| `createGarmentAccessory` | `POST /api/reference/garment-accessories`        | SC-003         | pinned                       |
| `updateGarmentAccessory` | `PUT /api/reference/garment-accessories/{id}`    | SC-003         | pinned                       |
| `deleteGarmentAccessory` | `DELETE /api/reference/garment-accessories/{id}` | SC-004         | pinned                       |
| `getSuppliers`           | `GET /api/reference/suppliers` (lookup)          | SC-003         | pinned                       |

## Рішення клієнта

- Request mapping: форма → generated body для `createGarmentAccessory` або `updateGarmentAccessory`; постачальник надсилається за назвою, як вимагає backend.
- Response validation/mapping: runtime-перевірка мережевої відповіді → модель рядка/форми; generated DTO залишаються в transport/data-access.
- Помилки: 400 → помилки полів/форми, 401/403 → стан доступу, 404/409 → зрозуміле повідомлення та оновлення стану; не показувати raw transport текст.
- Пагінація/сортування: тільки клієнтська для поточного непагінованого списку після підтвердження контрактом; не створювати фальшиві серверні параметри.
- Кеш: ключ списку `garment-accessories`; успішні write-операції інвалідовують список та відповідні lookup-дані. Не змінювати інші таблиці без підтвердженої залежності.
- Повтори/скасування: retry лише для читання з поточними умовами; скасовувати застарілий read при виході. Write не повторювати автоматично без гарантії ідемпотентності.
- Обмеження: backend `GetGarmentAccessoriesQueryHandler` повертає 404 для порожнього списку; клієнт нормалізує саме 404 списку до `[]`. Lookup використовує `getSuppliers` і перевірену модель.

## Перевірки та передумови

- [x] Backend OpenAPI має точні `operationId`, responses/errors і зафіксований commit.
- [x] Snapshot із provenance синхронізований; типи згенеровані, YAML/DTO не редаговані вручну.
- [x] Runtime validation та mapping покриті focused tests.
- [x] Виконано `npm run contracts:sync -- C:\Users\Віталій\RiderProjects\BreviERP d2b011647ed14ec32eb42b76aac2e908fb3d95e6`, `npm run contracts:generate`, `npm run contracts:check`.
- [x] Виконано relevant lint/typecheck/test і `npx nx build admin-react`.
