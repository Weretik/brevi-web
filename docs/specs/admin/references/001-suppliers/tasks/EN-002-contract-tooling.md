# EN-002 — Відтворювана синхронізація та генерація

- **ID задачі:** EN-002
- **Охоплює:** SC-001, SC-003
- **Залежить від:** немає; конкретний snapshot синхронізується після EN-001 відповідної feature
- **Точні шляхи:** `docs/contracts/openapi/`, `libs/admin/` (generated type-only boundary), `package.json`, `tools/`
- **Рівень тестування:** перевірка налаштування

## Робота

- [x] Реалізовано спільні `contracts:sync/generate/check` за contract workflow.
- [x] Додано provenance, snapshot, type-only Nx library; `npx nx show project admin-api-contract --json` показує lint/typecheck.
- [x] Snapshot синхронізовано з backend `f74c01f7784b1bccaae3234dfee63d8adac5da76` після EN-001.
- [x] Генератор, синхронізація й перевірка залишені в одному `tools/contracts/contracts.mjs`; generated types окремо у library.

## Свідчення

- Фокусна перевірка: `npm run contracts:check` — snapshot SHA та повторна генерація збігаються.
- Red: поведінковий Red не застосовується до generator/setup; до зміни scripts і snapshot були відсутні.
- Green: `npm run contracts:sync -- C:\Users\Віталій\RiderProjects\BreviERP f74c01f7784b1bccaae3234dfee63d8adac5da76`, `npm run contracts:generate`, `npm run contracts:check` — успішно.
- Refactor: копіювання зроблено по файлах після збою `cpSync` у Windows; повторний sync/generate/check успішний.
- Regression: `npx nx lint admin-api-contract`, `npx nx typecheck admin-api-contract`, `npx nx build admin-react` — успішно.

## Контрольна точка

Одна версія backend відтворює snapshot і generated types без ручних правок.
