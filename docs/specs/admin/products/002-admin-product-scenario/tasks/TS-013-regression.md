# TS-013 — Наскрізна регресія та delivery

- **ID задачі:** TS-013
- **Охоплює:** SC-001–SC-010
- **Залежить від:** EN-001, TS-001, TS-002, TS-003, TS-004, TS-005, TS-006, TS-007, TS-008, TS-009, TS-010, TS-011, TS-012
- **Точні шляхи:** `apps/admin-react-e2e/src/products.spec.ts`, `docs/specs/admin/products/002-admin-product-scenario/traceability.md`, `docs/specs/admin/products/002-admin-product-scenario/checklist/delivery-readiness.md`, `docs/specs/admin/products/002-admin-product-scenario/code-audit/audit.md`
- **Рівень тестування:** E2E + перевірка

## Робота

- [x] Додати або уточнити критичні Playwright journeys: Sewing з розрахунками/чернеткою, Ppe Reference+Custom, список, підтверджена зміна типу, помилки, видалення без media delete; інші правила довести вузькими тестами.
- [x] Повторити relevant Nx lint/typecheck/typecheck-tests/test, full `admin-react-e2e`, production build, `contracts:check`, `docs:check`; перевірити 320/768/1280 px, обидві теми й фокус.
- [x] Заповнити evidence у задачах, traceability та delivery; реальний backend/media persistence перевірити за доступності або описати межу fixture tests.
- [x] Перевірити змінені файли на цілісність відповідальності; завершити `code-audit/audit.md`. Розділити незалежні ролі за наявними межами, але не невеликий цілісний файл.

## Свідчення

- Шлях/назва фокусного тесту: Повні Product journeys у Playwright плюс affected unit/component/integration suites.
- Red: окремий регресійний checkpoint не має власного Red; TS-001–TS-005 містять зафіксований Red, TS-006–TS-012 — чесно позначену відсутність Red до реалізації.
- Green: full Admin regression; npx nx test admin-products-feature — 11/11, npx nx test admin-products-data-access — 11/11, product Playwright — 6/6.
- Refactor: межі відповідальностей перевірено в code-audit/audit.md; фокусні та повні перевірки повторено.
- Regression: `ADMIN_REACT_BASE_URL=http://localhost:4319 npx nx e2e admin-react-e2e --workers=2` — 25/25; product E2E після останнього тестового уточнення — 6/6; `npx nx test admin-react` — 15/15; `npx nx build admin-react`, `npm run contracts:check`, `npm run docs:check`, product/app/E2E lint і доступні typecheck цілі — успішно. `admin-products-data-access:typecheck-tests` не існує; його library typecheck і Vitest пройшли. Build повідомляє про chunk >500 kB.

## Контрольна точка

Усі SC-001–SC-010 мають зелене evidence або явний deferred/blocker.
