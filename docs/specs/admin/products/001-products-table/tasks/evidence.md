# Товари — evidence виконання

Дата: 2026-09-28. Backend contract: `7178113572c5c0da21ba9f28db5d94f96dc8e1b6`.

Поведінкові тести були додані після першої реалізації. Тому історичний TDD Red до коду не зафіксований; нижче вказані фактичні початкові дефекти й Green/регресія, без заяви про виконаний Red. Це процесний виняток delivery checkpoint, а не неперевірена поведінка.

## EN-001

- Red/передумова: product CRUD був у backend HEAD `03ed99f`, але category/media operationId не були агреговані в OpenAPI; історичний `/api/admin/products` не відповідав runtime `/api/v1/products`.
- Green: backend commit `7178113572c5c0da21ba9f28db5d94f96dc8e1b6` містить `product-dependencies.openapi.yaml` та `$ref` в `openapi.yaml`; старий draft залишено історичним.
- Refactor: category/media dependencies відділено від product CRUD contract; `git diff --check` для backend змін пройшов перед commit.
- Regression: `npm run contracts:check` після sync/generate — успіх.

## EN-002

- Red/передумова: до sync pinned provenance вказував попередній backend SHA; поведінковий Red для generated contracts недоречний.
- Green: `npm run contracts:sync -- 'C:\Users\Віталій\RiderProjects\BreviERP' 7178113572c5c0da21ba9f28db5d94f96dc8e1b6`, `npm run contracts:generate`, `npm run contracts:check` — успіх.
- Refactor: повторно використано спільний `tools/contracts/contracts.mjs`; окремий генератор продуктів не створено. Check перевіряє product/category/media operationId.
- Regression: повторний `npm run contracts:check` — успіх, snapshot/types відтворюються з provenance.

## TS-001

- Red/передумова: до реалізації `libs/admin/products` не існувала; окремий поведінковий Red не запускався.
- Green: `npx nx test admin-products-data-access` — 9/9; перевірено paging total, empty/invalid payload, вкладені detail поля, 404, cancellation, 400 field errors і 409.
- Refactor: HTTP/error, product CRUD і category/media запити розділено між `products.http.ts`, `products.api.ts`, `product-lookups.api.ts`; після розділення й посилення nested validation повторено той самий тест — 9/9.
- Regression: `npx nx typecheck admin-products-data-access`, `npx nx lint admin-products-data-access`, `npm run contracts:check` — успіх.

## TS-002

- Red/передумова: product list route/grid був відсутній; тест до коду не запускався.
- Green: `npx nx test admin-react` — 15/15, включно з direct list route; `npx playwright test --config apps/admin-react-e2e/playwright.config.ts products.spec.ts` — перевірено серверний page/total, search reset, 320/768/1280 px та дві теми.
- Refactor: data fetch/cancellation у `use-products.ts`; сторінка тримає лише query й presentation. Повторний app test — 15/15.
- Regression: `npx nx lint admin-products-feature`, `npx nx build admin-react` — успіх; build містить окремий `products-page` chunk.

## TS-003

- Red/передумова: direct product detail route був відсутній; тест до коду не запускався.
- Green: browser journey відкрив detail напряму після reload, 404 показав «Товар не знайдено»; `npx nx e2e admin-react-e2e` — 22/22 до додавання Sewing browser case.
- Refactor: завантаження/cancellation у `use-product.ts`, detail presentation у власній page; повторний product E2E — успіх.
- Regression: app test, feature typecheck/lint і build — успіх.

## TS-004

- Red/передумова: create form була відсутня; тест до коду не запускався.
- Green: browser journey створює Ppe товар, зберігає draft після 400 та показує field error; окремий browser case створює Sewing товар і перевіряє умовний payload; `npx nx test admin-products-feature` — 2/2 для обов'язкових полів і nested draft.
- Refactor: спільну форму розділено на base/type/content секції, валідацію винесено в `model/product-draft.ts`; після розділення фокусні тести повторено.
- Regression: product E2E, feature lint/typecheck/test, contract check — успіх.

## TS-005

- Red/передумова: full replace UI була відсутня; тест до коду не запускався.
- Green: `draftFromDetail` test зберігає photos, blocks, tables і sewing fields; browser journey редагує Ppe і Sewing через direct route; API test перевіряє повний PUT payload і 400 errors.
- Refactor: ініціалізацію draft й валідацію відділено від editor interaction, спільні create/edit поля повторно використано; tests повторено.
- Regression: feature/API tests, E2E, lint/typecheck/build — успіх.

## TS-006

- Red/передумова: product delete UI була відсутня; тест до коду не запускався.
- Green: browser journey видаляє лише після confirm і повертається до списку; API test перевіряє, що 409 не стає успіхом.
- Refactor: confirm/error state живе у `product-delete-dialog.tsx`, HTTP у data-access; tests повторено.
- Regression: API test 9/9, product E2E і build — успіх.

## TS-007

- Red/передумова: меню «Товари» не мало route; перший product E2E впав через старий Vite dev server, який не бачив новий alias. На окремому порту зі свіжим сервером тест пройшов; це не продуктова помилка.
- Green: `npx nx test admin-react` — 15/15; `npx nx e2e admin-react-e2e` з `ADMIN_REACT_BASE_URL=http://localhost:4310` — 22/22 до додавання Sewing case, product suite — 4/4 після доповнення.
- Refactor: app лише компонує lazy exports; зміна порту Playwright config дозволяє ізольований запуск без втручання у наявний dev server.
- Regression: relevant lint/typecheck/tests, contracts check, production build і full `npx nx e2e admin-react-e2e` після додавання Sewing case — 23/23; після розширення Sewing edit case й nested mapper validation повторено product suite — 4/4.
