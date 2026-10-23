# Frontend Development Rules

This is the index of stable rules. Feature specifications link to these rules
instead of copying them into task files.

## By application

- **Admin React:** [code organization](admin/admin-code-organization.md), [UI](admin/admin-ui.md), [API and data](admin/api-data-rules.md), [security](admin/security-rules.md), [architecture and modules](../architecture/admin/README.md).
- **Storefront Angular:** [UI and PrimeNG](storefront-ui.md), [architecture and modules](../architecture/storefront/README.md). Admin rules for RTK Query, MUI, and AuthSessionAdapter do not apply to Angular.

## Workflow

- [Testing rules](shared/testing-rules.md) — general risk-based level selection; React/Vitest/RTK Query and `admin-react-e2e` sections apply to Admin. Check Storefront targets in Nx and the [inventory](../architecture/frontend-inventory.md).
- [Delivery rules](shared/delivery-rules.md) — readiness, traceability, and feature completion.
- [Repository file rules](shared/repository-conventions.md) — change scope and UTF-8.
