# Додаткові довідники — споживання API-контракту

- Backend: `https://github.com/Weretik/BreviERP.git`.
- Entry point: `docs/sdd/contracts/openapi.yaml`.
- Pinned snapshot: `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea`.
- Provenance/types: `docs/contracts/openapi/SOURCE.json`,
  `libs/admin/shared/contracts/src/generated/openapi.ts`.
- Статус: **blocked** для create/detail/delete; повторно перевірено 2026-10-01
  на backend `origin/master` `5d97cc098ade99068d1da70ccc0f6562ec852f2c`.

| `operationId`                | Метод і шлях                                       | SC             | Статус  |
| ---------------------------- | -------------------------------------------------- | -------------- | ------- |
| `getAdditionalReferences`    | `GET /api/reference/additional-references`         | SC-001, SC-002 | є       |
| `getAdditionalReferenceById` | `GET /api/reference/additional-references/{id}`    | SC-003–SC-005  | blocker |
| `createAdditionalReference`  | `POST /api/reference/additional-references`        | SC-004, SC-005 | blocker |
| `updateAdditionalReference`  | `PUT /api/reference/additional-references/{id}`    | SC-004, SC-005 | є       |
| `deleteAdditionalReference`  | `DELETE /api/reference/additional-references/{id}` | SC-006         | blocker |

EN-001 має погодити ID ownership, create request/response/status,
GET-by-ID response/404, delete success/conflict, auth і validation, додати їх
до aggregated OpenAPI, pin commit і sync/generate/check. До цього frontend не
створює ручні DTO або optimistic local CRUD. Existing update mapping,
validation, abort/read retry/no write retry зберігаються.
