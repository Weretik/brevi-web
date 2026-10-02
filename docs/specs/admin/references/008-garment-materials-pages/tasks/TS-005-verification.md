# TS-005 — Перевірка тканини й фурнітури

- **ID задачі:** TS-005
- **Статус:** completed
- **Охоплює:** SC-001–SC-008
- **Залежить від:** TS-002, TS-006
- **Точні шляхи:** garment accessories/fabrics component tests,
  `apps/admin-react-e2e/src/garment-accessories.spec.ts`, audit/checklists
- **Рівень тестування:** E2E, перевірка

## Робота

- [x] Перевірити critical journeys обох вкладок і Drawer modes.
- [x] Перевірити mouse/keyboard menu, locale, 320/768/1280 px, обидві теми.
- [x] Завершити audit/traceability/delivery checklist.
- [x] Запустити affected lint/typecheck/test/E2E/build.
- [x] Повторити checks після потрібного розділення.

## Свідчення

- Focused component: 2 files, 13/13 passed.
- Feature/app suites: passed.
- Playwright: 3/3 passed після clean Vite restart.
- Lint feature/app/E2E, source/test typechecks і production build: passed.

## Контрольна точка

Усі сценарії обох вкладок мають evidence для MUI Drawer view/create/edit.
