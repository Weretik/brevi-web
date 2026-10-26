# 004 — Sewing articles and composition editor

**Surface:** React Admin (`apps/admin-react`). **Status:** implementation checkpoint, 2026-10-25; see [implemented scope, evidence and remaining deployment gates](implementation.md). **Owner:** `admin/products`. This extends the implemented [product pages](../003-products-table-pages/README.md) and keeps their list, detail and create/edit routes. Backend dependency: Catalog SDD 002, Sewing articles and calculation composition.

An administrator can manage several sale Articles for one Sewing Product and inspect/edit shared versus Article-specific material inputs and shared operations. The initial example has model `MOD-025`, Articles `246` and `247`, distinct fabrics and shared lines. This SDD does not add a calculator, price-rule editor, quote screen, or Google Sheet connection.

## Navigation

- [Rules and scenarios](requirements.md)
- [Frontend boundaries and planned files](design/frontend.md)
- [API dependency](contracts/api-contract.md)
- [Task graph](tasks.md)
- [Traceability and readiness](traceability.md)
- [Implementation checkpoint](implementation.md)
- [Responsibility audit and remediation](code-audit/audit.md)

Current Product editor stores Sewing fabrics, accessories and operation IDs in a full Product draft and sends `PUT /api/v1/products/{id}`. The new Article/composition UI must have a separate state and save boundary so an ordinary Product edit cannot silently erase the new data. The backend's existing price tiers remain unchanged until a separate accepted pricing change.
