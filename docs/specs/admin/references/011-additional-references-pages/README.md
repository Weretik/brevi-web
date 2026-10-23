# 011 — Additional References: Table and Separate Pages

- **Surface:** React Web
- **Status:** blocked; create/detail/delete are absent from the backend contract
- **Owner:** admin/references
- **Updated:** 2026-10-01

This SDD expands the [current update-only scenario](../006-additional-references/README.md)
into a consistent experience for all general references: a row context menu
with three actions, separate detail/create/edit pages, a Ukrainian MUI Data Grid,
and white semantic surfaces. The new create/read-by-id/delete operations cannot
be implemented until backend/OpenAPI EN-001 is complete.

The blocker was reconfirmed on 2026-10-01 against the pinned snapshot and current
backend `origin/master` `5d97cc098ade99068d1da70ccc0f6562ec852f2c`.

## Navigation

- [Requirements](requirements/overview.md)
- [Frontend design](design/frontend.md)
- [API contract](contracts/api-contract.md)
- [Traceability](traceability.md)
- [Tasks](tasks/README.md)
- [Spec readiness](checklist/spec-readiness.md)
- [Delivery readiness](checklist/delivery-readiness.md)
- [Code audit](code-audit/audit.md)
- [Usage](USAGE.md)
