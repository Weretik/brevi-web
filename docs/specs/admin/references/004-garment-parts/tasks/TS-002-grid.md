# TS-002 — Таблиця MUI X

- **ID задачі:** TS-002
- **Охоплює:** SC-001, SC-002, SC-004
- **Залежить від:** TS-001
- **Точні шляхи:** `libs/admin/references/feature/src/components/garment-parts/`, `libs/admin/references/feature/src/pages/`
- **Рівень тестування:** компонентний

## Робота

- [x] Реалізовано MUI X Data Grid з ID, назвою, loading/empty/error та діями.
- [x] Сторінка має вкладку «Елементи»; «Роботи» буде додано за SDD 005. Недійових controls немає.
- [x] Grid сортує й розбиває завантажені рядки на клієнті; bulk використовує тільки явний selection.
- [x] Page, grid і read hook мають окремі відповідальності.

## Свідчення

- Фокусний тест: `garment-parts-page.component.test.tsx` (рядки й вкладка).
- Red: `npx nx test admin-references-feature -- garment-parts-page.component.test.tsx` — 3 behavioral failures для порожньої page: рядок, дія і вибір відсутні.
- Green: та сама команда — 5 тестів успішно після реалізації grid і page.
- Refactor: grid лише відображає рядки та події; стан винесено в hooks і page. Повторний focused run успішний.
- Regression: `npx nx lint admin-references-feature`, `npx nx typecheck admin-references-feature`, `npx nx typecheck-tests admin-references-feature`, `npx nx test admin-references-feature` — успішно; E2E перевірив три ширини й дві теми.

## Контрольна точка

Рядки та порожній/помилковий стани доступні в Brevi shell.
