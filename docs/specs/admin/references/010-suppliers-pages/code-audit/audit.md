# Аудит відповідальностей коду — постачальники

- **Feature:** `docs/specs/admin/references/010-suppliers-pages/`
- **Scope:** уся feature: supplier list/grid/detail/editor/routes/data-access
- **Дата:** 2026-10-01

## Перед реалізацією

- [x] Переглянуто фактичні supplier page/grid/dialog/hooks/validation/data-access,
      router, public exports, component/integration tests, Nx targets і попередню SDD.
- [x] Визначено власників правил, стану, API, маршрутизації, представлення й
      browser menu adapter; перевірено наявні shared row menu та MUI locale.
- [x] Поточні roles і цільові boundaries записані в `design/frontend.md`.
- [x] Підтверджено контрактний blocker: pinned OpenAPI
      `e4c1588659684f3d5174fc6dfbfd5bfbd420a6ea` не містить
      `getSupplierById`; TS-001/TS-003/TS-004/TS-005 не ready.

## Після реалізації

- [x] Повторно переглянуто весь supplier scope, imports, public API й tests,
      включно з заблокованими dialog/editor/data boundaries.
- [x] Row menu/browser adapter повторно використано через наявні shared
      component і hook; API, delete state та presentation не змішані.
- [x] Цілісні dialog/editor/delete файли збережено без передчасного split;
      причини й контрактний blocker записано нижче.
- [x] Після structural change повторено focused і full feature tests, lint,
      typecheck, shared locale test, contracts check та app build.

## Результат аудиту

| Шлях або область                                                  | Наявна й впроваджена відповідальність                   | Рішення та причина                                                                                                                                                              | Нові шляхи й межі імпортів                                                | Перевірка                                             |
| ----------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------- |
| `pages/suppliers-page.tsx`                                        | list state, dialog mode, delete, alerts, create action  | Залишено list orchestration. View/edit dialogs збережено до появи route pages, щоб TS-002 не створила not-found regression.                                                     | page імпортує grid/delete hooks; майбутні route pages мають бути окремими | 8 supplier component tests passed                     |
| `components/suppliers/suppliers-grid.tsx`                         | columns, Data Grid, row interaction, domain empty state | Action column видалено; використано shared `ReferenceRowContextMenu` і `useReferenceRowContextMenu`. Domain empty overlay лишено локальним, бо текст належить supplier feature. | grid → shared feature menu/hook; без API imports                          | mouse/keyboard/focus/selection component tests passed |
| `components/reference-row-actions/reference-row-context-menu.tsx` | MUI Menu presentation і передавання вибраного row       | Залишено окремим shared component: presentation не володіє browser events, selection або domain state і повторно використовується п'ятьма reference grids.                      | internal feature component; не експортується з library public API         | reference feature component regression                |
| `hooks/reference-row-actions/use-reference-row-context-menu.ts`   | mouse/keyboard adapter, row lookup і focus restoration  | Залишено окремим shared hook: DOM event lifecycle незалежний від MUI menu presentation і supplier domain. Подальший split не дає окремої тестованої відповідальності.           | hook залежить лише від React/browser types; без domain/API imports        | mouse/keyboard/focus tests passed                     |
| `components/suppliers/supplier-dialog.tsx`                        | view/create/edit presentation і safe-link parsing       | Не змінювати до EN-001: розділення detail/form без незалежного GET створило б недостовірний direct route.                                                                       | майбутні route pages/form/helper                                          | blocked TS-003/TS-004                                 |
| `hooks/suppliers/use-supplier-deletion.ts`                        | selection, confirmation state, delete orchestration     | Лишено цілісним: усі частини належать одному delete lifecycle; row menu не змінює selection.                                                                                    | hook → data-access                                                        | full feature suite 34/34 passed                       |
| `suppliers/*.api.ts`, mapper/model                                | list/create/update/delete transport і runtime mapping   | GET не додано припущенням; DTO type має з'явитися з generated `getSupplierById`.                                                                                                | data-access → api-contract/util                                           | `contracts:check` passed; EN-001 blocked              |
| `apps/admin-react/src/app/router/app-router.tsx`                  | app route composition                                   | Supplier child routes не додано без ready TS-003/TS-004 і landing components.                                                                                                   | app → feature public API                                                  | production build passed                               |
| `pages/suppliers-page.component.test.tsx`                         | observable list/menu/dialog/delete page contracts       | Залишено одним page-level component suite: fixtures й transport stub спільні, а тести перевіряють один public surface. Розмір файла сам по собі не виправдовує split.           | test імпортує лише public page component                                  | 8 focused tests passed                                |
| `apps/admin-react/src/app/theme/brevi-theme.ts`                   | centralized Material/Data Grid Ukrainian locale         | Лишено на app theme boundary; supplier grid не дублює system locale, а тримає лише domain-specific empty text.                                                                  | app theme → MUI locale packages; feature не імпортує app                  | theme locale unit tests passed                        |

## Перевірки після аудиту

- `npx nx lint admin-references-feature` — passed.
- `npx nx typecheck admin-references-feature` — passed.
- `npx nx typecheck-tests admin-references-feature` — passed.
- `npx nx test admin-references-feature` — 8 files, 34 tests passed.
- `npx nx test admin-react -- brevi-theme.unit.test.ts` — 4/4 passed.
- `npm run contracts:check` — passed for pinned snapshot; operationId remains absent.
- `npx nx build admin-react` — passed with existing main chunk size warning.

## Повторний code audit — 2026-10-01

- [x] Переглянуто всі наявні та впроваджені supplier files, shared row-menu
      component/hook, data-access, library public API, app route composition і
      пов'язані tests, а не лише `git diff`.
- [x] Підтверджено напрям імпортів: app → feature → data-access →
      api-contract/util; supplier code не імпортує app layer, API не викликається
      з presentation components, нових public exports немає.
- [x] Підтверджено відсутність дублювання menu state, selection state та locale:
      browser menu state належить shared hook, delete selection — supplier delete
      hook, system locale — app theme.
- [x] Нових структурних змін не потрібно: grid, empty overlay, page orchestration
      і page tests лишаються цілісними з причин у таблиці; сторонній dirty worktree
      не змінювався.
- [x] Повторні lint/typecheck/tests/build виконано без Nx cache й записано нижче.

### Повторна перевірка

- `npx nx lint admin-references-feature --skip-nx-cache` — passed.
- `npx nx lint admin-references-data-access` — passed.
- `npx nx typecheck admin-references-feature --skip-nx-cache` — passed.
- `npx nx typecheck-tests admin-references-feature --skip-nx-cache` — passed.
- `npx nx typecheck admin-references-data-access --skip-nx-cache` — passed.
- `npx nx test admin-references-feature --skip-nx-cache` — 8 files,
  34 tests passed.
- `npx nx test admin-references-data-access --skip-nx-cache` — 12 files,
  27 tests passed.
- `npx nx test admin-react -- brevi-theme.unit.test.ts --run --no-file-parallelism`
  — 1 file, 4 tests passed.
- `npm run contracts:check` — snapshot/generated consistency passed; missing
  `getSupplierById` remains the recorded EN-001 backend blocker.
- `npx nx build admin-react --skip-nx-cache` — production build passed; existing
  908.75 kB main chunk warning remains.
