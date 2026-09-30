# Додаткові довідники — споживання API-контракту

- Backend repository: `C:/Users/Віталій/RiderProjects/BreviERP`.
- Канонічний entry point: `docs/sdd/contracts/openapi.yaml`.
- Feature contract: `docs/sdd/contracts/reference/additional-references.openapi.yaml`.
- Зафіксована версія: `03ed99f2d40f0bb239adb6d3bd9e237eac300344`.
- Frontend snapshot: `docs/contracts/openapi/backend/`; provenance: `docs/contracts/openapi/SOURCE.json`; generated types: `libs/admin/api-contract/src/generated/openapi.ts`.

| `operationId`               | Метод і шлях                                    | Сценарії       |
| --------------------------- | ----------------------------------------------- | -------------- |
| `getAdditionalReferences`   | `GET /api/reference/additional-references`      | SC-001, SC-005 |
| `updateAdditionalReference` | `PUT /api/reference/additional-references/{id}` | SC-003         |

Точні поля й обмеження належать OpenAPI. Read response проходить runtime-перевірку перед мапінгом; `404` для порожнього списку перетворюється на `[]` відповідно до backend handler. Форма перевіряє обов'язкові поля, невід'ємне число, допустимі одиниці й довжини перед PUT. `400` мапиться на помилки полів; `401/403`, `404` і `409` показують зрозуміле повідомлення. Write не повторюється автоматично.

Список завантажується без серверної пагінації; Data Grid сортує й розбиває рядки на клієнті. Retry повторює read, вихід зі сторінки скасовує застарілий read, успішний write повторно завантажує список. Інші таблиці не інвалідовуються.

Перевірено `npm run contracts:sync -- C:\Users\Віталій\RiderProjects\BreviERP 03ed99f2d40f0bb239adb6d3bd9e237eac300344`, `npm run contracts:generate`, `npm run contracts:check` — успішно.
