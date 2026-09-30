# TS-002 — Таблиця MUI X

- **ID задачі:** TS-002
- **Охоплює:** SC-001, SC-002, SC-004
- **Залежить від:** TS-001
- **Точні шляхи:** `libs/admin/references/feature/src/components/fabrics/`, `libs/admin/references/feature/src/pages/`
- **Рівень тестування:** компонентний

## Робота

- [x] Реалізувати безкоштовний MUI X Data Grid з колонками: ID, назва, постачальник, ціна; показати loading/empty/error і доступні дії.
- [x] Зберегти вкладку/сторінку: «Тканини» на тій самій сторінці, що й «Фурнітура виробу»; жодних недіючих import/export/status controls.
- [x] Перевірити client-only sorting/pagination для непагінованого контракту й стани вибору для bulk-дій.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності: незалежні ролі розділити за наявними межами, невеликий цілісний файл зберегти.

## Свідчення

- Фокусний тест: описати/створити тест для таблиця mui x.
- Red: відсутня таблиця, вкладка або доступна дія
- Green: записати виконану команду і результат.
- Refactor: записати рішення щодо відповідальності файлів і повторити фокусний тест.
- Regression: записати relevant lint/typecheck/test/build/E2E і результат.

## Контрольна точка

Рядки та порожній/помилковий стани доступні в Brevi shell.

## Виконання 2026-09-28

- Фокус: `fabrics-page.component.test.tsx` — вкладка, перевірений рядок після retry; `garment-accessories-page.component.test.tsx` — обидві вкладки без втрати старої таблиці.
- Окремий Red до UI-реалізації не зафіксовано; фокусні тести додано після першої реалізації.
- Green/refactor/regression: `npx nx test admin-references-feature` — фінально 17/17; grid, форма, підтвердження та сторінка розділені; `npx nx lint admin-references-feature`, `npx nx typecheck admin-references-feature` — успішно.
