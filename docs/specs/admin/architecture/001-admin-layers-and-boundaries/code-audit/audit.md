# Архітектурний аудит — Admin layers і boundaries

- **SDD:** `docs/specs/admin/architecture/001-admin-layers-and-boundaries/`
- **Scope:** current React Admin libraries, app composition і boundary/test configs
- **Дата:** 2026-10-01
- **Delivery status:** verified

## Baseline

- [x] Прочитано applicable architecture/standards/templates.
- [x] Перевірено current tree, projects/targets/tags, aliases, imports, API flows,
      public barrels, test configs і dirty worktree.
- [x] Approved stack підтверджено rules: MUI, RTK Query, generated OpenAPI at
      data-access boundary, Vitest/RTL/Playwright через executable Nx targets.
- [x] Findings AF-001–AF-010 записані в `requirements/findings.md`.

## EN-001 evidence

- Data-access test TypeScript тепер перевіряється окремими Nx
  `typecheck-tests`; обидві цілі passed без cache.
- `admin-util` отримав source/test typecheck і focused Vitest config test:
  2/2 tests passed.
- Baseline regression: 6/6 Admin library test targets passed без cache.
- AF-009 має статус `fixed` до повторної final verification нових projects у
  RM-010.

## Remediation evidence

- **RM-001:** type constraints і primary tags узгоджені; uncached lint перевіряє
  фактичний dependency graph.
- **RM-002:** canonical shared contracts/config/api-client створені; app має один
  provider/store і normalized error contract.
- **RM-003/RM-004:** product/reference entities, drafts, queries та pure rules
  мають окремі model owners; generated contracts лишилися на transport boundary.
- **RM-005/RM-006:** product/reference server state переведений на injected RTK
  Query endpoints із cache tags, cancellation, safe errors та invalidation.
- **RM-007/RM-008:** reusable domain presentation винесена до UI projects;
  route/query/editor orchestration лишилась у feature.
- **RM-009:** public barrels закриті, data-access згрупований за ролями,
  products/references feature згруповані за capability усередині ролей, legacy
  aliases/projects видалені, exact docs paths синхронізовані.

## Final phase audit

| Phase                | Evidence                                                                                                                 | Result |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------ |
| 00 scope/readiness   | Повний SDD scope, dirty-worktree inventory і EN baseline збережені                                                       | pass   |
| 01 tree/ownership    | `products`/`references` мають model/data-access/ui/feature; shared має contracts/config/api-client                       | pass   |
| 02 dependencies      | Nx graph: model projects без dependencies; UI → model; data-access → model/shared; feature → UI/model/data-access/shared | pass   |
| 03 tools/data        | Domain `fetch`, manual `useEffect` query lifecycle і `revision` search порожній; один RTK baseApi                        | pass   |
| 04 public boundaries | Generated contract imports є лише у data-access; legacy aliases і cross-library deep imports відсутні                    | pass   |
| 05 tests             | 12 source/test target sets і 27 browser journeys покривають preserved behavior                                           | pass   |
| 06 delivery          | contracts snapshot, docs, lint, typechecks, tests, E2E і production build пройшли                                        | pass   |

## Final verification commands

- `npx nx run-many -t lint -p <14 Admin projects> --skip-nx-cache` — pass.
- `npx nx run-many -t typecheck -p <13 Admin projects> --skip-nx-cache` — pass.
- `npx nx run-many -t typecheck-tests -p <12 test projects> --skip-nx-cache` — pass.
- `npx nx run-many -t test -p <12 test projects> --skip-nx-cache` — pass;
  `admin-references-feature` repeated after timeout calibration: 33/33.
- `npx nx run admin-react-e2e:e2e --skip-nx-cache` — 27/27.
- `npm run contracts:check` — snapshot/generated types match provenance.
- `npx nx build admin-react --configuration=production --skip-nx-cache` — pass.
- `npm run docs:check` and `npm run docs:format:check` — pass.

## Ключова матриця

| Area             | Baseline                                                 | Verified state                      | Finding/task                    |
| ---------------- | -------------------------------------------------------- | ----------------------------------- | ------------------------------- |
| Nx constraints   | model type absent; UI may depend on feature              | documented one-way matrix enforced  | AF-001 / RM-001                 |
| Products model   | generated aliases in data-access; pure rules in feature  | model owner + private DTO mapping   | AF-002 / RM-003                 |
| References model | entities in data-access; validation in feature           | canonical references/model          | AF-003 / RM-004                 |
| Server data      | fetch + manual hook lifecycle                            | shared baseApi + injected endpoints | AF-004 / RM-002, RM-005, RM-006 |
| Presentation     | API/editor orchestration mixed into components           | typed UI props/callback contracts   | AF-005 / RM-007, RM-008         |
| Public boundary  | file alias and private infrastructure exports            | root public entry points only       | AF-006 / RM-009                 |
| Internal tree    | products/references role folders mixed independent flows | capability modules inside each role | AF-007 / RM-009                 |
| Dead/stale state | empty folders and stale products README                  | removed/synchronized                | AF-008 / RM-009                 |
| Tests            | data-access tests lack test typecheck; util lint only    | executable full gates               | AF-009 / EN-001                 |
| Shared ownership | contracts/config at admin root                           | admin/shared owners                 | AF-010 / RM-002, RM-009         |

## Gate

AF-001–AF-010 verified після повторного full-scope audit. Delivery checklist і
traceability синхронізовані з останнім production-code checkpoint.
