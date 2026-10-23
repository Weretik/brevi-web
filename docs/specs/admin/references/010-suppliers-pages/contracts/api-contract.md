# Suppliers — API contract consumption

- Backend: `https://github.com/Weretik/BreviERP.git`.
- Entry point: `docs/sdd/contracts/openapi.yaml`.
- Pinned snapshot: `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea`.
- Provenance/types: `docs/contracts/openapi/SOURCE.json`,
  `libs/admin/shared/contracts/src/generated/openapi.ts`.
- Status: **blocked** for direct detail/edit because GET-by-ID is missing.

| `operationId`     | Method and path                        | SC             | Status          |
| ----------------- | -------------------------------------- | -------------- | --------------- |
| `getSuppliers`    | `GET /api/reference/suppliers`         | SC-001, SC-002 | available       |
| `getSupplierById` | `GET /api/reference/suppliers/{id}`    | SC-003–SC-005  | blocker, EN-001 |
| `createSupplier`  | `POST /api/reference/suppliers`        | SC-004, SC-005 | available       |
| `updateSupplier`  | `PUT /api/reference/suppliers/{id}`    | SC-004, SC-005 | available       |
| `deleteSupplier`  | `DELETE /api/reference/suppliers/{id}` | SC-006         | available       |

EN-001 adds a GET response based on SupplierRow, `404`, and the auth/error contract, followed by sync/generate/check. Preserve the runtime mapper, request mapping, local validation, abort, read retry, no automatic write retry, and list reload after write/delete.
