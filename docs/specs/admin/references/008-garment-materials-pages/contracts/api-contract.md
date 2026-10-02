# Тканина та фурнітура — споживання API-контракту

## Джерело та версія

- Backend: `https://github.com/Weretik/BreviERP.git`.
- Entry point: `docs/sdd/contracts/openapi.yaml`.
- Frontend snapshot commit: `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea`.
- Snapshot/provenance/generated types: `docs/contracts/openapi/backend/`,
  `docs/contracts/openapi/SOURCE.json`, `libs/admin/shared/contracts/src/generated/openapi.ts`.
- Статус: чинні list/write contracts достатні для погодженого Drawer scope;
  GET-by-ID deferred разом із direct detail routes.

| `operationId`             | Метод і шлях                                     | Сценарії          | Статус   |
| ------------------------- | ------------------------------------------------ | ----------------- | -------- |
| `getGarmentAccessories`   | `GET /api/reference/garment-accessories`         | SC-001–SC-003     | є        |
| `getGarmentAccessoryById` | `GET /api/reference/garment-accessories/{id}`    | поза Drawer scope | deferred |
| `createGarmentAccessory`  | `POST /api/reference/garment-accessories`        | SC-005, SC-006    | є        |
| `updateGarmentAccessory`  | `PUT /api/reference/garment-accessories/{id}`    | SC-005, SC-006    | є        |
| `deleteGarmentAccessory`  | `DELETE /api/reference/garment-accessories/{id}` | SC-007            | є        |
| `getFabrics`              | `GET /api/reference/fabrics`                     | SC-001–SC-003     | є        |
| `getFabricById`           | `GET /api/reference/fabrics/{id}`                | поза Drawer scope | deferred |
| `createFabric`            | `POST /api/reference/fabrics`                    | SC-005, SC-006    | є        |
| `updateFabric`            | `PUT /api/reference/fabrics/{id}`                | SC-005, SC-006    | є        |
| `deleteFabric`            | `DELETE /api/reference/fabrics/{id}`             | SC-007            | є        |
| `getSuppliers`            | `GET /api/reference/suppliers`                   | SC-005            | є        |

## Рішення frontend

- Drawer view/edit використовує runtime-validated row model із list boundary;
  EN-001 знадобиться лише при поверненні direct detail routes у scope.
- Create/update mapping, validation, supplier lookup і write error semantics
  лишаються чинними; write не повторюється автоматично.
- Після write detail використовує confirmed ID; list інвалідовується при
  поверненні або через поточний reload механізм без нового global cache.
