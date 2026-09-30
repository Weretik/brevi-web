# Тканини — споживання API-контракту

Правило: [contract workflow](../../../../../architecture/api/contract-workflow.md).

## Джерело та версія

- Backend: `C:/Users/Віталій/RiderProjects/BreviERP`, commit `2ec6376d986eb18ace4c1b7d360c329d38405b57`.
- Канонічний entry point: `docs/sdd/contracts/openapi.yaml`; контракт тканин: `docs/sdd/contracts/reference/fabrics.openapi.yaml`; lookup: `docs/sdd/contracts/reference/suppliers.openapi.yaml`.
- Frontend snapshot: `docs/contracts/openapi/backend/`; provenance: `docs/contracts/openapi/SOURCE.json`; generated types: `libs/admin/api-contract/src/generated/openapi.ts`.

| `operationId`  | Метод і шлях                         | Сценарії       |
| -------------- | ------------------------------------ | -------------- |
| `getFabrics`   | `GET /api/reference/fabrics`         | SC-001, SC-005 |
| `createFabric` | `POST /api/reference/fabrics`        | SC-003         |
| `updateFabric` | `PUT /api/reference/fabrics/{id}`    | SC-003         |
| `deleteFabric` | `DELETE /api/reference/fabrics/{id}` | SC-004         |
| `getSuppliers` | `GET /api/reference/suppliers`       | SC-003         |

## Рішення клієнта

- `data-access` типізує конкретні generated operations, перевіряє response під час виконання та віддає UI тільки модель `Fabric`.
- Форма перевіряє ID, назву, ціну та назву постачальника за контрактними межами; supplier lookup повторно використовує `listSuppliers`. Мапінг запиту зберігає контрактне поле `providerName`.
- `400` перетворюється на помилки полів; `401/403`, `404`, `409` мають зрозумілі повідомлення; raw transport error не показується.
- Поточний `GET` непагінований; MUI Data Grid сортує та ділить отримані рядки на сторінки локально. Backend повертає `404` для порожнього списку; клієнт відображає його як `[]`.
- Повтор доступний лише для читання; застарілий read скасовується при виході. Успішний запис або видалення перезавантажує список; write не повторюється автоматично.
- `POST` потребує додатного client supplied ID, як і наявні React довідники. Це правило слід перевірити на живому backend при інтеграції.

## Перевірки

- [x] У зафіксованому backend OpenAPI є точні `operationId`, requests, responses та errors.
- [x] Snapshot синхронізовано з commit, generated types відтворюються: `contracts:sync`, `contracts:generate`, `contracts:check`.
- [x] Runtime validation та HTTP error mapping покриті focused tests.
- [x] Relevant lint/typecheck/test/build/E2E виконано; точні результати в [задачах](../tasks/README.md).
