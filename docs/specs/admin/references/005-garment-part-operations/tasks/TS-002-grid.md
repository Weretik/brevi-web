# TS-002 — Таблиця MUI X

- **ID задачі:** TS-002
- **Охоплює:** SC-001, SC-002, SC-004
- **Залежить від:** TS-001
- **Точні шляхи:** `libs/admin/references/feature/src/components/garment-part-operations/`, `libs/admin/references/feature/src/pages/`
- **Рівень тестування:** компонентний

## Робота

- [x] Реалізовано MUI X Data Grid з ID, елементом, назвою, хвилинами, loading/empty/error та доступними діями.
- [x] «Роботи» й «Елементи» мають спільну сторінку та URL; зайвих controls немає.
- [x] Data Grid сортує й ділить локально завантажений список; вибір зберігається для bulk.
- [x] Grid є окремим presentational component; page лише компонує взаємодії.

## Свідчення

- Фокусний тест: `garment-part-operations-page.component.test.tsx` — перевіряє рядок та активну вкладку.
- Red: до реалізації спільна сторінка містила лише «Елементи»; окремий виконуваний Red для цієї задачі не зафіксовано.
- Green: `npx nx test admin-references-feature` — 29/29.
- Refactor: вміст робіт винесено з оболонки вкладок; тести feature повторено успішно.
- Regression: `npx nx test admin-react` — 13/13; lint/typecheck/build — успішно.

## Контрольна точка

Рядки та порожній/помилковий стани доступні в Brevi shell.
