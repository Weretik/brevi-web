# Архітектурний аудит коду — <назва feature>

- **Feature/SDD:** `<точний шлях>`
- **Scope:** `<усі libraries/files і залежності, які перевіряються>`
- **Дата:** YYYY-MM-DD
- **Застосовні правила:** `<точні docs paths і sections>`
- **Delivery status:** `<blocked | ready for verification | verified>`

## 00. Inventory та baseline

- [ ] Прочитано applicable `AGENTS.md`, architecture, standards, feature design,
      contracts, tasks і попередні audits.
- [ ] Перевірено git status/diff; сторонні зміни відокремлено від audit scope.
- [ ] Зібрано фактичні apps, Nx projects/targets/tags, aliases, configs,
      providers, source/test files і project graph dependencies.
- [ ] Зафіксовано approved stack для UI, state, API, routing і tests; package у
      `package.json` не прийнято як evidence без фактичного wiring.

## 01. Матриця архітектури

| Library/module | Фактична роль і paths | Потрібний layer/owner                        | Tags     | Дозволені залежності | Finding/task          |
| -------------- | --------------------- | -------------------------------------------- | -------- | -------------------- | --------------------- |
| `<project>`    | `<paths>`             | `<model/data-access/ui/feature/core/shared>` | `<tags>` | `<direction>`        | `<AF/RM/TS/EN або —>` |

- [ ] Для кожної фактичної відповідальності існує правильний owner; відсутній
      layer створюється, якщо роль уже існує, але порожні layers не додаються.
- [ ] `depConstraints` дозволяють documented direction і забороняють reverse,
      cross-scope та випадкові cross-domain dependencies.
- [ ] Project names, source roots, tags, tsconfig paths і folder nesting
      узгоджені; lint реально перевіряє цю матрицю.

## 02. State, API, DTO та approved tools

| Потік даних        | Фактичний шлях                  | Approved шлях                    | Заборонений обхід          | Finding/task |
| ------------------ | ------------------------------- | -------------------------------- | -------------------------- | ------------ |
| `<query/mutation>` | `<component → ... → transport>` | `<feature → RTK hook → baseApi>` | `<fetch/manual cache/etc>` | `<AF/RM/TS>` |

- [ ] Server data/loading/error/cache/invalidation належать approved data stack;
      немає дублювання у component state/reducer.
- [ ] Components/pages не виконують transport/API calls; feature orchestration
      передає presentation values/errors/callbacks.
- [ ] Generated request/response types залишаються на transport boundary;
      runtime validation і mapper дають domain/view model до feature/UI.
- [ ] Cancellation, normalized errors, retry, cache keys та invalidation
      відповідають contract/design і мають focused evidence.
- [ ] Пошуком imports підтверджено відсутність parallel/forbidden tools,
      наприклад direct `fetch`, Axios або власного cache поруч з RTK Query.

## 03. UI та feature orchestration

- [ ] Page/feature є тонким orchestrator; table/form/dialog/details/states мають
      presentation contracts без API/router/server-state ownership.
- [ ] Reusable domain UI знаходиться у `<domain>/ui`; domain-neutral UI має
      фактичного або погодженого другого consumer перед перенесенням у shared.
- [ ] Кожен Drawer/Dialog/Page/Form/Table перевірено на незалежні lifecycle,
      props contracts, read/edit modes, sections, menus і browser adapters.
- [ ] Business rules і validation не заховані у JSX; pure logic має model owner.
- [ ] Великі цілісні файли залишені разом лише з записаною причиною; кількість
      рядків сама по собі не є правилом split.

## 04. Public API, imports і фізична структура

Цільова схема `feature`, яку потрібно звірити з фактичним деревом:

```text
libs/admin/<domain>/feature/src/
├── pages/<module>/
│   ├── <page>.tsx
│   └── <page>.component.test.tsx
├── components/<module>/
│   ├── <component>.tsx
│   └── <component>.component.test.tsx
├── hooks/<module>/
│   ├── use-<behavior>.ts
│   └── use-<behavior>.unit.test.tsx
├── model/<module>/
├── state/<module>/
└── index.ts
```

