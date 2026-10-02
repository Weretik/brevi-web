# Операції — споживання API-контракту

- Backend: `https://github.com/Weretik/BreviERP.git`.
- Entry point: `docs/sdd/contracts/openapi.yaml`.
- Pinned snapshot: `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea`.
- Provenance/types: `docs/contracts/openapi/SOURCE.json`,
  `libs/admin/shared/contracts/src/generated/openapi.ts`.
- Статус: чинні list/write contracts достатні для погодженого Drawer scope;
  GET-by-ID відкладені разом із direct detail routes.

| `operationId`                 | Метод і шлях                                         | Сценарії              | Статус   |
| ----------------------------- | ---------------------------------------------------- | --------------------- | -------- |
| `getGarmentParts`             | `GET /api/reference/garment-parts`                   | SC-001–SC-003, SC-006 | є        |
| `getGarmentPartById`          | `GET /api/reference/garment-parts/{id}`              | поза Drawer scope     | deferred |
| `createGarmentPart`           | `POST /api/reference/garment-parts`                  | SC-005                | є        |
| `updateGarmentPart`           | `PUT /api/reference/garment-parts/{id}`              | SC-005                | є        |
| `deleteGarmentPart`           | `DELETE /api/reference/garment-parts/{id}`           | SC-007                | є        |
| `getGarmentPartOperations`    | `GET /api/reference/garment-part-operations`         | SC-001–SC-003         | є        |
| `getGarmentPartOperationById` | `GET /api/reference/garment-part-operations/{id}`    | поза Drawer scope     | deferred |
| `createGarmentPartOperation`  | `POST /api/reference/garment-part-operations`        | SC-005, SC-006        | є        |
| `updateGarmentPartOperation`  | `PUT /api/reference/garment-part-operations/{id}`    | SC-005, SC-006        | є        |
| `deleteGarmentPartOperation`  | `DELETE /api/reference/garment-part-operations/{id}` | SC-007                | є        |

Drawer view/edit отримує runtime-validated application model із list boundary;
create використовує порожній draft. Чинні validation, lookup, retry, write lock
і відсутність automatic write retry зберігаються. EN-001 знадобиться лише якщо
окремі direct detail routes повернуться до scope.
