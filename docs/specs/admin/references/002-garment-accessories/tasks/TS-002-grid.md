# TS-002 — Таблиця MUI X

- **ID задачі:** TS-002
- **Охоплює:** SC-001, SC-002, SC-004
- **Залежить від:** TS-001
- **Точні шляхи:** `libs/admin/references/feature/src/components/garment-accessories/`, `libs/admin/references/feature/src/pages/`
- **Рівень тестування:** компонентний

## Робота

- [x] MUI X Community Data Grid має підтверджені колонки, loading/empty/error/retry й доступні row actions.
- [x] Вкладка «Фурнітура виробу» активна; «Тканини» не показано до SDD 003; зайвих controls немає.
- [x] Data Grid виконує клієнтське сортування/пагінацію та керований вибір для bulk-дії.
- [x] Page компонує стан і дії, grid лише показує рядки та події.

## Свідчення

- Фокусний тест: `garment-accessories-page.component.test.tsx`.
- Red: `npx nx test admin-references-feature -- garment-accessories-page.component.test.tsx` — 1 failed, row «Блискавка» відсутній.
- Green: та сама команда — row і вкладка видимі, 1 passed.
- Refactor: grid виділено в компонент; повторний focused suite — успішно.
- Regression: повний `npx nx test admin-references-feature` — 12 passed; lint/typecheck/build/E2E — успішно.

## Контрольна точка

Рядки та порожній/помилковий стани доступні в Brevi shell.
