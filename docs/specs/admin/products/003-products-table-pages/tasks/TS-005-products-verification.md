# TS-005 — Перевірка сценарію товарів

- **ID задачі:** TS-005
- **Статус:** completed
- **Охоплює:** SC-001–SC-008
- **Залежить від:** TS-002, TS-003, TS-004
- **Точні шляхи:** `apps/admin-react-e2e/src/products.spec.ts`, affected tests,
  `code-audit/audit.md`
- **Рівень тестування:** E2E, перевірка

## Робота

- [x] Перевірити list → context detail → edit → save → detail і delete confirm.
- [x] Перевірити direct URL/reload, українські меню, 320/768/1280 px та обидві теми.
- [x] Завершити code audit, traceability й delivery checklist.
- [x] Виконати contracts check, affected lint/typecheck/test і `admin-react` build.
- [x] Після потрібного розділення повторити focused і regression tests.

## Свідчення

- E2E: `apps/admin-react-e2e/src/products.spec.ts`.
- Red: перший E2E run мав 3 timeout failures після розширення сценарію та показав
  конфлікт локального `localeText`; 3 інші products tests проходили.
- Green: fresh-port run `ADMIN_REACT_BASE_URL=http://localhost:4319 npx nx e2e
admin-react-e2e` — 27/27, включно з 6 theme/viewport комбінаціями для всіх
  list/detail/create/edit routes.
- Refactor: прибрано локальний locale override, стабілізовано продуктовий describe
  timeout і повторено повний browser flow.
- Regression: contracts check; affected lint/typecheck; 45 Vitest tests; 27 E2E;
  production build — success.

## Контрольна точка

Усі SC-* мають автоматизоване або обґрунтоване ручне evidence без регресії API.