`model` і `state` створюються лише за наявності відповідної відповідальності.

- [ ] Кожна library має кореневий `src/index.ts`; consumers використовують
      alias на public entry point без deep/file aliases.
- [ ] Public barrels не експортують private DTO, mapper, parser, HTTP helper,
      internal error implementation або feature-internal component.
- [ ] Внутрішні файли згруповані за фактичними ролями (`api`, `contracts`,
      `mappers`, `models`, `validators`, `pages`, `forms`, `tables`, `states`).
- [ ] Для кожного загального каталогу (`components`, `hooks`, `pages`,
      `collections`) зафіксовано кількість production-файлів і перелік flows;
      каталоги з `>= 8` файлами мають явне рішення `split/keep` та evidence.
- [ ] Якщо загальний каталог містить два або більше незалежних
      flows/resources, файли згруповані за capability/module всередині
      відповідного role-каталогу (`pages/<module>`, `components/<module>`,
      `hooks/<module>`); test лежить поруч із файлом свого test level.
- [ ] Немає циклів, reverse imports, дубльованих owners, порожніх/мертвих
      каталогів, aliases, exports або застарілих compatibility files.
- [ ] Документація й exact paths оновлені після moves; stale statements видалені.

## 05. Testing і executable tooling

- [ ] Для кожного project перевірено реальні lint/typecheck/typecheck-tests/test/
      build targets, config і щонайменше один executable relevant test.
- [ ] Source і tests typecheck охоплюють фактичні extensions; tests не виключені
      з усіх TypeScript checks.
- [ ] До структурних moves визначено characterization/regression safety net;
      після кожного `RM-*` повторено найвужчі affected checks.
- [ ] Module boundaries мають позитивне й негативне evidence: дозволений import
      проходить, заборонений напрям ловиться конфігурацією або fixture/check.
- [ ] Final verification включає affected lint, typecheck, tests, app build,
      contract checks і project graph inspection.

## Findings і задачі

| ID     | Severity                    | Rule/source  | Evidence поточного стану | Необхідне виправлення | Task         | Depends on   | Status | Verification     |
| ------ | --------------------------- | ------------ | ------------------------ | --------------------- | ------------ | ------------ | ------ | ---------------- |
| AF-001 | `<blocker/high/medium/low>` | `<doc:path>` | `<path:line/command>`    | `<target state>`      | `<RM/TS/EN>` | `<IDs/none>` | `open` | `<command/test>` |

Правила статусу:

- `fixed` означає, що зміна реалізована, але final regression ще не завершена;
- `verified` означає, що target state і всі визначені checks підтверджені;
- finding без task/owner не може бути `fixed` або `verified`;
- `deferred-approved` містить погодження, окрему SDD/task і доказ, що finding не
  входить до dependency chain поточного delivery.

## Рішення про файли й компоненти

| Шлях/область | Наявні ролі | Рішення                    | Цільові paths/owner | Причина | Evidence         |
| ------------ | ----------- | -------------------------- | ------------------- | ------- | ---------------- |
| `<path>`     | `<roles>`   | `<move/split/keep/delete>` | `<paths>`           | `<why>` | `<test/command>` |

Для кожного каталогу з `>= 8` production-файлами або `>= 2` незалежними flows
додайте окремий рядок. `Keep` без переліку єдиного lifecycle/reason і evidence
не проходить checkpoint.

## Final gate

- [ ] Усі in-scope `AF-*` мають статус `verified`; допустимі
      `deferred-approved` не є prerequisites поточного delivery.
- [ ] Target tree, project graph, aliases/barrels і forbidden-import searches
      повторно перевірені після останньої зміни.
- [ ] Focused/regression evidence записане у відповідних задачах і traceability.
- [ ] Відсутні неперевірені architecture claims або фрази «залишити на потім»
      без owner, task, dependency і погодженого scope.
