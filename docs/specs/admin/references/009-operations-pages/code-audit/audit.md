# Аудит відповідальностей коду — операції

- **Feature:** `docs/specs/admin/references/009-operations-pages/`
- **Scope:** уся feature, включно з TS-002, TS-006 і delivery verification
- **Дата:** 2026-10-01

## Перед реалізацією

- [x] Переглянуто paired page/contents/grids/dialogs/hooks/models/data-access,
      router, exports, component/E2E tests, contract tooling і upstream OpenAPI.
- [x] Власники tab/state/API/UI/validation визначені й записані точними шляхами
      в `design/frontend.md`.
- [x] Перевірено public API та імпорти: feature залежить від application models
      data-access; transport DTO не виходять за data-access boundary.
- [x] Зафіксовано blocker: upstream `BreviERP` HEAD
      `5d97cc098ade99068d1da70ccc0f6562ec852f2c` не містить двох GET-by-ID
      operationId/controllers, тому EN-001 і залежні TS не ready.

## Історичний аудит TS-002 до зміни UX

- [x] Повторно переглянуто весь реалізований TS-002 scope, imports/public API й
      tests; blocked detail/editor/data scope повторно звірено без змін коду.
- [x] List orchestration, grid columns, browser interaction hook і MUI menu
      лишилися в наявних межах; dialog state прибрано з list contents.
- [x] Малі cohesive files залишено разом; два domain grids не об'єднано, бо
      вони мають різні колонки й domain empty states.
- [x] Після змін повторено focused tests, feature/app regression, lint,
      typecheck, paired E2E та build.

### Початкове рішення TS-002

| Область / точний шлях                                                                                                              | Ролі                                           | Початкове рішення                                                                                            | Межа                       | Test                        |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------- | --------------------------- |
| `pages/garment-parts-page.tsx`                                                                                                     | local tab і panels                             | перенести лише tab state до URL; composition лишити цілісною                                                 | page/router                | component + app integration |
| `pages/garment-{parts,part-operations}-content.tsx`                                                                                | list, dialog state, delete, alerts             | у TS-002 прибрати active dialog state й навігувати; delete lifecycle лишити в наявних hooks                  | contents/pages             | component                   |
| `components/garment-{parts,part-operations}/*-grid.tsx`                                                                            | columns, action buttons, grid                  | прибрати action columns; повторно використати shared MUI menu/hook, бо їх public callbacks однакові          | grids → shared local menu  | component                   |
| `components/reference-row-actions/reference-row-context-menu.tsx`, `hooks/reference-row-actions/use-reference-row-context-menu.ts` | MUI menu, mouse/keyboard anchor, focus restore | залишити разом як presentation + browser interaction hook; не створювати новий аналог                        | component ↔ hook           | component                   |
| `components/**/garment-*-dialog.tsx`, editor hooks                                                                                 | three modes і write form                       | не змінювати до TS-003/TS-004; видалення з list composition не означає видалення файлів до replacement pages | майбутні pages/forms/hooks | blocked                     |
| `data-access/src/{garment-parts,garment-part-operations}`                                                                          | list/write transport і mapping                 | detail reads не моделювати вручну; чекати generated GET contracts                                            | domain folders             | blocked integration         |
| `apps/admin-react/src/app/router/app-router.tsx`                                                                                   | route composition                              | child routes додаються лише з TS-003/TS-004 після TS-001                                                     | app router                 | blocked integration         |

### Результат TS-002 до зміни UX

