# Pricing operations and consumer decisions

Backend repository: https://github.com/Weretik/BreviERP.git. Canonical source: `docs/sdd/contracts/catalog/sewing-pricing.openapi.yaml`, aggregated through `docs/sdd/contracts/openapi.yaml`. Immutable backend checkpoint: `4f1727e833ed8ba4717562663382ed2b79b8b337`. Provenance is recorded in docs/contracts/openapi/SOURCE.json. Snapshot/types are generated through the existing contracts scripts, never hand-edited.

| OperationId                | Source / consumer                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| saveSewingCalculation      | docs/sdd/contracts/catalog/sewing-pricing.openapi.yaml / manager calculation                  |
| getSewingCalculation       | docs/sdd/contracts/catalog/sewing-pricing.openapi.yaml / retained breakdown                   |
| publishSewingCalculation   | docs/sdd/contracts/catalog/sewing-pricing.openapi.yaml / explicit manager publication         |
| getPublishedSewingPrice    | docs/sdd/contracts/catalog/sewing-pricing.openapi.yaml / selected Article current publication |
| getPublishedSewingProducts | docs/sdd/contracts/catalog/sewing-pricing.openapi.yaml / Product list/card batch projection   |
| getCurrentSession          | docs/sdd/contracts/identity/session.openapi.yaml / existing canRead/canManage access          |

Reads require CatalogRead; writes CanManageProducts and claim-derived backend actor. Calculation time, approval and prices are never supplied by frontend. Save has a UUID request identity retained across failures; a successful save clears that pending identity so a deliberate recalculation creates a new result. Publication is idempotent by calculation UUID. No automatic publish or write retry loop.

Validate finite consumed amounts, positive safe IDs, UUIDs/dates, breakdown readiness and three-tier completeness before mapping. Match returned Article/Product identities to the request in the workflow. Named blockers are translated to actionable Ukrainian text; raw transport/server error strings are not rendered. Saved blocked results are successful responses, not transport errors. Published 404 means no publication; other failures show retry. A publish 409 disables replaying the stale calculation and requests recalculation.

Composition-dirty gates are client UX, not server concurrency protection. Server publication revalidates all current versions. Current composition version also marks a locally stale result. Switching Article remounts its workflow; cached responses are scoped by Product/Article/calculation IDs. Readonly users inspect the published calculation.

Batch Product reads use repeated productIds and at most 100 IDs. Empty publication arrays never fall back to old Product price fields. Product/Article publication and composition cache tags refresh summary views; historical calculation caches remain immutable. Existing Product API remains compatible, with null Sewing detail accepted. No browser check or production build is required without separate authorization.

The current aggregate snapshot also includes additive PPE operations from the [PPE consumer checkpoint](../../007-ppe-pricing/contracts/api-contract.md); this Sewing delivery retains its original provenance/evidence above. Sewing operation schemas are unchanged.
