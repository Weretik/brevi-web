# EN-001 — Зафіксувати backend OpenAPI і узгодити попередню SDD

- **ID задачі:** EN-001
- **Охоплює:** SC-001–SC-005
- **Залежить від:** немає
- **Точні шляхи:** `C:/Users/Віталій/RiderProjects/BreviERP/docs/sdd/contracts/`, `docs/specs/admin/products/product-list-data-grid.md`
- **Рівень тестування:** модульний + компонентний + інтеграційний (E2E для критичного маршруту)

## Робота

- [x] У backend зафіксувати локальний product OpenAPI й агрегований entry point; звірити його з runtime endpoint та operationId.
- [x] Перевірити окремі category lookup і media upload contracts для повних форм; за потреби додати їх у backend до UI-завдань.
- [x] Явно відхилити або оновити історичне припущення про /api/admin/products без переписування історичного evidence.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності; незалежні ролі розділити за наявними межами, невеликий цілісний файл зберегти.

## Свідчення

- [Red/Green/Refactor/Regression, точні команди та результати](evidence.md#en-001)

## Контрольна точка

Новий commit/tag містить усі потрібні операції й узгоджений шлях.
