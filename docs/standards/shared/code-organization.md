# Frontend code organization rules

**Applies to:** `apps/admin-react`, `apps/site` and `libs/{admin,site}/**`. The Angular storefront (`apps/storefront`, `libs/storefront`) is frozen; see [Frozen applications](#frozen-applications).
**Checked by:** Nx tags and `depConstraints` in `@nx/enforce-module-boundaries` (`eslint.config.cjs`); the `no-restricted-imports` block in `eslint.config.cjs` that keeps the router out of Admin `ui` libraries; `npm run architecture:structure` (structure check, in CI); code audit.

This standard fixes where code lives inside a domain library. The module maps list what exists; this file is the rule for new and changed code. Project specifics and known deviations per application are in [Admin](../admin/admin-code-organization.md) and [Site](../site/site-code-organization.md). Keep the role names exactly, so every domain reads the same way. Remove rows for layers or roles the application does not use. Kedr and Brevi use this text verbatim with `<scope>` = `admin`, `mobile`, or `site`; only the project specifics and known deviations differ.

## Libraries and dependencies

- Place domain code in `libs/<scope>/<domain>/{model,data-access,ui,feature}`. Do not create empty libraries in advance, but once a responsibility exists, give it its layer: domain types and invariants in `model`, transport and cache in `data-access`, reusable domain presentation in `ui`, and orchestration in `feature`.
- `model` contains pure TypeScript types, constants, queries, defaults, and invariants; it does not depend on React, HTTP, the router, or browser APIs.
- `data-access` owns endpoints, private DTO adapters, runtime validation, mappers, and RTK Query hooks; it contains no JSX, router, or feature-local state.
- `ui` contains presentational components, forms, tables, dialogs, and feedback states; it does not call APIs or import the router.
- `feature` orchestrates routes, pages, hooks, and local UI state; it passes domain data and callbacks to `ui`.
- Between libraries, import only through aliases and the public `src/index.ts`; deep imports and aliases directly to internal files are prohibited. An additional entry point is allowed only as a separate documented public contract with its own boundary check, not as a way around the root `index.ts`.
- Public APIs export only consumer contracts. Do not export transport helpers, private DTO adapters, response parsers, or internal mappers.
- Nx tags and `depConstraints` must enforce the same dependency direction as the documentation. A layer is not considered established until lint actually allows valid dependencies and blocks reverse dependencies.

## Role folders

Inside `src/`, group files by role first and use only the names below, so every domain reads the same way. A new role name needs a recorded decision in this file before use.

| Library       | Role folders                                                                                                                                                                                                                                                                                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-access` | `api/` endpoints and hooks · `contracts/` private adapters over generated DTOs · `validators/` runtime response and request validation · `mappers/` validated DTO <-> domain · `models/` technical request/cache types · `cache/` optimistic updates and cache patches · `errors/` API error -> domain error · `testing/` fixtures and request mocks                               |
| `model`       | `entities/` domain types with their constants · `queries/` query parameters, defaults, invariants · `mappers/` pure domain transformations · `validators/` pure domain and form rules · `forms/` form values, defaults, form <-> domain mapping                                                                                                                                    |
| `ui`          | `components/` · `tables/` (with `cells/`, `toolbar/`) · `forms/` · `dialogs/` · `panels/` right-side view and edit panels · `details/` read-only cards and sections of a detail page · `feedback/` loading, empty, error, and notice states · `hooks/` presentation-only hooks                                                                                                     |
| `feature`     | `<domain>.routes.tsx` · `pages/` · `components/` connected blocks that a page composes · `dialogs/` feature-only dialogs · `hooks/` controllers: queries, mutations, and the state of one page or block · `state/` reducers and URL or persisted client state · `model/` feature-local pure logic such as URL params and view models · `errors/` user-facing messages · `testing/` |
| `shared/ui`   | Component-library categories: `layout/`, `feedback/`, `inputs/`, `data-display/`, `navigation/`; a cross-domain concept used by two or more domains (for example `slug/` or `user/`) may have its own folder                                                                                                                                                                       |

### Public site libraries (Next.js)

A public site library keeps the generator's `src/lib/` level. The library name already says its role (`model`, `data-access`, `ui`, `seo`, `feature`), so inside `src/lib/` the folders are:

| Library       | Folders inside `src/lib/`                                                                                                                                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-access` | `loaders/` cached server reads (`'use cache'`, cache tags) · `requests/` uncached calls and Server Functions · `contracts/` private adapters over generated DTOs · `validators/` · `mappers/` · `testing/`; one `cache-tags.ts` may stay at the top |
| `model`       | `entities/` · `paths/` URL building and parsing · `queries/` listing and filter parameters · `mappers/` pure transformations · `copy/` localized dictionaries and texts, one subfolder per page when a library serves several pages                 |
| `seo`         | `metadata/` · `json-ld/`; one subfolder per page inside each when a library serves several pages                                                                                                                                                    |
| `ui`          | One folder per page block or section (`hero/`, `listing/`, `contacts/`) · `i18n/` UI copy                                                                                                                                                           |
| `feature`     | One folder per page (`category/`, `contacts/`) · `routing/` static params and route helpers · `sitemap/`                                                                                                                                            |

A library that serves one page and has at most eight production files may keep them directly in `src/lib/`. Otherwise no production file sits directly in `src/lib/`.

## Nesting and size

- Create a role folder when the role exists, even for one file.
- Inside a role folder, add a capability subfolder (`components/quote-editor/`, `hooks/sewing-pricing/`) when it would hold two or more files or when the folder mixes independent flows. The order is always role first, then capability; never `src/<capability>/<role>/` or a capability folder directly under `src/`.
- A large component with its own subcomponents gets its own folder inside `components/`.
- A role or capability folder with eight or more production files is a required signal to record a `split/keep` decision in the code audit.
- Keep each test next to its production file at the same level.

```text
libs/<scope>/<domain>/feature/src/
├── <domain>.routes.tsx
├── pages/
│   ├── <capability-a>/
│   │   ├── <page>.tsx
│   │   └── <page>.spec.tsx
│   └── <capability-b>/
├── components/
│   └── <capability-a>/
├── hooks/
│   └── <capability-a>/
├── model/
├── state/
└── index.ts
```

## One responsibility per file

Every component, hook, and file has one reason to change. Any one of these signals requires a split, or a `keep` decision with a reason in the known deviations:

| Signal                                                                                                                              | Split into                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| A component calls two or more query or mutation hooks and also renders more than one independent block (panel, table, dialog, form) | A controller hook in `feature/hooks/use-<capability>.ts` that owns the data and actions, and a component that only renders |
| A component has more than three `useState` or more than one `useEffect`                                                             | A controller hook, or a reducer in `state/` for related transitions                                                        |
| A component switches between three or more panels, dialogs, or modes                                                                | One component per panel or mode; the parent only picks which one is open                                                   |
| Pure logic (filtering, sorting, grouping, merging pages, building trees, formatting) inside a component or hook body                | A pure function in `model/` (or feature `model/`) with its own unit test                                                   |
| A file defines more than one exported component, or a private component longer than about 20 lines                                  | One file per component, in a capability subfolder                                                                          |
| A component file over 150 lines, or a hook or model file over 200 lines (not counting a style object or a static copy dictionary)   | Split by the signals above; size alone is a prompt to look, not a reason to cut a cohesive file                            |

A page or screen composes: it reads route parameters, calls one controller hook, and passes data and callbacks to blocks. It contains no fetching, mapping, or business rules itself.

## Tests

- Write the test first. Add the smallest failing spec for the new or changed behavior, see it fail for the right reason, then write the production code (Red → Green → Refactor). A refactor that moves or splits code keeps the existing tests green and adds a spec for every new pure function or controller hook it creates.
- Each test sits next to its production file and has the same name with the project's test suffix (for example `.spec.ts`/`.spec.tsx` or `.unit.test.ts`).
- Minimum coverage by role: every `model` mapper, validator, and query helper, every `data-access` validator and mapper, every reducer or store, and every controller hook has a unit or focused test. Every page or screen has a component test for its main scenario and its error state. A `ui` component with its own interaction (input, toggle, selection) has a component test.
- A library that has production logic and no test at all is an audit finding.
- Every project with a test target is run by CI: test scripts select projects by pattern (`admin,admin-*`, `site-*`) or Nx tags, never by a hand-written list, and a CI step fails when a project with a test target is not selected.
- On a pull request, CI runs test, lint, and typecheck only for the projects the change affects (`nx affected` against the default branch, base and head from `nrwl/nx-set-shas`); the push to the default branch, or a separate script, runs everything. Locally, run only the focused tests of the changed projects.

## Application folder

`apps/<app>/src/app/` is the composition root and holds only: `providers/`, `router/` (the route table, guards, and lazy imports of each domain's `<domain>.routes.tsx`; `router/navigation/` for the menu configuration), `theme/`, `store.ts`, `services/` (app-wide services such as error reporting), `notifications/`, and `slots/` (components and hooks the app injects into a feature to connect two domains, for example a customer picker for orders or the staff list for work tasks). Domain screens, forms, and data hooks live in libraries, not in the app. When `router/` reaches eight files, split the route table by area (`router/catalog.tsx`, `router/content.tsx`). A Next.js app keeps only thin route files under `src/app/`.

## Frozen applications

An application that is being replaced is frozen: it gets bug fixes only, no new features and no structural refactoring. List it once in the known deviations with the replacement and the removal plan, and do not copy its layout into new code.

## Structure check

A script ([`tools/architecture/check-structure.mjs`](../../../tools/architecture/check-structure.mjs), with [its own tests](../../../tools/architecture/check-structure.spec.mjs); `npm run architecture:structure`) runs in CI next to the boundary check. It fails on a forbidden folder or file name, a folder outside the role list, a folder with eight or more production files, a production file directly in `src/lib/` of a site library with more than eight production files, a file over the line limit, a component with more than three `useState` or more than one `useEffect`, a library with production logic and no spec, and an application folder entry outside the composition list. Existing violations live in [the baseline](../../../tools/architecture/structure-baseline.json), which mirrors the known deviations table; a new violation fails the build, and fixing one removes its baseline line.

## Forbidden names and where the code goes

Do not create catch-all folders or files named `utils`, `helpers`, `common`, `misc`, `shared` (inside a domain), `types`, or `constants`.

| Code                                          | Place                                                                                    |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Status lists, limits, enums                   | `model/src/entities/` next to the type they describe                                     |
| Pure calculation or formatting for one domain | `model/src/mappers/` or `model/src/queries/`                                             |
| Form validation rules                         | `model/src/validators/`                                                                  |
| API response validation                       | `data-access/src/validators/`; mappers receive already validated data                    |
| Types                                         | Next to their owner: `entities/`, `contracts/`, `models/`, or the component file         |
| Pure helpers used by two or more domains      | `libs/<scope>/shared/util` (an Nx `util` library), only after the second consumer exists |

## State

- Server data, loading, and API errors belong to the application's data layer (RTK Query in a React admin, cached server loaders in a Next.js site); do not duplicate them in a reducer or store.
- Keep simple feature-local state in component state; create a reducer only for related transitions or shared feature state.
- Do not perform HTTP requests or hide business rules in JSX.

## Validation and server errors

- The backend validates every request and is the source of truth. Frontend validation in `model/src/validators/` only helps the person fill a form faster; it never replaces server validation, and every form still shows the errors the server returns.
- The backend returns errors as ProblemDetails (RFC 9457). Validation errors are in `errors`, keyed by field name, with messages written for the person that do not repeat the field name (for example «Заповніть це поле.»). One parser, in the shared API client's `errors/` (or `data-access/src/errors/` when a library calls the API on its own), turns the body into one error with a general message and messages by field; a form shows each field message under its field as it is, and the general message above its actions. Do not parse error bodies anywhere else.
- If the backend still returns another error shape, name it in the application specifics; that parser reads both shapes, so moving the backend to ProblemDetails changes only that parser.

## Pages, routes, and links

- A page is an orchestrator; separate toolbars, tables, complex cells, and feature-only dialogs when they have independent responsibilities.
- Reusable dialogs and forms belong in `ui` and receive values, errors, and callbacks through props.
- `ui` and `shared/ui` never import the router. Links use `href` (or a path passed as a prop); the application registers one router-aware link component in the MUI theme (`MuiLink` `component` and `MuiButtonBase` `LinkComponent`). Navigation after an action is a callback from `feature`.
- Do not change routes, guards, the global store, or theme without explicit feature scope.
