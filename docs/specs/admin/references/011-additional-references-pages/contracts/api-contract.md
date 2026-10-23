# Additional References — API Contract Consumption

- Backend: `https://github.com/Weretik/BreviERP.git`.
- Entry point: `docs/sdd/contracts/openapi.yaml`.
- Pinned snapshot: `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea`.
- Provenance/types: `docs/contracts/openapi/SOURCE.json`,
  `libs/admin/shared/contracts/src/generated/openapi.ts`.
- Status: **blocked** for create/detail/delete; rechecked on 2026-10-01 against
  backend `origin/master` `5d97cc098ade99068d1da70ccc0f6562ec852f2c`.

| `operationId`                | Method and path                                    | SC             | Status    |
| ---------------------------- | -------------------------------------------------- | -------------- | --------- |
| `getAdditionalReferences`    | `GET /api/reference/additional-references`         | SC-001, SC-002 | available |
| `getAdditionalReferenceById` | `GET /api/reference/additional-references/{id}`    | SC-003–SC-005  | blocked   |
| `createAdditionalReference`  | `POST /api/reference/additional-references`        | SC-004, SC-005 | blocked   |
| `updateAdditionalReference`  | `PUT /api/reference/additional-references/{id}`    | SC-004, SC-005 | available |
| `deleteAdditionalReference`  | `DELETE /api/reference/additional-references/{id}` | SC-006         | blocked   |

EN-001 must agree on ID ownership, create request/response/status,
GET-by-ID response/404, delete success/conflict, auth, and validation; add them
to aggregated OpenAPI; pin the commit; and sync/generate/check. Until then, the
frontend does not create manual DTOs or optimistic local CRUD. Existing update
mapping, validation, abort/read retry/no write retry remain in place.
