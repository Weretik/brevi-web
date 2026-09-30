# EN-001 — OpenAPI Фурнітура виробу

- **ID задачі:** EN-001
- **Охоплює:** SC-001, SC-003, SC-004
- **Залежить від:** немає
- **Точні шляхи:** `C:/Users/Віталій/RiderProjects/BreviERP/docs/sdd/contracts/openapi.yaml`, `docs/sdd/contracts/reference/garment-accessories.openapi.yaml`
- **Рівень тестування:** контрактна перевірка backend

## Робота

- [x] Backend OpenAPI описує фактичні GET/POST/PUT/DELETE, `security: []` відповідно до `AllowAnonymous`, validation/errors і точні operationId.
- [x] Backend commit `d2b011647ed14ec32eb42b76aac2e908fb3d95e6`; contracts/api-contract.md містить provenance, без дублювання схем.
- [x] Lookup використовує вже зафіксований `getSuppliers`.
- [x] Операції та схеми окремо в `reference/garment-accessories.openapi.yaml`; агрегатор містить лише `$ref`.

## Свідчення

- Фокусна перевірка: `npm run contracts:check` — чотири garment operationId, provenance hash і повторна генерація збігаються.
- Red: до зміни `rg -n 'garment-accessor' docs/sdd/contracts/openapi.yaml` не знаходив операцій.
- Green: `npm run contracts:sync -- C:\Users\Віталій\RiderProjects\BreviERP d2b011647ed14ec32eb42b76aac2e908fb3d95e6`, `npm run contracts:generate`, `npm run contracts:check` — успішно.
- Refactor: окремий contract file, агрегатор `$ref`; повторний `contracts:check` успішний.
- Regression: `npx nx typecheck admin-references-data-access`, `npx nx build admin-react`, `npx nx e2e admin-react-e2e` — успішно. Backend runtime/API не змінювався; перевірено контрактну схему та генерацію.

## Контрольна точка

Кожна потрібна операція має operationId в зафіксованому OpenAPI.
