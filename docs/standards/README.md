# Frontend Development Rules

This is the index of stable rules. Feature specifications link to these rules
instead of copying them into task files.

## By application

- **All React and Next.js code:** [code organization](shared/code-organization.md) — libraries, role folders, one responsibility per file, tests first, forbidden names, validation and server errors; the structure check `npm run architecture:structure` runs in CI.
- **Admin React:** [design system «Цех»](admin/design-system.md) (required for new features), [Admin code rules and known deviations](admin/admin-code-organization.md), [UI](admin/admin-ui.md), [API and data](admin/api-data-rules.md), [security](admin/security-rules.md), [«Права доступу» in every feature](admin/access-rights.md), [architecture and modules](../architecture/admin/README.md).
- **Storefront Angular:** [UI and PrimeNG](storefront-ui.md), [architecture and modules](../architecture/storefront/README.md). Admin rules for RTK Query, MUI, and AuthSessionAdapter do not apply to Angular.
- **Site Next.js (public site, built page by page):** [design system «Строчка»](site/design-system.md), [SEO rules](site/seo-rules.md), [Site code rules and known deviations](site/site-code-organization.md), [architecture](../architecture/site/README.md).

## Workflow

- [Testing rules](shared/testing-rules.md) — general risk-based level selection; React/Vitest/RTK Query and `admin-react-e2e` sections apply to Admin. Check Storefront targets in Nx and the [inventory](../architecture/frontend-inventory.md).
- [Delivery rules](shared/delivery-rules.md) — readiness, traceability, and feature completion.
- [Repository file rules](shared/repository-conventions.md) — change scope and UTF-8.
