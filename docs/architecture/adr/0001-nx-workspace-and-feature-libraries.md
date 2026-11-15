# ADR-0001: One Nx workspace; apps compose, libraries hold the features

**Status:** accepted
**Decision date:** 2026-11-15 (recorded from the current workspace; folder axiom codified on 2026-11-14)
**Owners:** product owner, frontend
**Applications:** all: Admin «Цех» (React), the unfinished Storefront (Angular, not deployed) and the new public Site (Next.js)

## Context

Brevi has several clients of one backend. They share the API contract, the theme tokens, the HTTP transport rules and much of the business vocabulary. One developer works on all of them. Separate repositories would copy shared code and drift; one flat `src/` per app would mix features and grow folders without limit.

## Options

| Option                                                                                                  | Complexity  | Apps and boundaries                           | Risks                      | Evidence                       |
| ------------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------- | -------------------------- | ------------------------------ |
| A repository per app                                                                                    | low per app | shared code copied                            | drift between clients      | —                              |
| One workspace, code inside each app                                                                     | low         | no enforced boundaries                        | apps grow into one folder  | old Angular storefront         |
| One Nx workspace, apps as composition roots, libraries by app, domain and layer, tags enforce direction | medium      | `scope:*` and `type:*` tags, `depConstraints` | more projects to configure | `nx.json`, `eslint.config.cjs` |

## Decision and reason

- One Nx workspace. An app in `apps/` holds only composition: routes, providers, layout. Features live in `libs/<app>/<domain>/{model,data-access,ui,feature}` as the [code organization rules](../../standards/shared/code-organization.md) define.
- Nx tags and `depConstraints` in `@nx/enforce-module-boundaries` allow only the documented direction.
- Folders follow the six-file axiom shared with the backend: at most six production files in a folder, then split by meaning; no catch-all folders (`utils`, `helpers`, `common`), no wrapper or one-file folders. `npm run architecture:structure` enforces it in CI.

## Consequences and verification

- Simpler: a feature is found by its domain; shared code exists once; lint stops wrong imports.
- Harder: each new library needs tags and a project file; generators (`nx g`) are used to create them.
- Checked by lint (module boundaries), `architecture:structure` and the frontend code audit.
