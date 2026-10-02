# TS-007 — Порядок описових колекцій

- **ID задачі:** TS-007
- **Охоплює:** SC-007
- **Залежить від:** TS-003
- **Точні шляхи:** `libs/admin/products/ui/src/product-editor/content/product-information-fields.tsx`, `libs/admin/products/ui/src/product-editor/content/product-characteristic-fields.tsx`, `libs/admin/products/model/src/ordering/product-order.ts` (цільовий за потреби), `libs/admin/products/model/src/ordering/product-order.test.ts` (цільовий)
- **Рівень тестування:** модульний + компонентний

## Робота

- [x] Додати доступні кнопки перестановки Information, таблиць і рядків Characteristics; зберегти окреме редагування `uk`/`ru`.
- [x] Після move/delete нормалізувати `sortOrder` для кожної колекції; detail і draft з GET показують серверний порядок, не тільки порядок масиву.
- [x] Перевірити змінені файли на цілісність відповідальності; рішення записати в `code-audit/audit.md`. Розділити незалежні ролі за наявними межами, але не невеликий цілісний файл.

## Свідчення

- Шлях/назва фокусного тесту: Переставлення другого блока, таблиці й рядка дає очікуваний порядок і повні локалізовані поля у write draft.
- Red: Baseline не мав цієї поведінки; автоматичний Red до зміни не було зафіксовано.
- Green: product-order unit tests; npx nx test admin-products-feature — 11/11, npx nx test admin-products-data-access — 11/11, product Playwright — 6/6.
- Refactor: межі відповідальностей перевірено в code-audit/audit.md; фокусні та повні перевірки повторено.
- Regression: ADMIN_REACT_BASE_URL=http://localhost:4319 npx nx e2e admin-react-e2e --workers=2 — 25/25.

## Контрольна точка

SC-007 зберігає порядок усіх описових колекцій.
