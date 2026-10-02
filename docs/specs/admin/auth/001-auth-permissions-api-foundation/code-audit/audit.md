# Архітектурний аудит — Auth, permissions і API foundation

- **Feature/SDD:** `docs/specs/admin/auth/001-auth-permissions-api-foundation/`
- **Scope:** app composition; Admin core auth/permissions/shell provider;
  shared config/api-client/contracts; affected products/references consumers
- **Дата:** 2026-10-02
- **Застосовні правила:** `docs/architecture/admin/{domains,dependencies,nx-contract,state-and-api}.md`,
  ADR-0001, `docs/architecture/api/contract-workflow.md`,
  `docs/standards/{admin-code-organization,security-rules,testing-rules}.md`
- **Delivery status:** verified

## 00. Inventory та baseline

- [x] Прочитано applicable AGENTS, architecture, standards, template/workflow.
- [x] Перевірено git status; початковий worktree був clean.
- [x] Перевірено current projects, aliases, providers, source/tests і key consumers.
- [x] Approved stack підтверджено code/docs/package evidence: RTK Query, one
      shared API, Axios per accepted ADR, Vitest/RTL/Playwright by actual targets.
- [x] Для TS-001/TS-002 повторено inventory, import search, targets і build graph.

## 01. Матриця архітектури

| Library/module              | Фактична роль і paths                                 | Потрібний owner                     | Tags                                                   | Дозволені залежності                         | Finding/task            |
| --------------------------- | ----------------------------------------------------- | ----------------------------------- | ------------------------------------------------------ | -------------------------------------------- | ----------------------- |
| `admin-shared-config`       | typed pure config + runtime binding in `src/config`   | shared typed runtime config         | `scope:admin, domain:shared, type:util`                | shared only                                  | AF-001 / TS-001         |
| `admin-shared-api-client`   | role-separated Axios/RTK/error/runtime implementation | shared API transport                | `scope:admin, domain:shared, type:api-client`          | shared config/contracts/util                 | AF-002 / TS-002         |
| `admin-core-auth`           | memory session/lifecycle/generated transport          | core auth/session                   | `scope:admin, domain:core, type:core, capability:auth` | admin shared only                            | AF-003 / EN-001, TS-003 |
| `admin-core-permissions`    | intentionally absent                                  | future feature with real consumer   | n/a                                                    | n/a                                          | AF-004 / deferred       |
| `admin-core-shell` provider | injected logout context                               | shell dependency-injection provider | existing core tags                                     | React + public types; no auth implementation | AF-005 / TS-004         |
| app composition             | config → auth init → API/shell/theme/router providers | composition root                    | `scope:admin, type:app`                                | public core/feature/shared                   | AF-006 / TS-004         |

## 02. State, API, DTO та approved tools

| Потік даних           | Фактичний шлях                                          | Approved шлях                                                   | Заборонений обхід                                  | Finding/task            |
| --------------------- | ------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------- | ----------------------- |
| domain query/mutation | feature → injected canonical RTK API → Axios base query | feature → injected canonical RTK API → Axios base query         | direct Axios/fetch, second API/store               | AF-002 / TS-002         |
| auth refresh          | generated raw session transport + memory adapter        | core/auth raw session transport → adapter → shared interceptors | interceptor-recursive refresh, manual DTO          | AF-003 / EN-001, TS-003 |
| runtime config        | app configures typed public runtime once                | one typed config owner and deterministic adapter                | multiple mutable configs/import.meta.env consumers | AF-001 / TS-001         |
| permissions           | відсутній                                               | backend-derived inputs → pure policy → first consumer           | invented roles/UI-only authorization               | AF-004 / EN-002, TS-005 |

## 03. UI та feature orchestration

- Shell provider має лише інжектувати logout action, не володіти HTTP/session.
- App залишається composition root; login UI не входить до scope.
- First permission consumer і denied UX відсутні, тому TS-005 blocked.
- Existing domain feature error UX є regression contract, а не місце для
  transport rewrite.

