# TS-002 — Спільний layout сторінки

- **ID задачі:** TS-002
- **Охоплює:** SC-001, SC-004, SC-005
- **Залежить від:** EN-001, TS-001
- **Точні шляхи:** `libs/admin/core/shell/src/layout/admin-layout.tsx`, `libs/admin/core/shell/src/components/admin-top-bar.tsx`, `libs/admin/core/shell/src/components/color-scheme-menu.tsx`, `libs/admin/core/shell/src/navigation/admin-navigation-drawers.tsx`, `libs/admin/core/shell/src/index.ts`, `libs/admin/core/shell/src/layout/admin-layout.component.test.tsx`, `apps/admin-react/public/assets/logo/`
- **Рівень тестування:** компонентний + ручний адаптивний

## Робота

- [x] Написати компонентний тест спільного header, logo, вибору режиму
      оформлення і content slot;
      довести, що жодне недоступне profile/notification/search control не
      показується.
- [x] Реалізувати reusable shell з top bar, доступним перемикачем теми,
      областю навігації та route
      content. Додати локальний Brevi logo asset із чинного Angular Admin;
      забезпечити читабельність на світлому й темному тлі.
- [x] Перевірити 320/768/1280 px, довгий заголовок, вертикальний scroll і
      відсутність горизонтального переповнення shell.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності.
      Розділити лише файли, що поєднують незалежні ролі або складні для
      підтримки; зберегти невеликий цілісний файл незалежно від кількості рядків.

## Свідчення

- Шлях або назва фокусного тесту: `admin-layout.component.test.tsx`.
- Команда Red: перший `npx nx test admin-core-shell` — 3/3 focused tests
  failed, бо `AdminLayout` повертав `null`.
- Команда Green: `npx nx test admin-core-shell` — 3/3.
- Рефакторинг: на 320 px довгий header скорочено до «Brevi Admin»;
  focused suite повторно пройшла.
- Регресія: `npx nx lint admin-core-shell`, `npx nx typecheck
admin-core-shell`, `npx nx build admin-react` пройшли.
- Ручна перевірка: Playwright screenshots на 320/768/1280 px у світлій
  темі та 1280 px у темній; локальний logo читається на обох тлах,
  горизонтального переповнення shell не видно. Після скорочення header
  повторно оглянуто 320 px; browser test підтвердив вертикальний scroll.

## Контрольна точка

Один layout приймає довільний route content і показує Brevi header/navigation
без вигаданих бізнес-дій; 320 px не спричиняє переповнення shell.