| Шлях або область                                                  | Наявна й впроваджена відповідальність                       | Рішення та причина                                                                        | Нові шляхи й межі імпортів                       | Перевірка                           |
| ----------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------- |
| `pages/garment-parts-page.tsx`                                    | URL query та paired composition                             | залишити цілісним: один URL owner для двох взаємовиключних panels                         | —                                                | feature component + app integration |
| `pages/garment-{parts,part-operations}-content.tsx`               | list orchestration, alerts, delete, route navigation        | прибрано незалежний dialog state; operation list більше не читає editor-only lookup       | imports лише hooks/grids/data models через props | feature component/E2E               |
| `components/garment-{parts,part-operations}/*-grid.tsx`           | domain columns, selection, empty state, shared menu binding | залишити два grids через різні schema; shared browser/menu mechanics повторно використано | grid → local shared hook/component               | feature component                   |
| `hooks/reference-row-actions/use-reference-row-context-menu.ts`   | mouse/keyboard anchor і focus restore                       | залишити окремим browser interaction owner                                                | hook не залежить від domain/data-access          | mouse/keyboard component tests      |
| `components/reference-row-actions/reference-row-context-menu.tsx` | MUI Menu presentation і three actions                       | залишити shared presentation component; власний menu аналог не створювався                | generic row callbacks                            | component/E2E                       |
| detail/editor/data/router blocked scope                           | generated reads, six routes, read/editor surfaces           | не реалізовувати через list fallback або ручний DTO; чекати EN-001                        | майбутні TS-001/TS-003/TS-004                    | upstream audit + contracts check    |

### Повторний audit TS-002 до зміни UX

Повторно перевірено не лише diff, а повний ланцюг TS-002:

- `pages/garment-parts-page.tsx`, обидва list content components і public
  export feature;
- обидва domain grids, shared `ReferenceRowContextMenu`,
  `useReferenceRowContextMenu`, selection і deletion hooks;
- app router composition, component/app integration tests і paired E2E;
- imports у data-access models та MUI/MUI X без зворотної залежності з
  data-access до feature.

Структурні зміни після повторного аудиту не потрібні:

- URL parsing, tab selection і panel composition є однією відповідальністю
  paired page; винесення двох query tokens в окремий util додало б непрямий API
  без повторного споживача.
- Contents оркеструють fetch state, selection, notifications, delete lifecycle
  та navigation через готові hooks/components. Ці ролі вже мають окремих
  власників; contents лише зв'язують їх і не містять transport або validation.
- Domain grids лишаються окремими через різні schemas, columns і empty text.
  Спільними є лише browser interaction та MUI menu, які вже винесені в hook і
  presentational component.
- Context-menu hook ізольовано володіє `document.activeElement`, geometry та
  `requestAnimationFrame`; MUI component не містить browser logic. Обидва файли
  є внутрішніми для feature library й не потребують нового public export.
- Два domain deletion hooks не об'єднуються: вони існували до TS-002, мають
  різні API functions/types і майбутні conflict contracts. Generic abstraction
  торкнулася б сторонніх reference domains без нового acceptance outcome.
- Старі editor/dialog files не імпортуються list composition, але лишаються до
  blocked TS-003/TS-004, де форми мають бути перенесені на route pages. Їх
  дострокове видалення втратило б чинну write implementation.

Перевірка пошуком підтвердила, що реалізовані grids не містять `actions`
columns або локального `localeText`, а list contents не імпортують старі
view/create/edit dialogs. Нових каталогів, public APIs або dependency cycles не
додано.

Аудит виявив одну локальну прогалину в test boundary: viewport E2E для
«Елементів» спочатку монтує default-вкладку «Роботи», але не mock-ав її
endpoint. До `apps/admin-react-e2e/src/garment-parts.spec.ts` додано відсутній
route stub. Це прибрало залежність тесту від локального backend і не змінило
production code або архітектурні межі.

### Перевірка TS-002 до зміни UX

- `npx nx lint admin-references-feature` — success.
- `npx nx lint admin-react` — success, Nx cache hit.
- `npx nx lint admin-react-e2e` — success; після E2E stub зміни повторено —
  success.
- `npx nx typecheck admin-references-feature` — success.
- `npx nx typecheck admin-react` — success, Nx cache hit.
- `npx nx run admin-react:typecheck-tests` — success.
- `npx nx typecheck admin-react-e2e` — success; після E2E stub зміни повторено
  — success.
