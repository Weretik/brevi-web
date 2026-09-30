# Фаза 06 — Перевірка та постачання

- TS-013 закриває `SC-*` лише за наявності focused Red/Green/Refactor/Regression evidence у task-файлах.
- Після структурних змін завершити `code-audit/audit.md`.
- Повторити relevant product/app/E2E lint, typecheck, unit/component/integration, build, `contracts:check`, `docs:check`; записати фактичний результат, не зараховувати попередні прогони як нові.
- Реальний backend/media persistence перевірити за доступності середовища або вказати межу fixture E2E.

**Контрольна точка:** усі in-scope сценарії `verified` або явно `deferred` із причиною.
