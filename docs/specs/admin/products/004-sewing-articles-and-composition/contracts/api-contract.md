# API contract dependency

**Status:** blocked on backend OpenAPI. The backend Catalog SDD 002 proposes `listSewingArticles`, `createSewingArticle`, `getSewingComposition`, `replaceSewingComposition` and `replaceSewingArticleComposition`; these are **not yet implemented or present in the versioned contract**. Exact operation IDs, methods, DTOs, errors and authentication are controlled by the backend OpenAPI at `docs/sdd/contracts/catalog/product-catalog.openapi.yaml` in the BreviERP repository.

Before frontend implementation, record the full backend commit SHA or immutable tag for every operation, sync the snapshot and generated types using the project's [contract workflow](../../../../../architecture/api/contract-workflow.md), and verify the generated operation signatures. Do not hand-write equivalent transport DTOs or guess a path from this draft.

Client mapping: Product/Article and effective composition responses become local model values in `products/data-access`; server field errors map to the appropriate Article or line input. A stale composition conflict keeps unsaved edits and offers reload; no automatic mutation retry. Article create success invalidates the Product detail/Article list; composition replacement invalidates effective composition and readiness. List reads are bounded by the backend contract.

**EN-001:** backend contract accepted, synchronized and pinned. This blocks all API-consuming frontend tasks. Current Product operations `createProduct` and `replaceProduct` remain on their existing generated contracts.
