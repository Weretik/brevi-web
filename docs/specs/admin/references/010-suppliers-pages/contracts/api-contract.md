# Постачальники — споживання API-контракту

- Backend: `https://github.com/Weretik/BreviERP.git`.
- Entry point: `docs/sdd/contracts/openapi.yaml`.
- Pinned snapshot: `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea`.
- Provenance/types: `docs/contracts/openapi/SOURCE.json`,
  `libs/admin/shared/contracts/src/generated/openapi.ts`.
- Статус: **blocked** для direct detail/edit через відсутній GET-by-ID.

| `operationId`     | Метод і шлях                           | SC             | Статус          |
| ----------------- | -------------------------------------- | -------------- | --------------- |
| `getSuppliers`    | `GET /api/reference/suppliers`         | SC-001, SC-002 | є               |
| `getSupplierById` | `GET /api/reference/suppliers/{id}`    | SC-003–SC-005  | blocker, EN-001 |
| `createSupplier`  | `POST /api/reference/suppliers`        | SC-004, SC-005 | є               |
| `updateSupplier`  | `PUT /api/reference/suppliers/{id}`    | SC-004, SC-005 | є               |
| `deleteSupplier`  | `DELETE /api/reference/suppliers/{id}` | SC-006         | є               |

EN-001 додає GET response на основі SupplierRow, 404 й auth/error contract,
після чого sync/generate/check. Runtime mapper, request mapping, local
validation, abort, read retry, no automatic write retry та list reload після
write/delete зберігаються.
