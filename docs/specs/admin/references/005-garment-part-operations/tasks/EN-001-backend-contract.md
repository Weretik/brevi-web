# EN-001 — OpenAPI Операції (роботи)

- **ID задачі:** EN-001
- **Охоплює:** SC-001, SC-003, SC-004
- **Залежить від:** немає
- **Точні шляхи:** `C:/Users/Віталій/RiderProjects/BreviERP/docs/sdd/contracts/openapi.yaml`, майбутній `docs/sdd/contracts/reference/garment-part-operations.openapi.yaml`
- **Рівень тестування:** контрактна перевірка backend

## Робота

- [x] Додано versioned OpenAPI для фактичних read/write endpoint із security, validation/errors і operationId.
- [x] Backend commit `9f75e832525ea96a327be227f6ec756e01ddfa67`; оновлено contracts/api-contract.md.
- [x] Lookup використовує вже погоджений `getGarmentParts` із того самого commit.
- [x] Новий контракт окремо в `reference/`, агрегований entry point містить лише refs; controller не змінено.

## Свідчення

- Фокусна перевірка: `npm run contracts:check` — snapshot, refs, operationId і generated types узгоджені.
- Red: поведінковий Red для документації не застосовується; до зміни entry point не містив garment-part-operations.
- Green: `npm run contracts:sync -- C:\Users\Віталій\RiderProjects\BreviERP 9f75e832525ea96a327be227f6ec756e01ddfa67`, `npm run contracts:generate`, `npm run contracts:check` — успішно.
- Refactor: контракт винесено в окремий feature YAML, controller залишено без змін; `contracts:check` повторено успішно.
- Regression: `npx nx typecheck admin-references-data-access`, `npx nx build admin-react`, `npx nx e2e admin-react-e2e` — успішно.

## Контрольна точка

Кожна потрібна операція має operationId в зафіксованому OpenAPI.
