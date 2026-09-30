# TS-003 — Створення, перегляд і редагування

- **ID задачі:** TS-003
- **Охоплює:** SC-002, SC-003
- **Залежить від:** TS-002
- **Точні шляхи:** `libs/admin/references/feature/src/components/suppliers/`, `libs/admin/references/data-access/src/suppliers/`
- **Рівень тестування:** компонентний + інтеграційний

## Робота

- [x] Створення, перегляд і редагування доступні через MUI Dialog; видалення реалізоване TS-004.
- [x] Поля і довжини звірено з OpenAPI та validators; помилки 400 показані біля полів без втрати введення. Точну перевірку номера телефону виконує backend libphonenumber.
- [x] Успішний запис оновлює список; write не повторюється автоматично.
- [x] Validation винесено в чисту функцію, форма містить тільки interaction state.

## Свідчення

- Фокусні тести: `libs/admin/references/feature/src/pages/suppliers-page.component.test.tsx` (field error, Enter, посилання у view) та browser journey у `apps/admin-react-e2e/src/admin-react.shell.spec.ts`.
- Red: `npx nx test admin-references-feature` — Enter не надсилав POST (1 з 6 failed); `npx nx test admin-references-feature -- -t 'keeps the supplier link available in view mode'` — клікабельне посилання відсутнє (1 failed). Окремий первинний Red для server field error не був записаний.
- Green: `npx nx test admin-references-feature` — 7/7; form error у Playwright зберігає введену назву.
- Refactor: validation і Dialog розділено; повторний focused suite пройшов.
- Regression: `npx nx lint admin-references-feature`, `npx nx typecheck-tests admin-references-feature`, `npx nx e2e admin-react-e2e` — успішно.

## Контрольна точка

Форма відтворює старий результат з перевіреними даними.
