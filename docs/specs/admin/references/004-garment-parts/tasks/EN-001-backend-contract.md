# EN-001 — OpenAPI Елементи виробу

- **ID задачі:** EN-001
- **Охоплює:** SC-001, SC-003, SC-004
- **Залежить від:** немає
- **Точні шляхи:** `C:/Users/Віталій/RiderProjects/BreviERP/docs/sdd/contracts/openapi.yaml`, майбутній `docs/sdd/contracts/reference/garment-parts.openapi.yaml`
- **Рівень тестування:** контрактна перевірка backend

## Робота

- [x] У backend додано versioned OpenAPI для чотирьох endpoint-ів із operationId, security та validation/errors, звіреними з controller, DTO та validators.
- [x] Backend commit `2757080afbaf994884de5745b53d7bc7c8d83b1b`; оновлено `contracts/api-contract.md` без дублювання схем.
- [x] Feature-схема відокремлена від агрегованого entry point; змін реалізації backend не було.

## Свідчення

- Фокусна перевірка: `npm run contracts:check` — snapshot OpenAPI і generated types збігаються з provenance, 2026-09-28.
- Red: до EN-001 агрегований `openapi.yaml` не містив `/api/reference/garment-parts`; поведінковий Red не застосовується до documentation contract prerequisite.
- Green: `git diff --check` у backend; `npm run contracts:sync -- C:\Users\Віталій\RiderProjects\BreviERP 2757080afbaf994884de5745b53d7bc7c8d83b1b`, `npm run contracts:generate`, `npm run contracts:check` — успішно.
- Refactor: окремий `reference/garment-parts.openapi.yaml` містить операції й схеми; `openapi.yaml` лише `$ref`. Повторний `contracts:check` успішний.
- Regression: `npx nx test admin-references-data-access` — 19 тестів успішно; `npx nx build admin-react` — успішно.

## Контрольна точка

Кожна потрібна операція має operationId в зафіксованому OpenAPI.