## 04. Public API, imports і фізична структура

- Root aliases існують для config/api-client/shell/auth; permissions свідомо відсутній.
- Shared public API зберіг `adminApi`, provider, store reset, error helpers і
  додав stable adapter/baseApi contracts без deep imports у consumers.
- Target role directories для config/api-client реалізовані; старі `src/lib`
  production files видалені.
- Порожній permissions project буде dead module і не проходить final gate.
- Під час implementation потрібен повторний import/export search.

## 05. Testing і executable tooling

- Current config/api-client/shell мають explicit lint/typecheck/typecheck-tests/test.
- Current products/references data-access мають executable integration tests.
- New auth/permissions projects повинні отримати current-style targets/config і
  перший behavioral test; source `kedr` configs не є достатнім evidence.
- App має lint/build/typecheck-tests та inferred Vitest targets; critical route
  E2E планується лише після EN-002.

## Findings і задачі

| ID     | Severity | Rule/source                     | Evidence поточного стану                                  | Необхідне виправлення                          | Task           | Depends on  | Status   | Verification                    |
| ------ | -------- | ------------------------------- | --------------------------------------------------------- | ---------------------------------------------- | -------------- | ----------- | -------- | ------------------------------- |
| AF-001 | high     | state-and-api config structure  | old config owner removed; typed config/runtime tests pass | one typed Brevi config owner                   | TS-001         | none        | verified | config tests + consumer search  |
| AF-002 | blocker  | ADR-0001, state-and-api         | Axios-backed role split and all current regressions pass  | one Axios RTK boundary with compatibility      | TS-002         | TS-001      | verified | focused + domain regression     |
| AF-003 | blocker  | security rules, API workflow    | generated operations + memory-only auth tests pass        | versioned contract + memory-only session owner | EN-001, TS-003 | none/TS-002 | verified | contract/auth integration tests |
| AF-004 | blocker  | no empty layers; security rules | source permissions folder only `.babelrc`; no consumer    | omit from delivery; separate future feature    | EN-002, TS-005 | EN-001      | verified | owner scope decision            |
| AF-005 | high     | domains/core ownership          | injected provider and component tests pass                | dependency-injected logout provider            | TS-004         | TS-003      | verified | shell component test            |
| AF-006 | high     | application composition         | deterministic auth initialization and provider wiring     | compose owners without domain logic            | TS-004         | TS-003      | verified | app integration + build         |

## Рішення про файли й компоненти

| Шлях/область                                      | Наявні ролі                          | Рішення                                     | Цільові paths/owner         | Причина                           | Evidence        |
| ------------------------------------------------- | ------------------------------------ | ------------------------------------------- | --------------------------- | --------------------------------- | --------------- |
| `shared/api-client/src/lib/admin-api.ts`          | transport, errors, RTK API, tags     | split completed                             | documented role directories | незалежні lifecycles/tests        | TS-002 tests    |
| `shared/api-client/src/lib/admin-api-provider.ts` | store/provider/reset                 | moved as cohesive role                      | `rtk-query/` API owner      | cohesive store composition        | provider test   |
| `shared/config/src/lib/api-environment.ts`        | config state + URL                   | split/adapt completed                       | `config/`, `env/`           | target architecture + testability | TS-001 tests    |
| `core/auth/src/session/*`                         | source has state/lifecycle/transport | keep separate source roles, adapt contracts | core/auth                   | correct owner, security boundary  | TS-003 tests    |
| `core/shell/src/providers/*`                      | one logout context                   | keep small/cohesive                         | shell                       | dependency injection only         | TS-004 test     |
| `core/permissions`                                | no production code                   | do not copy yet                             | determined by EN-002        | avoids empty/dead library         | EN-002 decision |

## Final gate

- [x] Усі AF-* verified.
- [x] Target tree, graph, aliases/barrels і forbidden-import searches repeated.
- [x] Focused/regression evidence recorded in tasks/traceability.
- [x] No unresolved contract/permission claims remain in delivery scope.
