# site-core-config

Configuration and fixed company facts of `apps/site`. See the [site architecture](../../../../docs/architecture/site/README.md).

- `siteConfig`, `createSiteConfig` — `SITE_URL`, `BREVI_API_URL`, `SITE_ENV`, `SITE_INDEXING`. The only reader of `process.env`.
- `COMPANY` — name, logo, phones, email, address, opening hours. They move to BreviERP when the admin gets a contacts form.

Tests: `npx nx test site-core-config`.
