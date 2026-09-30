# EN-002 — Відтворювані snapshot і типи

- **ID задачі:** EN-002
- **Охоплює:** SC-001–SC-005
- **Залежить від:** EN-001
- **Точні шляхи:** `docs/contracts/openapi/`, `libs/admin/`, `package.json`, `tools/`
- **Рівень тестування:** модульний + компонентний + інтеграційний (E2E для критичного маршруту)

## Робота

- [x] Реалізувати або використати спільні contracts:sync/generate/check за docs/architecture/api/contract-workflow.md.
- [x] Синхронізувати за pinned commit, зафіксувати provenance, type-only generated library, Nx boundaries і check без зміни робочого дерева.
- [x] Не створювати другий генератор, якщо enabler справочника вже виконав ці кроки.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності; незалежні ролі розділити за наявними межами, невеликий цілісний файл зберегти.

## Свідчення

- [Red/Green/Refactor/Regression, точні команди та результати](evidence.md#en-002)

## Контрольна точка

Snapshot і generated types відтворюються з одного backend commit.