- `npx nx test admin-references-feature` — 8 files, 33 tests passed.
- `npx nx test admin-react` — 4 files, 18 tests passed, Nx cache hit.
- `npx nx e2e admin-react-e2e -- src/garment-parts.spec.ts src/garment-part-operations.spec.ts`
  — 6/6 passed після додавання hermetic route stub, без proxy-запитів feature.
- `npx nx build admin-react` — success, Nx cache hit; лишилося наявне warning
  про chunk понад 500 kB.

## Повторний code audit після переходу на MUI Drawer

Явне UX-рішення 2026-10-01 замінило заплановані child pages на Drawer. Через це
історичне рішення TS-002 про navigation і очікування EN-001 більше не є
поточною архітектурою. Перевірено весь фактично впроваджений ланцюг, а не лише
нові файли.

| Область                                                   | Поточна відповідальність                                                      | Рішення та причина                                                                                                | Перевірка                      |
| --------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `pages/garment-parts-page.tsx`                            | URL query і paired panels                                                     | лишити єдиним власником вкладки; Drawer не змінює URL                                                             | component/app/E2E              |
| `pages/garment-{parts,part-operations}-content.tsx`       | list, selection, notifications, delete й active editor descriptor             | orchestration лишається в content; transport і validation сюди не перенесено                                      | component/E2E                  |
| `components/reference-editor/reference-editor-drawer.tsx` | адаптивний MUI shell, accessible header, form submit guard і footer actions   | винести спільний shell, бо обидві сутності мають однаковий layout і lifecycle controls                            | component/E2E                  |
| `components/**/garment-*-drawer.tsx`                      | domain Paper groups, read-only values, fields і operation lookup presentation | два domain Drawer лишено окремими через різні schema та lookup; view/form разом використовують один domain draft  | component/E2E                  |
| `hooks/use-garment-*-editor.ts`                           | draft, validation, save lock, create/update і server field errors             | hooks повторно використано; mode types перейменовано з `DialogMode` на `EditorMode` відповідно до UI-neutral ролі | unit/component/typecheck       |
| operation content + `use-garment-parts.ts`                | lookup loading/error/retry                                                    | content передає typed lookup state; Drawer лише показує стан і блокує save, draft при retry не скидається         | component                      |
| grids + shared row menu hook/component                    | columns, selection, mouse/keyboard menu і focus restore                       | межі TS-002 не змінені; action columns не повернулися                                                             | component/E2E                  |
| data-access domain folders                                | list/create/update/delete transport і runtime mapping                         | нових DTO/API немає; list model достатній для row-initiated Drawer                                                | existing integration/typecheck |
| app router                                                | базова feature route                                                          | child routes не додаються, тому причина Not Found усунена в джерелі action navigation                             | app integration/E2E            |

Старі `garment-part-dialog.tsx` і `garment-part-operation-dialog.tsx` видалено:
після переходу на Drawer вони не мали імпортів і дублювали presentation. Delete
dialogs залишено, бо confirmation є окремим коротким lifecycle. Нових public
exports, dependency cycles, CSS, theme tokens або самописних аналогів MUI не
додано.

Browser regression виявив submit race під час view → edit: React міг повторно
використати кнопку, яка в межах того самого click ставала submit control.
Edit/save controls отримали різні keys і явний `type="button"`; component test
доводить, що перехід не виконує write, а Playwright підтверджує стабільний flow.

## Фінальна перевірка після structural audit

- `npx nx run-many -t lint -p admin-references-feature admin-react admin-react-e2e`
  — success.
- `npx nx run-many -t test -p admin-references-feature admin-react` — success;
  focused Drawer suite окремо — 2 files, 10/10 passed.
- `npx nx run-many -t typecheck -p admin-references-feature admin-react admin-react-e2e`
  і `npx nx run admin-react:typecheck-tests` — success.
- `npx nx e2e admin-react-e2e -- src/garment-parts.spec.ts src/garment-part-operations.spec.ts --workers=1`
  — 6/6 passed. Перший parallel run мав два infrastructure timeouts і виявив
  submit race; після fix focused journey та повний sequential run пройшли.
