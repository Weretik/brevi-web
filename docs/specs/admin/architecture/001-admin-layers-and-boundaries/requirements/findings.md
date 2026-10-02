# Admin layers і boundaries — findings та вимоги

## Мета та межі

- **Мета:** узгодити фактичний `libs/admin` із документованими layers,
  інструментами та module boundaries.
- **У межах:** `eslint.config.cjs`, `tsconfig.base.json`, `apps/admin-react`,
  `libs/admin/{api-contract,util,core,products,references,ui}` і пов'язані tests/docs.
- **Поза межами:** нова бізнес-поведінка, API schema changes, redesign UI,
  storefront і backend.
- **Зберігаємо:** routes, видимі стани, CRUD/media behavior, українські тексти,
  request/response semantics і public application composition.

## Architecture requirements

- **AR-001:** Nx tags/constraints реалізують `feature → ui/model/data-access`,
  `ui → model`, `data-access → model/api-client/contracts`; reverse dependencies
  заборонені — `docs/architecture/admin/domains.md`.
- **AR-002:** domain types/invariants/pure transformations мають owner у
  `<domain>/model`; generated DTO не виходять із data-access —
  `docs/standards/admin-code-organization.md`, `api-data-rules.md`.
- **AR-003:** reusable domain presentation належить `<domain>/ui`, а feature
  оркеструє routes/pages/hooks/local UI state через props/callbacks.
- **AR-004:** Admin server data, loading, errors, cache та invalidation належать
  RTK Query `baseApi` й injected endpoints; parallel direct-fetch path відсутній.
- **AR-005:** cross-library imports проходять лише через root public entry points;
  private transport/mappers/parsers не експортуються.
- **AR-006:** internals групуються за фактичними ролями; empty/dead/duplicate
  modules, aliases і stale docs видаляються.
- **AR-007:** source і tests мають executable Nx lint/typecheck/test targets;
  structural moves захищені characterization і regression evidence.

## Findings

| ID     | Severity | Порушує        | Evidence                                                                                                                          | Impact                                                          | Target state                                            |
| ------ | -------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------- |
| AF-001 | blocker  | AR-001         | `eslint.config.cjs:146-167` не має `type:model`, а `type:ui` дозволяє `type:feature`                                              | target layers неможливо коректно тегувати                       | constraints відповідають documented matrix              |
| AF-002 | high     | AR-002         | `products/data-access/src/products.model.ts` експортує generated schema aliases; pure logic лежить у `products/feature/src/model` | DTO протікають у feature/UI, model owner відсутній              | `products/model` володіє domain contracts та pure rules |
| AF-003 | high     | AR-002         | reference entities у `references/data-access/**.model.ts`, validation у `references/feature/src/model`                            | domain model розділена між transport і orchestration            | `references/model` є canonical owner                    |
| AF-004 | blocker  | AR-004         | data-access використовує `fetch`; 11 feature hooks вручну ведуть server lifecycle                                                 | cache/loading/error ownership дублюється, standards не виконані | один shared `baseApi` та injected domain endpoints      |
| AF-005 | high     | AR-003         | product editor/delete/upload і reference drawers поєднують presentation з API/editor orchestration                                | компоненти мають кілька незалежних причин зміни                 | domain `ui` отримує typed values/errors/callbacks       |
| AF-006 | high     | AR-005         | `@admin/util/api-url` веде в `src/api-url.ts`; barrels експортують HTTP helpers/mapper                                            | public boundary обходиться                                      | root entry points, private internals                    |
| AF-007 | medium   | AR-006         | `products/data-access/src` плоско змішує api/http/model/mapper/validator/tests                                                    | ownership і review складні                                      | role-based internal folders після model split           |
| AF-008 | medium   | AR-006         | `libs/admin/ui/src/lib`, `util/src/lib/references` порожні; products README описує відсутній код                                  | dead tree і stale source of truth                               | empty paths видалені, docs синхронні                    |
| AF-009 | high     | AR-007         | data-access tests виключені з lib tsconfig без `typecheck-tests`; `admin-util` має лише lint                                      | test TypeScript і config logic не мають повного gate            | executable source/test typecheck та focused tests       |
| AF-010 | medium   | AR-001, AR-006 | shared contracts/config/api client розміщені як root `api-contract`/`util`, хоча target tree визначає `admin/shared/*`            | global Admin ownership непослідовний                            | shared modules мають canonical paths і aliases          |
