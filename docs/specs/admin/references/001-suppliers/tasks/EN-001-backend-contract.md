# EN-001 — OpenAPI Постачальники

- **ID задачі:** EN-001
- **Охоплює:** SC-001, SC-003, SC-004
- **Залежить від:** немає
- **Точні шляхи:** `C:/Users/Віталій/RiderProjects/BreviERP/docs/sdd/contracts/openapi.yaml`, майбутній `docs/sdd/contracts/reference/suppliers.openapi.yaml`
- **Рівень тестування:** контрактна перевірка backend

## Робота

- [x] У backend додано versioned OpenAPI для чотирьох фактичних операцій, з `security: []` відповідно до `AllowAnonymous`, validation/errors і точними operationId.
- [x] Зафіксовано backend commit `f74c01f7784b1bccaae3234dfee63d8adac5da76`; оновлено contracts/api-contract.md.
- [x] Операції та схеми належать `reference/suppliers.openapi.yaml`, агрегований entry point містить лише `$ref`.

## Свідчення

- Фокусна перевірка: `npm run contracts:check` валідовує агрегований OpenAPI через `openapi-typescript` і чотири `operationId`.
- Red: початковий `docs/sdd/contracts/openapi.yaml` містив лише Products; `rg -n 'suppliers' docs/sdd/contracts/openapi.yaml` не знаходив операцій.
- Green: `npm run contracts:sync -- C:\Users\Віталій\RiderProjects\BreviERP f74c01f7784b1bccaae3234dfee63d8adac5da76`, `npm run contracts:generate`, `npm run contracts:check` — успішно.
- Refactor: контракт feature залишено окремим від агрегатора; повторний `contracts:check` успішний.
- Regression: `npx nx typecheck admin-api-contract`, `npx nx build admin-react`, `npx nx e2e admin-react-e2e` — успішно. Backend runtime/API тест не запускався: змінено лише OpenAPI/документацію.

## Контрольна точка

Кожна потрібна операція має operationId в зафіксованому OpenAPI.
