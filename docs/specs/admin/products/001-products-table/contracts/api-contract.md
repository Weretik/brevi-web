# Товари — споживання API-контракту

## Джерело та версія

- Backend repository: `C:/Users/Віталій/RiderProjects/BreviERP`.
- Канонічний entry point: `docs/sdd/contracts/openapi.yaml`; локальний модуль: `docs/sdd/contracts/catalog/product-catalog.openapi.yaml`.
- Зафіксована backend-версія: `7178113572c5c0da21ba9f28db5d94f96dc8e1b6`. Product CRUD уже містився в `03ed99f2d40f0bb239adb6d3bd9e237eac300344`; цей commit додає category/media залежності.
- Frontend snapshot/provenance: `docs/contracts/openapi/backend/`, `docs/contracts/openapi/SOURCE.json`; generated types: `libs/admin/shared/contracts/src/generated/openapi.ts`.
- Статус: **готовий до frontend реалізації**; category lookup/media upload зафіксовані нижче.

| `operationId`               | Метод і шлях                                  | Сценарії       | Статус у зафіксованій версії |
| --------------------------- | --------------------------------------------- | -------------- | ---------------------------- |
| `getAdminProducts`          | `GET /api/v1/products`                        | SC-001, SC-006 | зафіксовано                  |
| `getAdminProductById`       | `GET /api/v1/products/{id}`                   | SC-002, SC-004 | зафіксовано                  |
| `createProduct`             | `POST /api/v1/products`                       | SC-003         | зафіксовано                  |
| `replaceProduct`            | `PUT /api/v1/products/{id}`                   | SC-004         | зафіксовано                  |
| `deleteProduct`             | `DELETE /api/v1/products/{id}`                | SC-005         | зафіксовано                  |
| `getAdminProductCategories` | `GET /api/reference/product-categories/admin` | SC-003, SC-004 | зафіксовано                  |
| `getCatalogMedia`           | `GET /api/catalog/media`                      | SC-003, SC-004 | зафіксовано                  |
| `uploadCatalogMedia`        | `POST /api/catalog/media`                     | SC-003, SC-004 | зафіксовано                  |

## Рішення frontend

- Request mapping: контрольована модель grid → дозволені серверні query parameters; нумерацію MUI з 0 перетворити на API page з 1. Форма → конкретний generated write request після перевірки обов'язкових та умовних секцій; не відтворювати схему вручну в Markdown.
- Response validation/mapping: runtime перевірка list/detail DTO перед передачею моделі застосунку в UI. Невалідний payload → error state, не частково заповнена форма.
- Помилки: 400 → помилки полів/запиту, 401/403 → доступ, 404 → «товар не знайдено», 409 → конфлікт із можливістю повернутись/оновити; не показувати сирі повідомлення.
- Пагінація/сортування/фільтри: серверні тільки за підтриманими параметрами локального контракту; total із `pagedInfo`; зміна умов → перша сторінка; не підміняти серверний результат локально відфільтрованим.
- Кеш/інвалідація: окремого довгоживучого кешу немає. Read effect залежить від усіх умов запиту або ID; після create/replace/delete маршрути монтуються заново, а видалення зі списку викликає явний reload.
- Retry/cancellation: read retry з тими самими умовами, stale read скасовувати; write не повторювати автоматично без підтвердженої ідемпотентності.
- Обмеження: media upload приймає JPEG/PNG/WebP; продукт зберігає mediaFileId. Старий endpoint `/api/admin/products` не використовується.

## Перевірки та передумови

- [x] EN-001 фіксує product OpenAPI й залежності category/media в backend commit; operationId звірені.
- [x] EN-002 створює versioned snapshot/provenance і generated types без ручних змін.
- [x] Runtime validation і mapping, error та mutation tests пройшли (9 API tests, 2 model tests).
- [x] Виконано `npm run contracts:sync -- 'C:\Users\Віталій\RiderProjects\BreviERP' 7178113572c5c0da21ba9f28db5d94f96dc8e1b6`, `npm run contracts:generate`, `npm run contracts:check`.
- [x] Relevant lint/typecheck/test і `npx nx build admin-react` пройшли; фінальна регресія після аудиту записана в [evidence](../tasks/evidence.md).
