# Admin layers і boundaries — target architecture

## As-is summary

| Project/area                                         | Current roles                                                  | Findings                       |
| ---------------------------------------------------- | -------------------------------------------------------------- | ------------------------------ |
| `admin-products-data-access`                         | transport, generated aliases, domain model, mapping            | AF-002, AF-004, AF-006, AF-007 |
| `admin-products-feature`                             | pages, server lifecycle, pure rules, forms/tables, API actions | AF-002, AF-004, AF-005         |
| `admin-references-data-access`                       | transport, domain entities, mapping                            | AF-003, AF-004, AF-006         |
| `admin-references-feature`                           | pages, server lifecycle, validation, forms/tables/drawers      | AF-003, AF-004, AF-005         |
| `admin-api-contract`, `admin-util`, empty `admin/ui` | generated contracts, runtime config, migration remnants        | AF-006, AF-008, AF-010         |
| ESLint/test configs                                  | incomplete type matrix and test typecheck                      | AF-001, AF-009                 |

## Target tree

```text
libs/admin/
├── core/shell/
├── shared/
│   ├── api-client/          # RTK Query baseApi і normalized base query
│   ├── contracts/           # generated OpenAPI public contract
│   └── config/              # validated public API runtime config
├── products/
│   ├── model/src/{product-list,product-editor,product-detail,product-media,product-category,sewing,ordering}/
│   ├── data-access/src/{api,contracts,mappers,validators}/
│   ├── ui/src/{product-list,product-editor,product-detail,product-content,media}/
│   └── feature/src/{pages,components,hooks,model}/<capability>/
└── references/
    ├── model/src/{entities,validators}/<capability>/
    ├── data-access/src/api/<capability>/
    ├── data-access/src/api/{shared,integration}/
    ├── data-access/src/mappers/<capability>/
    ├── ui/src/components/<capability>/
    ├── ui/src/hooks/reference-row-actions/
    └── feature/src/{pages,components,hooks}/<capability>/
```

Каталог створюється лише коли відповідна роль фактично переноситься. Порожні
placeholders після migration не залишаються.

## Dependency matrix

| Source type   | Allowed target types                                                  |
| ------------- | --------------------------------------------------------------------- |
| `model`       | `model`, `util`, framework-neutral shared                             |
| `ui`          | `ui`, `model`, `util`, framework UI shared                            |
| `api-client`  | `contracts`, `config`, `util`, framework-neutral shared               |
| `data-access` | `data-access`, `api-client`, `contracts`, `model`, `util`, shared     |
| `feature`     | `feature`, `ui`, `model`, `data-access`, `api-client`, `util`, shared |
| `core`        | explicitly composed feature/ui/model/data-access/shared contracts     |

Кожен project має один primary `type:*`; додаткові ролі використовують інші
tag dimensions. `type:ui` не залежить від `type:feature`. Cross-domain lookup
dependency products → references проходить через public reference model і
data-access contracts та записується в project graph review.
Feature використовує `api-client` лише для спільного normalized error contract
і composition/test provider; domain endpoints залишаються у data-access.

## Data flow

```text
page/feature orchestrator
  → generated RTK Query hook from domain data-access
  → shared baseApi/baseQuery
  → generated DTO at transport boundary
  → runtime validator + mapper
  → domain model
  → typed props/callbacks into domain ui
```

`fetch` допустимий лише всередині approved shared base query implementation,
якщо його використовує RTK Query. Domain endpoint files, feature hooks і UI не
створюють паралельний fetch lifecycle.

## Migration sequence

1. EN-001 фіксує behavior baseline й missing test typecheck.
2. RM-001 узгоджує rules/tags/constraints до створення нових projects.
3. RM-002 створює shared contracts/config/api-client owners і тимчасові root
   re-exports лише за потреби одного checkpoint.
4. RM-003/RM-004 переносять domain models, не змінюючи data behavior.
5. RM-005/RM-006 переводять products/references на injected RTK endpoints.
6. RM-007/RM-008 відділяють presentation `ui` від feature orchestration.
7. RM-009 закриває public APIs, нормалізує nesting і видаляє compatibility/dead
   paths; документація оновлюється до фактичного tree.
8. RM-010 виконує повний повторний audit і regression gate.

## Forbidden after remediation

- generated OpenAPI aliases як exported domain/view model;
- direct `fetch` у domain data-access endpoint, feature або UI;
- `useEffect/useState` як власний server query cache/lifecycle;
- API calls або router ownership у presentation forms/tables/dialogs;
- aliases на окремий internal source file;
- public exports private mapper/parser/transport helper;
- test files, виключені з усіх TypeScript checks;
- empty/dead migration folders і stale exact paths у docs.
