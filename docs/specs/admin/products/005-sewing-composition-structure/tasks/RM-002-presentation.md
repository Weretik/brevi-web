# RM-002 — Article and composition presentation

**Covers:** AF-002; AR-001/002/003/004/005. **Depends on:** RM-001 public contracts. **Owner:** `admin-products-ui`.

## Work

Separate Article listing from its creation form. Separate composition form assembly, material sections/rows, operation sections/rows, readiness and action presentation. Use role-first `components/<capability>` and `forms/<capability>` directories; keep props/value updates explicit. Pure validation belongs to model rules or a named boundary validator, not buried in JSX. Do not move APIs or navigation into UI.

## Checkpoint

Ukrainian labels, unknown references, standard/manual minutes, unit selection, review invalidation, field errors, keyboard semantics and read-only/saving behavior remain observable. Existing UI imports work through the public barrel. Colocated component tests and source/test types pass on the final layout.

**Status:** verified. Final commands and results are recorded in the [source audit](../../004-sewing-articles-and-composition/code-audit/audit.md).
