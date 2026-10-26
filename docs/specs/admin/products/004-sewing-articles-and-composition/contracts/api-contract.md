# API contract dependency

**Status:** synchronized and generated, 2026-10-25. The canonical backend repository is `https://github.com/Weretik/BreviERP.git`, pinned at `cafa6c231a114c94dd8e095fa4f6dfc6b2aa60a1`. The canonical source is `docs/sdd/contracts/catalog/sewing-composition.openapi.yaml`; its local [snapshot](../../../../../contracts/openapi/backend/catalog/sewing-composition.openapi.yaml) and [provenance](../../../../../contracts/openapi/SOURCE.json) are generated through the project workflow.

| operationId                       | Canonical backend source                                     | Pinned revision                            |
| --------------------------------- | ------------------------------------------------------------ | ------------------------------------------ |
| `listSewingArticles`              | `docs/sdd/contracts/catalog/sewing-composition.openapi.yaml` | `cafa6c231a114c94dd8e095fa4f6dfc6b2aa60a1` |
| `createSewingArticle`             | `docs/sdd/contracts/catalog/sewing-composition.openapi.yaml` | `cafa6c231a114c94dd8e095fa4f6dfc6b2aa60a1` |
| `getSewingComposition`            | `docs/sdd/contracts/catalog/sewing-composition.openapi.yaml` | `cafa6c231a114c94dd8e095fa4f6dfc6b2aa60a1` |
| `replaceSewingComposition`        | `docs/sdd/contracts/catalog/sewing-composition.openapi.yaml` | `cafa6c231a114c94dd8e095fa4f6dfc6b2aa60a1` |
| `replaceSewingArticleComposition` | `docs/sdd/contracts/catalog/sewing-composition.openapi.yaml` | `cafa6c231a114c94dd8e095fa4f6dfc6b2aa60a1` |
| `getCurrentSession`               | `docs/sdd/contracts/identity/session.openapi.yaml`           | `cafa6c231a114c94dd8e095fa4f6dfc6b2aa60a1` |

`contracts:sync` ran from a temporary clean detached checkout of that commit to preserve pre-existing backend planning edits. `contracts:generate` and `contracts:check` passed. Generated operation types stay in data-access; application models and UI do not import DTOs. The temporary checkout was removed after synchronization. Follow the [contract workflow](../../../../../architecture/api/contract-workflow.md) for future updates.

Client mapping: Product/Article and effective composition responses become local model values in `products/data-access`; server field errors map to the appropriate Article or line input. A stale composition conflict keeps unsaved edits and offers reload; no automatic mutation retry. Article create success invalidates the Product detail/Article list; composition replacement invalidates effective composition and readiness. List reads are bounded by the backend contract.

**EN-001 completed:** backend contract accepted, synchronized and pinned. `getCurrentSession` roles determine whether the UI offers editing; backend policies remain authoritative. Cache invalidation uses a Product-scoped sewing tag for Article/composition reads, preserving the base Product cache and draft boundary. Existing Product operations `createProduct` and `replaceProduct` keep their generated contracts.

The current workspace contract snapshot advanced to backend checkpoint 4f1727e833ed8ba4717562663382ed2b79b8b337 during [pricing integration](../../006-sewing-pricing/contracts/api-contract.md). Earlier commit references above remain historical delivery evidence; use docs/contracts/openapi/SOURCE.json for the current workspace pin.
