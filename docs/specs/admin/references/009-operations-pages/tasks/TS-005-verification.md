# TS-005 — Перевірка операцій

- **ID задачі:** TS-005
- **Статус:** completed
- **Охоплює:** SC-001–SC-008
- **Залежить від:** TS-002, TS-006
- **Точні шляхи:** affected component tests,
  `apps/admin-react-e2e/src/{garment-parts,garment-part-operations}.spec.ts`, audit
- **Рівень тестування:** E2E/verification

## Робота

- [x] Перевірити journeys обох вкладок, Drawer modes і lookup failure.
- [x] Перевірити locale, mouse/keyboard, themes, 320/768/1280 px.
- [x] Завершити audit, traceability, delivery checklist.
- [x] Запустити affected lint/typecheck/test/E2E/build.
- [x] Повторити після structural changes.

## Свідчення

- Focused component: 2 files, 10/10 passed; lookup retry зберігає draft.
- Feature/app suites: passed.
- Paired Playwright: 6/6 passed з `--workers=1`; view/edit Drawer, URL,
  keyboard/mouse, delete, themes і Drawer bounds на 320/768/1280 px.
- Lint: `admin-references-feature`, `admin-react`, `admin-react-e2e` passed.
- Typecheck: ті самі три projects і `admin-react:typecheck-tests` passed.
- Production build `admin-react` passed; наявний chunk-size warning лишився.

## Контрольна точка

Усі SC мають evidence для MUI Drawer view/create/edit.
