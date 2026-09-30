# Admin-товар — споживання API-контракту

## Джерело та версія

- Backend repository: `https://github.com/Weretik/BreviERP.git` (локальний checkout `C:/Users/Віталій/RiderProjects/BreviERP`).
- Канонічний OpenAPI entry point: `docs/sdd/contracts/openapi.yaml`; модулі: `docs/sdd/contracts/catalog/product-catalog.openapi.yaml`, `product-dependencies.openapi.yaml` та відповідні `docs/sdd/contracts/reference/*.openapi.yaml`.
- Зафіксована версія backend і frontend snapshot: `7178113572c5c0da21ba9f28db5d94f96dc8e1b6`.
- Snapshot і provenance: `docs/contracts/openapi/backend/openapi.yaml`, `docs/contracts/openapi/SOURCE.json`; generator: `tools/contracts/contracts.mjs` + `openapi-typescript`; generated types: `libs/admin/api-contract/src/generated/openapi.ts`.
- Статус: операції й tooling існують; перед реалізацією повторити `npm run contracts:check`. Нових backend операцій не планується.

| `operationId`               | Метод і шлях                                  | Сценарії                     | Snapshot |
| --------------------------- | --------------------------------------------- | ---------------------------- | -------- |
| `getAdminProducts`          | `GET /api/v1/products`                        | SC-001, SC-010               | є        |
| `getAdminProductById`       | `GET /api/v1/products/{id}`                   | SC-002–SC-005, SC-008–SC-009 | є        |
| `createProduct`             | `POST /api/v1/products`                       | SC-006–SC-009                | є        |
| `replaceProduct`            | `PUT /api/v1/products/{id}`                   | SC-006–SC-009                | є        |
| `deleteProduct`             | `DELETE /api/v1/products/{id}`                | SC-009–SC-010                | є        |
| `getAdminProductCategories` | `GET /api/reference/product-categories/admin` | SC-001, SC-009               | є        |
| `getCatalogMedia`           | `GET /api/catalog/media`                      | SC-006                       | є        |
| `uploadCatalogMedia`        | `POST /api/catalog/media`                     | SC-006                       | є        |
| `getFabrics`                | `GET /api/reference/fabrics`                  | SC-007, SC-009               | є        |
| `getGarmentAccessories`     | `GET /api/reference/garment-accessories`      | SC-007, SC-009               | є        |
| `getGarmentPartOperations`  | `GET /api/reference/garment-part-operations`  | SC-007, SC-009               | є        |
| `getSuppliers`              | `GET /api/reference/suppliers`                | SC-005, SC-009               | є        |
| `getAdditionalReferences`   | `GET /api/reference/additional-references`    | SC-005, SC-009               | є        |

## Рішення frontend

- Request mapping: список надсилає один `search`, `type`, `categoryId`, `sortBy` із `[id, name, createdAt, updatedAt]`, `sortDirection`, 1-based `page`, `pageSize` із 10/20/50. Початково `name asc`, сторінка 1, розмір 20. Форма зберігає всі спільні колекції й лише вибраний тип; ID у create body, в replace URL.
- Response mapping: list `categoryIds` зіставляти з admin category lookup; при відсутній назві показати ID, не вигадувати назву. Для detail показувати всі nested fields з підтвердженого `ProductDetail` і сортувати колекції за `sortOrder`; не переносити read-only назви, ціни, хвилини чи slug до write payload. Поточна runtime перевірка `products.mapper.ts` залишається межею.
- Media readiness: `uploadCatalogMedia` повертає ID/URL, але **не** status. `getCatalogMedia` повертає `status: string`; значення `Ready` підтверджене backend доменною моделлю на pinned commit. Після upload повторити list та зв'язувати лише файл зі статусом `Ready`; невідомий status трактувати як неготовий. Upload не створює Product-зв'язку.
- 400/409/404: 400 `ValidationError[]` мапити до поля/блоку; 409 повертає масив повідомлень, показувати безпечний текст API без технічного stack/debug; 404 може не мати body. Всі невдалі write зберігають форму; read retry не повторює write.
- Success: 201/200 вже повертає повний `ProductDetail`. Використати його в картці одразу; direct URL/reload робить GET, щоб отримати актуальні довідникові значення. Після 204 оновити список; MediaFile delete не викликати.
- Кеш та інвалідація: окремого довгоживучого кешу немає. Повна відповідь write — одноразовий перехід до detail; при поверненні або прямому відкритті читаємо сервер. Stale read і abort лишаються у hooks.
- Відсотки Ppe: у Reference режимі UI пропонує лише записи `%`; write містить їхній ID. У Custom write містить тільки числовий відсоток. Ціни не обчислюються на клієнті.

## Перевірки та передумови

- [x] `operationId`, source paths, commit, snapshot, generated types і tooling звірені під час підготовки SDD.
- [x] Перед кодом і після коду: `npm run contracts:check` пройшов; backend contract не змінювався, sync/generate не потрібні.
- [x] Після коду: product feature/data-access tests, browser fixture journeys, relevant lint/typecheck/build пройшли.
- [x] Реальний backend не підключено; межу fixture E2E записано в delivery й аудиті.
