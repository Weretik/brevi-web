# Calculator migration handoff — 2026-10-26

The user requested logical local commits and Git push for the completed calculator catalogue/composition/pricing work. Manual browser/UI acceptance is explicitly deferred; it is not a prerequisite for packaging the already implemented code and must not be reported as completed.

## Delivered client scope

- Independent model types and pure composition/price selectors.
- Generated canonical contract pinned to backend `0529daf910b837eb808a662695706dda4beaf833`; later local activation jobs do not change HTTP schemas.
- Runtime-validated DTO mapping and RTK Query boundaries for Articles, composition, Sewing calculation/publication and PPE input versions.
- Controlled forms/panels, independent offer/rule drafts, permission/conflict handling and current Product price integration.
- Data-router support for unsaved composition protection and retirement of old price fallback/bands.

## Verification and limits

All four Product library production TypeScript checks and `npm run contracts:check` passed before commit grouping. Repository pre-commit hooks run Prettier and ESLint for each staged group. Focused scenario evidence remains in [PPE verification](verification.md), [cutover evidence](cutover/evidence.md) and the relevant Sewing specifications. Final handoff checks are repeated only if hooks introduce substantive changes or a check fails.

No browser/E2E, visual acceptance, full suite or production deployment is claimed. Local catalogue price activation is a backend data operation, not proof that every UI scenario was manually accepted. Keep 724 blocked and 931 inactive until explicit later decisions; prices are obtained from current backend pricing endpoints, not legacy Product amounts or a live Google runtime.

The next functional migration phase is quotes/custom sewing, starting with current CRM/customer capabilities and an SDD for saved quote versions/calculation snapshots. Incomplete historical source data and actual file bytes require separate reconciliation; this handoff does not implement that phase.