- Після розширення viewport test окремо перевірено Drawer bounds на
  320/768/1280 px — 1/1 passed; `admin-react-e2e` lint повторно пройшов.
- `npx nx build admin-react` — success; наявне warning про chunk понад 500 kB.

## Повторний delivery audit усієї feature

Після окремого запиту на code audit повторно прочитано не лише нові Drawer,
а весь runtime і verification ланцюг feature:

- paired page, два content orchestrators, domain grids, selection/deletion
  hooks і delete dialogs;
- shared row context menu та browser interaction hook;
- обидва editor hooks, validation models, list hooks і data-access exports;
- app router, feature/app component tests і paired Playwright specs;
- усі документи `009-operations-pages`, task statuses, traceability й delivery
  checkpoint.

### Рішення щодо відповідальностей

| Шлях або область                                                       | Рішення                                           | Причина та межа імпортів                                                                                                       |
| ---------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `components/reference-editor/reference-editor-drawer.tsx`              | створено внутрішній shared presentation component | однаково реалізує MUI Drawer shell, responsive paper, accessible header, submit guard і footer; імпортує лише React/MUI        |
| `components/garment-parts/garment-part-drawer.tsx`                     | залишено окремим domain component                 | містить тільки поля й read-only values елемента; залежить від shared shell та свого editor hook                                |
| `components/garment-part-operations/garment-part-operation-drawer.tsx` | залишено окремим domain component                 | має іншу schema, дві Paper groups і garment-parts lookup states; generic domain form створив би умовний API                    |
| `hooks/use-garment-{part,part-operation}-editor.ts`                    | залишено двома hooks                              | validation, request body, API error type і write endpoint різні; UI shell не володіє business draft/write state                |
| `pages/garment-{parts,part-operations}-content.tsx`                    | залишено orchestration boundary                   | зв'язує list, selection, notifications, delete й active editor descriptor; не містить transport mapping або validation rules   |
| domain grids + shared row menu/hook                                    | залишено чинний поділ                             | grids володіють різними columns/empty states; shared files володіють лише MUI menu і browser focus/anchor lifecycle            |
| два delete hooks/dialogs                                               | не об'єднувати                                    | API functions, result types і майбутні conflict contracts domain-specific; confirmation lifecycle незалежний від editor Drawer |
| data-access і app router                                               | структурних змін не потрібно                      | transport лишається нижнім шаром без імпорту feature; router має один базовий route, Drawer не створює route state             |

View та edit markup не винесено в окремі файли: вони невеликі, використовують
один draft і не мають незалежного lifecycle. Спільний shell не експортовано з
public API бібліотеки, бо він має два внутрішні споживачі в межах feature.
Напрям залежностей після розділення: `page → content → domain component/hook →
data-access`, а domain Drawer → shared shell; зворотних імпортів і циклів немає.

Під час повторного перегляду form controls кнопкам close/cancel/retry явно
задано `type="button"`. Це відділяє browser action lifecycle від submit і не
дозволяє lookup retry запускати validation/save. Component regression
підтверджує, що retry не додає field errors і зберігає введений draft.

### Повторна перевірка після розділення

- Prettier для трьох структурно змінених component files — success.
- `npx nx run-many -t lint -p admin-references-feature admin-react admin-react-e2e`
  — success.
- `npx nx run-many -t test -p admin-references-feature admin-react` — success.
- `npx nx e2e admin-react-e2e -- src/garment-parts.spec.ts src/garment-part-operations.spec.ts --workers=1`
  — 6/6 passed.
- `npx nx run-many -t typecheck -p admin-references-feature admin-react admin-react-e2e`
  і `npx nx run admin-react:typecheck-tests` — success.
- `npx nx build admin-react` — success; лишилося наявне warning про main chunk
  понад 500 kB.
- Після останнього form-control виправлення повторено feature lint, focused
  Drawer tests 10/10, feature typecheck і production build — success.
