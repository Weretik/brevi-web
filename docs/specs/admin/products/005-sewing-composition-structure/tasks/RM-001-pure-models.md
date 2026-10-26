# RM-001 — Pure sewing model responsibilities

**Covers:** AF-001; AR-001/002/004/005. **Depends on:** none. **Owner:** `admin-products-model`.

## Work

Split `model/src/sewing/sewing-articles.ts` and `sewing-composition.ts` into role-first entity/draft contracts, defaults, pure view-to-draft mapping, dirty comparison and validation. Give distinct application contracts their own files. Keep root application exports used by consumers; remove old internal forwarding files. Place tests beside the pure logic they characterize.

## Checkpoint

No React, router, HTTP or generated DTO imports in model code. Draft conversion still separates common/Article material rows and operation quantities, and preserves the original edit version. Defaults and validators have explicit owners. Record final paths and focused tests in the source audit; source and test types must pass.

**Status:** verified. Final commands and results are recorded in the [source audit](../../004-sewing-articles-and-composition/code-audit/audit.md).
