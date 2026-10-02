# Аудит відповідальностей коду — тканина та фурнітура

- **Feature:** `docs/specs/admin/references/008-garment-materials-pages/`
- **Scope:** уся погоджена feature: вкладки «Фурнітура виробу» і «Тканини»,
  grids, контекстні дії, Drawer create/view/edit, deletion, data-access, router,
  tests і feature documentation.
- **Дата:** 2026-10-01

## Перевірений scope

- [x] Переглянуто page/content orchestration, domain grids, shared context menu,
      Drawer components, editor/list/deletion/supplier hooks і validation.
- [x] Переглянуто обидва data-access domains, generated contract boundary,
      public indexes, router/theme integration і наявні Nx targets.
- [x] Переглянуто component, integration та Playwright tests, task statuses,
      dependencies, traceability і delivery checkpoint.
- [x] Перевірено відсутність старих `GarmentAccessoryDialog`, `FabricDialog`
      та їхніх імпортів після переходу на Drawer.

## Розподіл відповідальностей і рішення

| Шлях або область                                                  | Поточна відповідальність                                                         | Рішення та причина                                                                                                       |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `pages/garment-accessories-page.tsx`                              | Заголовок і URL-owned `tab` query                                                | Залишити page composition цілісною; content не дублює navigation state                                                   |
| `pages/{garment-accessories-content,fabrics-page}.tsx`            | List, selection, feedback, delete і active editor descriptor                     | Залишити orchestration разом; transport mapping, validation та browser interaction винесені                              |
| `components/{garment-accessories,fabrics}/*-grid.tsx`             | Domain columns, Data Grid composition і підключення row menu                     | Залишити окремими через різні моделі `supplierName`/`providerName`; action columns відсутні                              |
| `components/reference-row-actions/reference-row-context-menu.tsx` | MUI Menu для `Перегляд`, `Змінити`, `Видалити`                                   | Один presentational component без domain state; усі row actions запускаються через правий клік або keyboard context menu |
| `hooks/reference-row-actions/use-reference-row-context-menu.ts`   | Row resolution, pointer/keyboard anchors і повернення focus                      | Browser interaction відокремлена від MUI presentation і domain grids                                                     |
| `components/reference-editor/reference-editor-drawer.tsx`         | Спільний MUI shell, responsive width, accessible header, submit/footer lifecycle | Повторно використати готовий внутрішній shell; він не імпортує domains                                                   |
| `components/garment-accessories/garment-accessory-drawer.tsx`     | Orchestration режиму, hook, shared shell і вибір details/form                    | Залишити тонким domain container; він з'єднує стан редактора з двома незалежними presentation modes                      |
| `components/garment-accessories/garment-accessory-details.tsx`    | Read-only представлення даних фурнітури                                          | Винесено окремо, бо режим перегляду не залежить від supplier loading, validation та form events                          |
| `components/garment-accessories/garment-accessory-form.tsx`       | Editable поля, field errors і supplier loading/error presentation                | Винесено окремо; компонент отримує typed values/callbacks і не володіє API або editor state                              |
| `components/fabrics/fabric-drawer.tsx`                            | Orchestration режиму, hook, shared shell і вибір details/form                    | Залишити тонким domain container; він не містить розмітку двох режимів                                                   |
| `components/fabrics/fabric-details.tsx`                           | Read-only представлення даних тканини                                            | Винесено окремо через незалежний presentation lifecycle                                                                  |
| `components/fabrics/fabric-form.tsx`                              | Editable поля, field errors і supplier loading/error presentation                | Винесено окремо; `providerName` і fabric validation contract лишаються в межах домену                                    |
| `hooks/use-{garment-accessory,fabric}-editor.ts`                  | Draft, validation, supplier lifecycle, write lock і create/update                | Залишити два hooks: request types, field error keys і endpoints різні; mode type має UI-neutral назву `EditorMode`       |
| `hooks/use-*-deletion.ts`, `components/*/*-delete-dialog.tsx`     | Domain delete state й окреме MUI confirmation                                    | Confirmation має окремий lifecycle; domain delete functions і error contracts різні                                      |
| data-access і router                                              | List/write transport та один базовий route                                       | Drawer використовує validated row model; generated DTO не виходить із data-access                                        |

Старі `garment-accessory-dialog.tsx` і `fabric-dialog.tsx` видалено як dead
presentation після підключення Drawer. Read-only і editable presentation винесені
з domain containers у чотири окремі компоненти. Спільний generic form між
тканиною та фурнітурою не створено: `supplierName`/`providerName`, field keys і
validation contracts різні. Нових CSS/theme tokens, public exports або dependency
cycles не додано. Напрям імпортів лишається
`app → feature components/hooks → data-access → contracts`.

## Контракти й відкладені задачі

- `EN-001` і залежні `TS-001`, `TS-003`, `TS-004` стосувалися GET-by-ID та
  direct detail/editor routes. Погоджений Drawer UX використовує наявні list
  rows і чинні write contracts, тому ці задачі позначені `deferred` або
  `superseded` і не блокують delivery.
- Create доступний із toolbar. Дії над конкретним рядком `Перегляд`, `Змінити`
  та `Видалити` доступні через праву кнопку миші; keyboard equivalent —
  `Shift+F10` або клавіша контекстного меню.

## TDD і браузерні свідчення

- Red: focused component suite — 2 failed / 11 passed через відсутні read-only
  Drawer sections.
- Green: focused suite — 13/13 passed після підключення двох Drawer.
- Playwright спочатку отримав stale Vite HMR overlay для щойно створених файлів;
  після зупинки reused server і чистого Nx restart — 3/3 passed.
- E2E підтверджує create error із збереженим draft, right-click
  view/edit/delete, confirmation, обидві вкладки й межі Drawer на
  320/768/1280 px у light/dark themes.

## Фінальна перевірка

- `npx nx run-many -t lint -p admin-references-feature admin-react admin-react-e2e`
  — success.
- `npx nx run-many -t test -p admin-references-feature admin-react` — success;
  focused Drawer suite — 13/13 passed.
- `npx nx e2e admin-react-e2e -- src/garment-accessories.spec.ts --workers=1`
  — 3/3 passed після clean Vite restart.
- `npx nx run-many -t typecheck -p admin-references-feature admin-react admin-react-e2e`
  і `npx nx run admin-react:typecheck-tests` — success.
- `npx nx build admin-react` — success; лишилося наявне warning про main chunk
  понад 500 kB.
- `npx prettier --check <changed feature files>` і `git diff --check` — success.

## Залишкові ризики

- Browser journey використовує mocked API; інтеграцію з live backend потрібно
  перевірити у відповідному середовищі.
- View/edit відкривають validated model з поточного list response; окреме
  server refresh-by-ID не виконується, бо такого контракту немає в Drawer scope.
- Production build зберігає наявне попередження про main chunk приблизно 923 kB.
- Після останнього розділення Drawer на details/form повторні автоматичні
  перевірки не запускалися за прямою вказівкою користувача зупинити перевірки.
