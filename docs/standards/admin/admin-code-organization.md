# Admin code rules

**Applies to:** `apps/admin-react` and `libs/admin/**`.

The rules are the shared [frontend code organization rules](../shared/code-organization.md): libraries and dependencies, [role folders](../shared/code-organization.md#role-folders), [nesting and size](../shared/code-organization.md#nesting-and-size), [one responsibility per file](../shared/code-organization.md#one-responsibility-per-file), [tests](../shared/code-organization.md#tests), the [application folder](../shared/code-organization.md#application-folder), forbidden names, state, [validation and server errors](../shared/code-organization.md#validation-and-server-errors), and [pages, routes, and links](../shared/code-organization.md#pages-routes-and-links). This file adds only what is specific to Admin.

## Admin specifics

- `@admin/shared/routing` provides the router-aware link and `routerLinkComponents`. The Admin theme spreads them (`MuiLink` `component` and `MuiButtonBase` `LinkComponent`); a `MenuItem` link uses `component={Link}` with `href`.
- `no-restricted-imports` in the root `eslint.config.cjs` blocks `react-router`, `react-router-dom`, and `@admin/shared/routing` in `libs/admin/*/ui` and `libs/admin/shared/ui` (tests excepted).
- `libs/admin/shared/ui` groups components in `src/<category>/` (`access/`, `data-display/`, `inputs/`, …).
- Test files use the suffixes `*.unit.test.ts`, `*.component.test.tsx`, and `*.integration.test.ts(x)`; see the [testing rules](../shared/testing-rules.md).
- Feature `hooks/` hold controllers for RTK Query: one hook per page or block owns its queries, mutations, and panel state (for example `use-work-log.ts`, `use-sales-desk.ts`), and the component only renders.
- The application folder `apps/admin-react/src/app/` holds `app.tsx`, `providers/`, `router/` (with `router/navigation/`), `theme/`, and `slots/` for app-injected cross-domain components.
- Every new page, route, or action is wired into «Права доступу»; see the [access rights rules](access-rights.md).
- The one error parser is `libs/admin/shared/api-client/src/errors/api-error.ts`; see the [API and data rules](api-data-rules.md#validation-and-server-errors). BreviERP returns ProblemDetails, and some endpoints still return the older Ardalis list during the move; the parser reads both into the same field errors, keyed in camelCase without a `Request.` prefix.

## Known deviations

None. [The baseline](../../../tools/architecture/structure-baseline.json) is empty: every Admin file is within the line limit and every library with hand-written code has a spec (generated code such as `shared/contracts` is exempt, and `npm run contracts:check` verifies it). A new violation fails `npm run architecture:structure`; fix it in the same change, and add a `keep` row here only for content that cannot be split (a long list of required parameters or a static dictionary), with its reason.
