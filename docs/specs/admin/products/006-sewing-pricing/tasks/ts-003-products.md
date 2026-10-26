# TS-003 — published Product consumers

Covers: SC-005. Depends on: TS-001. Paths: products feature/hooks product-list/product-detail, Product column/header, legacy Sewing detail and data-access product-detail mapper. Work: bounded batch projection, missing/error/loading states, null legacy detail, published-price display and hide obsolete fabric price bands. Test level: model/mapper and directly affected consumer tests. Checkpoint: Sewing never uses old formula values; PPE remains unchanged. Evidence: verified; see [delivery checks](../verification.md).
