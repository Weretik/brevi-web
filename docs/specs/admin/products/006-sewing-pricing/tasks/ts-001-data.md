# TS-001 — pricing data boundary

Covers: SC-001/003/004/005. Depends on: EN-001. Paths: products model/entities and queries/sewing-pricing; data-access contracts, validators, mappers and api/sewing-pricing. Work: consumed-field validation, application mapping, RTK endpoints/cache/error normalization and pure published-price selection. Test level: mapper/model unit and endpoint integration. Checkpoint: malformed results rejected; only stored published tiers selected; no legacy fallback. Evidence: verified; see [delivery checks](../verification.md).
