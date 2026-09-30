# TS-002 — Таблиця MUI X

- **ID задачі:** TS-002
- **Охоплює:** SC-001, SC-002, SC-004
- **Залежить від:** TS-001
- **Точні шляхи:** `libs/admin/references/feature/src/components/suppliers/`, `libs/admin/references/feature/src/pages/`
- **Рівень тестування:** компонентний

## Робота

- [x] Реалізовано Community Data Grid з підтвердженими колонками, loading/empty/error, row actions.
- [x] Сторінка містить одну таблицю й тільки діючі controls.
- [x] Client-only sorting/pagination й controlled selection; browser перевірено на 320/768/1280 px.
- [x] Grid лишається presentation у feature, API — у data-access.

## Свідчення

- Фокусний тест: `libs/admin/references/feature/src/pages/suppliers-page.component.test.tsx`.
- Red: `npx nx test admin-references-feature` — не знайдено завантажений рядок «Атлас» (1 failed).
- Green: `npx nx test admin-references-feature` — таблиця й дії доступні.
- Refactor: HTTP state винесено в `hooks/use-suppliers.ts`; повторний suite пройшов.
- Regression: `npx nx lint admin-references-feature`, `npx nx typecheck admin-references-feature`, `npx nx e2e admin-react-e2e` — успішно.

## Контрольна точка

Рядки та порожній/помилковий стани доступні в Brevi shell.
