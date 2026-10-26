# Sewing Article calculation and published prices

Status: implemented and verified, 2026-10-25. Authorized scope: backend Pricing SDD 003 TS-005 — React Admin calculation/publication, blockers and published prices in Product cards/lists. Product identity/composition uses SDD 004. PPE pricing is a separate stage. No bulk review or real publication is performed by implementation tools.

- [Requirements and scenarios](requirements.md)
- [Frontend design](design/frontend.md)
- [API contract](contracts/api-contract.md)
- [Task graph](tasks/README.md)
- [Traceability](traceability.md)
- [Usage](USAGE.md)
- [Delivery evidence](verification.md)
- [Scoped boundary review](code-audit/audit.md)

Use existing model/data-access/ui/feature libraries. No new route, global theme or browser integration is required. Backend OpenAPI is the schema source; contract pin and provenance use the checked local backend checkpoint 4f1727e833ed8ba4717562663382ed2b79b8b337.
