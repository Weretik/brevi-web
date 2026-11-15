# Workspace architecture decisions

Decisions that cover the whole frontend workspace. Decisions of one app live next to it: [Admin ADRs](../admin/adr/README.md), [Site ADRs](../site/adr/0001-nextjs-public-site.md). The backend and the whole system (C4 diagrams with these apps as containers) are in [BreviERP](https://github.com/Weretik/BreviERP/blob/master/docs/sdd/architecture/c4/README.md).

| ADR                                                | Decision                                                              | Status   |
| -------------------------------------------------- | --------------------------------------------------------------------- | -------- |
| [0001](0001-nx-workspace-and-feature-libraries.md) | One Nx workspace; apps compose, libraries hold the features           | accepted |
| [0002](0002-admin-client-only-spa.md)              | The admin is a client-only React SPA, hidden from search              | accepted |
| [0003](0003-types-from-backend-openapi.md)         | API types are generated from a pinned snapshot of the backend OpenAPI | accepted |

## Key decisions that must have an ADR

A full frontend architecture audit checks this list and reports each missing or outdated ADR as a finding.

| Area                                                             | ADR            |
| ---------------------------------------------------------------- | -------------- |
| Workspace and code organization (libraries, boundaries, folders) | workspace 0001 |
| Admin rendering, hosting and indexing                            | workspace 0002 |
| API contract and generated types                                 | workspace 0003 |
| Public site framework and rendering                              | site 0001      |
| Public site hosting                                              | site 0002      |
| Server state and HTTP transport                                  | admin 0001     |

Write a new ADR from the [ADR template](https://github.com/Weretik/obsidian/blob/main/Templates/frontend-documentation/templates/architecture/decision.template.md) in the same change that makes a lasting decision of this kind: a new app, framework, hosting, state or transport approach. No separate C4 diagrams are kept for the frontend; when an app is added or moved, update the container diagram in BreviERP.
