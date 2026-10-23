# Products — API contract consumption

## Source and version

- Backend repository: `https://github.com/Weretik/BreviERP.git`.
- Canonical entry point: `docs/sdd/contracts/openapi.yaml`.
- Pinned backend revision: `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea`.
- Snapshot/provenance: `docs/contracts/openapi/backend/`,
  `docs/contracts/openapi/SOURCE.json`.
- Generated types: `libs/admin/shared/contracts/src/generated/openapi.ts` via
  `tools/contracts/contracts.mjs`.
- Status: **verified; no new operations needed**.

| `operationId`         | Method and path                | Scenarios              | Status |
| --------------------- | ------------------------------ | ---------------------- | ------ |
| `getAdminProducts`    | `GET /api/v1/products`         | SC-001, SC-003, SC-004 | exists |
| `getAdminProductById` | `GET /api/v1/products/{id}`    | SC-005, SC-006         | exists |
| `createProduct`       | `POST /api/v1/products`        | SC-006, SC-007         | exists |
| `replaceProduct`      | `PUT /api/v1/products/{id}`    | SC-006, SC-007         | exists |
| `deleteProduct`       | `DELETE /api/v1/products/{id}` | SC-001                 | exists |

## Frontend decisions

- Request/response mapping, runtime validation, errors, pagination, sorting,
  filtering, abort, and write protection remain as defined by SDD 001/002.
- The context menu passes the selected row ID to existing actions and makes
  no HTTP request itself.
- Direct detail/edit URLs use `getAdminProductById`; after success, create and
  replace may pass the full response to detail as defined by the earlier SDD.
- `contracts:check` remains a required regression check although the schema
  does not change.
