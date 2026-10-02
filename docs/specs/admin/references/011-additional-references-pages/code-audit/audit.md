# Аудит відповідальностей коду — додаткові довідники

- **Feature:** `docs/specs/admin/references/011-additional-references-pages/`
- **Scope:** уся feature: list/grid/detail/editor/delete/routes/data-access
- **Дата:** 2026-10-01

## Перед реалізацією

- [x] Переглянуто фактичні page/grid/dialog/editor hook/validation/data-access,
      router, exports, Nx targets, component/integration/unit/E2E tests і попередню
      SDD `006-additional-references`.
- [x] Власників визначено: generated OpenAPI та data-access володіють API;
      list/detail/editor/deletion hooks — станом; router — direct URLs; MUI
      grid/menu/pages — представлення; shared theme — українською locale.
- [x] Поточні змішані ролі й заплановані межі записані в
      `design/frontend.md`; фактичний контрактний blocker повторно перевірено
      на pinned SHA і актуальному backend HEAD.

## Після реалізації

- [x] Повторно переглянуто весь доступний код feature у scope: page, grid,
      dialog, hooks, validation, data-access, public API, router, theme, shared
      row-menu primitives і всі наявні unit/component/integration/E2E tests.
- [x] Поточні незалежні ролі вже розділено між feature, data-access, app router
      і theme; нових route/form/delete owners не створено, бо EN-001 blocked і
      їхні контракти відсутні.
- [x] Перевірено напрям імпортів і public API: app імпортує feature page;
      feature імпортує data-access; data-access імпортує generated contract та
      API URL util. Зворотних імпортів, дублювання стану або нових циклів не
      виявлено.
- [x] Невеликі цілісні файли залишено разом: page оркеструє list/dialog/alert,
      dialog лише відображає form, editor hook володіє draft/write state, model
      містить pure validation, data-access розділяє transport/mapping/errors.
- [x] Для кожного рішення записано причину; структурних code changes аудит не
      потребував. Focused/regression lint, tests, typecheck та build повторено.

## Результат аудиту

| Шлях або область                                                                                      | Наявна й впроваджена відповідальність                                | Рішення та причина                                                                                                                       | Нові шляхи й межі імпортів                   | Перевірка                  |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | -------------------------- |
| `libs/admin/references/feature/src/pages/additional-references/additional-references-page.tsx`        | List orchestration, edit-dialog state і saved alert                  | Після EN-001 залишити тут list/reload/notification; direct route state винести до окремих pages/hooks, бо він має незалежний lifecycle   | feature pages → hooks/components/data-access | component                  |
| `libs/admin/references/feature/src/components/additional-references/additional-references-grid.tsx`   | Columns, local empty text та inline edit action                      | Замінити action column на наявні shared MUI `ReferenceRowContextMenu` і `useReferenceRowContextMenu`; не створювати новий menu primitive | grid → shared feature menu/hook              | component                  |
| `libs/admin/references/feature/src/components/additional-references/additional-reference-dialog.tsx`  | Edit-only form і modal layout                                        | Після EN-001 перетворити на shared form structure, а create/edit route orchestration тримати в pages; form fields мають бути спільними   | pages → form → editor hook/data-access       | component/unit             |
| `libs/admin/references/feature/src/hooks/additional-references/use-additional-reference-editor.ts`    | Draft, validation, update write і server errors                      | Розширювати mode-specific create/update лише з generated contract; write lock і draft preservation лишити в hook                         | hook → validation/data-access                | component/unit             |
| `libs/admin/references/model/src/validators/additional-references/additional-reference-validation.ts` | Pure update-field rules та units                                     | Залишити цілісним; змінювати лише якщо create schema задасть інші правила                                                                | hooks/components → model                     | unit                       |
| `libs/admin/references/data-access/src/additional-references/`                                        | Typed list/update transport, runtime list mapping, normalized errors | Після EN-001 додати generated detail/create/delete types і вузькі runtime mappers; ручні DTO заборонені                                  | feature → data-access → api-contract/util    | integration/unit           |
| `apps/admin-react/src/app/router/app-router.tsx`                                                      | App route composition                                                | Додати три routes лише разом із готовими exported pages, щоб не створити dead routes                                                     | app → feature public API                     | integration                |
| `apps/admin-react/src/app/theme/brevi-theme.ts`                                                       | Shared Material UI/MUI X Ukrainian locale                            | Залишити shared owner; feature зберігає лише domain-specific empty text                                                                  | app theme → MUI locale packages              | theme unit/app integration |
| Shared `ReferenceRowContextMenu` і `useReferenceRowContextMenu`                                       | MUI menu presentation та mouse/keyboard/focus adapter                | Залишити окремими й повторно використати після EN-001; menu не володіє navigation/delete API, hook не знає domain fields                 | domain grid → shared menu/hook               | reference component tests  |
| Additional-reference component/model/data-access/E2E tests                                            | Update-only UI, validation, runtime mapping і browser regression     | Залишити на найвужчих наявних рівнях; не переписувати під blocked acceptance до появи contracts                                          | tests → public UI/API contracts              | Nx test/E2E                |

## Передреалізаційний висновок

Структурних змін до коду до розблокування EN-001 не потрібно. Backend OpenAPI
на pinned commit `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea` і на актуальному
`origin/master` `5d97cc098ade99068d1da70ccc0f6562ec852f2c` не містить
`getAdditionalReferenceById`, `createAdditionalReference` або
`deleteAdditionalReference`. Через це заплановані межі detail/create/delete не
можна реалізувати чи остаточно аудіювати без ручних контрактних припущень.

## Підсумок повторного аудиту

Аудит не вніс code changes: у поточному update-only scope немає змішаних
відповідальностей, які виправдовують новий файл, component, hook, каталог або
public export. Заплановане розділення detail/create/edit/delete стане потрібним
лише після versioned EN-001; виконувати його зараз означало б створити dead
boundaries навколо невідомих transport і state contracts.

## Повторна перевірка — 2026-10-01

- `npx nx run-many -t lint -p admin-references-data-access,admin-references-feature,admin-react,admin-react-e2e --skip-nx-cache`
  — 4/4 targets passed.
- `npx nx run-many -t test -p admin-references-data-access,admin-references-feature --skip-nx-cache`
  — 2/2 targets passed.
- `npx nx test admin-react --skip-nx-cache -- src/app/theme/brevi-theme.unit.test.ts src/app/router/app-router.integration.test.tsx`
  — 2 files, 14/14 tests passed.
- `npx nx run admin-react-e2e:e2e-ci--src/additional-references.spec.ts --skip-nx-cache`
  — 2/2 Chromium tests passed at current update-only boundary.
- `npx nx run-many -t typecheck -p admin-references-data-access,admin-references-feature,admin-react,admin-react-e2e --skip-nx-cache`
  — 4/4 targets passed.
- `npx nx run admin-references-feature:typecheck-tests --skip-nx-cache` і
  `npx nx run admin-react:typecheck-tests --skip-nx-cache` — passed.
- `npm run contracts:check` — snapshot і generated types відповідають pinned
  provenance.
- `npx nx build admin-react --skip-nx-cache` — production build passed. Vite
  повторив загальне попередження про chunk понад 500 kB; аудит code changes не
  вносив і причиною попередження не є.
