# TS-002 — Gallery, search і read states

- **ID задачі:** TS-002
- **Охоплює:** SC-001–SC-003
- **Залежить від:** TS-001
- **Точні шляхи:** `libs/admin/products/feature/src/pages/media-library/media-page.tsx`,
  `src/components/media/media-gallery.tsx`, `src/hooks/media-library/use-media-library.ts`,
  `src/pages/media-library/media-page.component.test.tsx`
- **Рівень тестування:** компонентний

## Робота

- [x] Скомпонувати адаптивну MUI gallery з прев'ю/fallback, filename, status,
      loading, true-empty, no-search-results та error/retry states.
- [x] Зберігати останній успішний список під час failed refresh; скасувати read
      при unmount.
- [x] Додати доступний пошук за filename й очищення; не фільтрувати server data
      destructive mutation.
- [x] Перевірити клавіатуру, accessible names, broken image fallback і 320/768/1280
      layout у межах наявного theme.
- [x] Перевірити page/hook/gallery на незалежні ролі, розділити тільки за
      наявними межами й записати рішення в `code-audit/audit.md`.

## Свідчення

- Шлях або назва фокусного тесту: `media-page.component.test.tsx`.
- Команда Red та очікувана поведінкова помилка:
  `npx nx test admin-products-feature -- media-page` — gallery і states відсутні.
- Фактичний Red: test cases написано до повної реалізації, але перший запуск
  зупинився на некоректному icon import; валідний поведінковий Red не збережено.
- Команда Green і результат: `media-page.component.test.tsx` — 4/4, включно з
  list/error/retry/search/fallback.
- Примітка про рефакторинг: read lifecycle винесено в `use-media-library`, а
  gallery лишено presentational.
- Команда регресійної перевірки та результат:
  `npx nx test admin-products-feature` і
  `npx nx typecheck-tests admin-products-feature` — 21/21 і typecheck пройшли.

## Контрольна точка

SC-001–SC-003 доведені semantic component interactions без upload/delete.
