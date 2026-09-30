# TS-001 — Карта старого меню

- **ID задачі:** TS-001
- **Охоплює:** SC-001, SC-002
- **Залежить від:** немає
- **Точні шляхи:** `libs/admin/shell/src/lib/layout/sidebar/sidebar.ts`, `apps/admin-react/src/app/router/`, `libs/admin/core/shell/src/shell.types.ts`
- **Рівень тестування:** модульний + інтеграційний

## Робота

- [x] Зафіксувати 27 пунктів і п'ять груп із незалежними ключами, не змішуючи дубльовані назви.
- [x] Пов'язати enabled із реально зареєстрованим React route; до перенесення таблиць доступний тільки `/`.
- [x] Перевірити змінені файли реалізації на цілісність відповідальності; розділити лише незалежні ролі, зберігаючи невеликі цілісні файли.

## Свідчення

- Фокусний тест: карта груп і недоступних пунктів.
- Red: тест знаходить відсутні групи або активне посилання без маршруту.
- Green/Refactor/Regression: записати виконані `npx nx test admin-core-shell`, `npx nx test admin-react`, lint/typecheck/build і результат.

Виконано 2026-09-27:

- Red: `npx nx test admin-react -- app-router.integration.test.tsx` — 1 failure: немає кнопки «Менеджер сервісу»; три попередні тести пройшли.
- Green: та сама команда — 4/4; `navigation-config.unit.test.ts` перевіряє 5 груп, 27 ключів, дубльовані назви й активацію лише зареєстрованого URI.
- Refactor: маршрутний реєстр у `app-router.tsx` став єдиним джерелом зареєстрованих шляхів; карта меню залишилася окремою від shell. Повторний `npx nx test admin-react` — 10/10.
- Regression: `npx nx test admin-core-shell` — 4/4; `npx nx lint admin-core-shell`, `npx nx lint admin-react`, typecheck обох проєктів і tests, `npx nx build admin-react` — успішно.

Уточнення 2026-09-27: за запитом користувача прибрано позаісторичний пункт «Початок». Red: `npx nx test admin-react -- app-router.integration.test.tsx` — тест знайшов link «Початок» у меню. Green: після видалення з `createNavigation` фокусні тести — 6/6. Статичну карту перенесено до `legacy-menu.ts`, а `navigation-config.ts` залишено тільки для зіставлення з реально зареєстрованими маршрутами; `/` лишився в router.

## Контрольна точка

Карта меню повна, а недоступний пункт не поводиться як посилання.
