# TS-001 — Тема Brevi та режими оформлення

- **ID задачі:** TS-001
- **Охоплює:** SC-001, SC-004
- **Залежить від:** EN-001
- **Точні шляхи:** `apps/admin-react/src/app/theme/brevi-palette.ts`, `apps/admin-react/src/app/theme/brevi-theme.ts`, `apps/admin-react/src/app/theme/color-mode.ts`, `apps/admin-react/src/app/providers/color-mode-provider.tsx`, `apps/admin-react/src/app/providers/app-providers.tsx`, `apps/admin-react/src/app/theme/brevi-theme.unit.test.ts`, `apps/admin-react/src/app/router/app-router.integration.test.tsx`; джерела: `apps/admin/src/styles.css`, `libs/shared/theme/src/lib/design-tokens.json`
- **Рівень тестування:** модульний + інтеграційний

## Робота

- [x] Написати тест Brevi palette/semantic colors і тест вибору
      light/dark/system, збереження та fallback, коли browser storage
      недоступний.
- [x] Створити MUI тему для React Admin за чинними Brevi tokens,
      підключити provider один раз на app boundary. Не імпортувати Angular
      theme service або `@shared/theme` у React Admin.
- [x] Перевірити читабельність тексту, фокуса й логотипа для обох схем та
      відсутність зелених Kedr brand tokens.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності.
      Розділити лише файли, що поєднують незалежні ролі або складні для
      підтримки; зберегти невеликий цілісний файл незалежно від кількості рядків.

## Свідчення

- Шлях або назва фокусного тесту: `brevi-theme.unit.test.ts`, `app-router.integration.test.tsx`.
- Команда Red: перший `npx nx test admin-core-shell` — тест вибору трьох
  режимів не знаходив кнопку теми в порожньому layout. Чисті тести palette
  були додані після створення теми, окремий Red для них не зафіксовано.
- Команда Green: `npx nx test admin-core-shell` — 3/3;
  `npx nx test admin-react` — 7/7, включно з palette, legacy `theme` key та
  недоступним storage.
- Рефакторинг: mode/storage логіка винесена у `theme/color-mode.ts`;
  повторні focused suites пройшли.
- Регресія: `npx nx e2e admin-react-e2e` — 4/4, включно з reload та
  зміною системної схеми; `npx nx build admin-react` пройшов.

## Контрольна точка

App має одну тему Brevi; вибір режиму зберігається та відновлюється без
помилки при недоступному сховищі. Значення palette простежуються до Brevi,
а не до Kedr.
