# Готовність до постачання

- [x] Усі SC-001–SC-010 `verified` у traceability на fixture API.
- [ ] Усі TS-/EN- checkpoint і evidence заповнені; Green, Refactor і Regression пройшли. Red зафіксовано для TS-001–TS-005; для TS-006–TS-012 Red до реалізації не збережено.
- [x] Список, detail, форми, API та двомовне уточнення узгоджені з pinned contract і адміністративним сценарієм.
- [x] `npm run contracts:check`, relevant product/app/E2E lint, typecheck, tests, `npx nx build admin-react` і `npm run docs:check` пройшли.
- [x] `code-audit/audit.md` заповнено після перегляду всього зміненого й повторно використаного коду; незалежні ролі розділено, а рішення залишити файл цілісним пояснено.
- [x] Критичні browser journeys перевірені на 320/768/1280 px в обох темах; прямий URL/reload, фокус, Ready media та null calculations мають evidence.
- [x] Реальний backend/media persistence не перевірено; межа fixture E2E названа в аудиті й звіті.

Delivery checkpoint має один процесний виняток: неможливо відновити хронологічний Red для вже впроваджених TS-006–TS-012. Історичні записи `001-products-table` не переписано.
