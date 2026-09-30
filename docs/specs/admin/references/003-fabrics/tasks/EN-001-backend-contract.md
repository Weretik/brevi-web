# EN-001 — OpenAPI Тканини

- **ID задачі:** EN-001
- **Охоплює:** SC-001, SC-003, SC-004
- **Залежить від:** немає
- **Точні шляхи:** `C:/Users/Віталій/RiderProjects/BreviERP/docs/sdd/contracts/openapi.yaml`, майбутній `docs/sdd/contracts/reference/fabrics.openapi.yaml`
- **Рівень тестування:** контрактна перевірка backend

## Робота

- [x] У backend додати й перевірити versioned OpenAPI для фактичних read/write endpoint цієї feature; погодити security, validation/errors і точні operationId.
- [x] Зафіксувати backend commit/tag; оновити contracts/api-contract.md без переписування схем у Markdown.
- [x] Додати operationId для lookup-залежності форми або зафіксувати її вже погоджений контракт.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності: незалежні ролі розділити за наявними межами, невеликий цілісний файл зберегти.

## Свідчення

- Фокусний тест: описати/створити тест для openapi тканини.
- Red: канонічна схема не містить потрібних операцій
- Green: записати виконану команду і результат.
- Refactor: записати рішення щодо відповідальності файлів і повторити фокусний тест.
- Regression: записати relevant lint/typecheck/test/build/E2E і результат.

## Контрольна точка

Кожна потрібна операція має operationId в зафіксованому OpenAPI.

## Виконання 2026-09-28

- Backend commit: `2ec6376d986eb18ace4c1b7d360c329d38405b57` (чистий checkout після commit); `getFabrics`, `createFabric`, `updateFabric`, `deleteFabric`. Lookup `getSuppliers` уже був у канонічному контракті.
- До зміни `rg 'fabrics' docs/sdd/contracts/openapi.yaml` не знаходив операцій. Для documentation-only enabler поведінковий Red не застосовується.
- Green/replacement: `npm run contracts:sync -- C:\Users\Віталій\RiderProjects\BreviERP 2ec6376d986eb18ace4c1b7d360c329d38405b57`, `npm run contracts:generate`, `npm run contracts:check` — успішно.
- Refactor: окремий `reference/fabrics.openapi.yaml`, агрегований entry point лише посилається на нього; повторний `contracts:check` успішний.
- Regression: `npx nx lint admin-api-contract`, `npx nx build admin-react` — успішно. Живий API test не запускався, бо немає підключеного backend середовища.
