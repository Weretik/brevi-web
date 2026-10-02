# Товари — споживання API-контракту

## Джерело та версія

- Backend repository: `https://github.com/Weretik/BreviERP.git`.
- Канонічний entry point: `docs/sdd/contracts/openapi.yaml`.
- Зафіксована версія backend: `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea`.
- Snapshot/provenance: `docs/contracts/openapi/backend/`,
  `docs/contracts/openapi/SOURCE.json`.
- Generated types: `libs/admin/shared/contracts/src/generated/openapi.ts` через
  `tools/contracts/contracts.mjs`.
- Статус: **verified; нових операцій не потрібно**.

| `operationId`         | Метод і шлях                   | Сценарії               | Статус |
| --------------------- | ------------------------------ | ---------------------- | ------ |
| `getAdminProducts`    | `GET /api/v1/products`         | SC-001, SC-003, SC-004 | є      |
| `getAdminProductById` | `GET /api/v1/products/{id}`    | SC-005, SC-006         | є      |
| `createProduct`       | `POST /api/v1/products`        | SC-006, SC-007         | є      |
| `replaceProduct`      | `PUT /api/v1/products/{id}`    | SC-006, SC-007         | є      |
| `deleteProduct`       | `DELETE /api/v1/products/{id}` | SC-001                 | є      |

## Рішення frontend

- Request/response mapping, runtime validation, errors, pagination, sorting,
  filtering, abort і write protection лишаються з SDD 001/002.
- Контекстне меню передає існуючим діям ID вибраного рядка й не виконує HTTP.
- Detail/edit на прямій адресі використовують `getAdminProductById`; create й
  replace після успіху можуть передати повний response у detail як уже
  визначено попередньою SDD.
- `contracts:check` є обов'язковою regression-перевіркою, хоча schema не
  змінюється.
