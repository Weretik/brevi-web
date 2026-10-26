# RM-005 — Application routing responsibilities

**Covers:** AF-006; AR-001/002/003/005. **Depends on:** none. **Owner:** `apps/admin-react`.

## Work

Separate route definitions, shared layout presentation, data-router construction and RouterProvider lifecycle. AppProviders remains API/session/theme composition. Keep domain routes behind their public exports, the same paths/fallback/navigation, lazy page boundaries and the data router required for draft blocking.

## Checkpoint

One active default browser history subscription; tests can inject isolated router instances. Existing root route/provider regression passes with the known lazy-import timeout for that invocation. Check only changed routing files with ESLint and the app TypeScript boundary. Record paths/results in the source audit.

**Status:** verified. Final commands and results are recorded in the [source audit](../../004-sewing-articles-and-composition/code-audit/audit.md).
