# EN-001 — OpenAPI Додаткові довідники

- **ID задачі:** EN-001
- **Охоплює:** SC-001, SC-003, SC-004
- **Залежить від:** немає
- **Точні шляхи:** `C:/Users/Віталій/RiderProjects/BreviERP/docs/sdd/contracts/openapi.yaml`, майбутній `docs/sdd/contracts/reference/additional-references.openapi.yaml`
- **Рівень тестування:** контрактна перевірка backend

## Робота

- [x] У backend додано versioned OpenAPI для фактичних GET/PUT, security, validation/errors і точні operationId.
- [x] Зафіксовано backend commit `03ed99f2d40f0bb239adb6d3bd9e237eac300344`; оновлено contracts/api-contract.md.
- [x] Контракт feature відокремлено від агрегованого entry point; [аудит](../code-audit/audit.md).

## Свідчення

- Фокусна перевірка: `npm run contracts:check` перевіряє обидва operationId, provenance і повторну генерацію.
- Red: до зміни канонічна схема не містила `getAdditionalReferences` і `updateAdditionalReference`; поведінковий Red для документації не застосовується.
- Green: `npm run contracts:sync -- C:\Users\Віталій\RiderProjects\BreviERP 03ed99f2d40f0bb239adb6d3bd9e237eac300344`, `npm run contracts:generate`, `npm run contracts:check` — успішно.
- Refactor: окремий feature YAML плюс `$ref` в aggregate; повторний `contracts:check` — успішно.
- Regression: data-access typecheck/test, `npx nx build admin-react` і фокусний browser E2E — успішно.

## Контрольна точка

Кожна потрібна операція має operationId в зафіксованому OpenAPI.
