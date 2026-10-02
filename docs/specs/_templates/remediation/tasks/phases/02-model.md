# Фаза 02 — Domain model і DTO boundary

- Створити model projects лише для фактично наявних domain responsibilities.
- Перенести types/invariants/pure validation і оновити public contracts.
- Відокремити generated DTO та runtime mapping у data-access.

**Checkpoint:** feature/UI не імпортують generated transport types.
