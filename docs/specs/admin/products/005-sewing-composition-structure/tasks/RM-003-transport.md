# RM-003 — Resource-specific transport and mapping

**Covers:** AF-003; AR-001/002/003/004/005. **Depends on:** RM-001 public contracts. **Owner:** `admin-products-data-access`.

## Work

Separate access, Article and composition RTK Query endpoint ownership. Move request serialization out of endpoint declarations into named mappers. Separate runtime response validation from DTO-to-application conversion for each resource. Keep generated operation types private to data-access and retain the shared Admin API/error pipeline and Product-scoped sewing invalidation.

## Checkpoint

No duplicate generated DTO definitions, HTTP clients, local server cache or schema edits. Article saves contain only Article materials and the original token; stale writes are not automatically retried. Unknown scope/parent and malformed review data are rejected. Transport/mapper tests, generated-contract provenance and source/test types provide evidence.

**Status:** verified. Final commands and results are recorded in the [source audit](../../004-sewing-articles-and-composition/code-audit/audit.md).
