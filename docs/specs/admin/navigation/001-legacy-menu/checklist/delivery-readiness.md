# Готовність меню до постачання

- [x] SC-001 і SC-004 verified; TS-001–TS-004 мають evidence. SC-002 і повний SC-003 live route відкладено до table-features; механізм активації, клавіатурне розкриття, фокус і поточний disabled стан перевірені.
- [x] У меню немає дієвого пункту без React route; direct URL старої сторінки й back/forward перевірені для поточного fallback. Пряме відкриття перенесеної React-сторінки ще не застосовне.
- [x] Клавіатура, фокус, mobile drawer та обидві теми перевірені компонентними/E2E тестами й visual review. Після видалення «Початок» живого переходу з меню поки немає.
- [x] `npx nx lint admin-core-shell`, `npx nx lint admin-react`, `npx nx lint admin-react-e2e`, typecheck source/tests/E2E, `npx nx test admin-core-shell`, `npx nx test admin-react`, `npx nx build admin-react`, `npx nx e2e admin-react-e2e` пройшли.
- [x] Змінені файли перевірені на одну відповідальність; залишковий ризик: майбутні table-features мають додати маршрути в `availableRoutes` і довести SC-002 на реальних сторінках.
