# Structure check: site shell

**Date:** 2026-11-10. Short check of the files this step created, under the staged structure check in the [delivery rules](../../../../../standards/shared/delivery-rules.md). It is not the full code audit.

| Check                       | Result                                                                                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Routes are thin             | `layout.tsx`, `not-found.tsx`, `error.tsx`, `robots.ts`, `sitemap.ts` only call libraries. `[locale]/page.tsx` holds the temporary first-screen text; the home step moves it into `site-home-*`. |
| One responsibility per file | Header is split into `top-line`, `site-header`, `catalog-menu`, `header-actions`, `mobile-menu`; the largest component is about 100 lines.                                                       |
| Client code is minimal      | `'use client'` only in `catalog-menu`, `mobile-menu`, `locale-switch`, `nav-link`, `error-view`, and `Sheet`.                                                                                    |
| No dump folders             | `shell/src/lib` is grouped into `header`, `footer`, `controls`, `navigation`, `i18n`, `not-found`, `error`. No `utils`, `types`, or `constants` folders.                                         |
| Facts in one place          | Phones, address, email, hours, and the logo are only in `COMPANY`; paths only in `SHELL_PATHS`.                                                                                                  |
| Boundaries                  | `scope:site` may depend only on `scope:site` and `scope:shared` (root ESLint). `site-core-seo` uses only `config` and `i18n`.                                                                    |
| Generator leftovers         | Removed sample components, `.babelrc`, `.swcrc`, the sample API route, and unused `@swc/cli`, `eslint-config-next`.                                                                              |

## Notes for the next steps

- `ui.shadcn.com` is not reachable from the cloud environment, so `Button` and `Sheet` were taken from the Kedr site's shadcn/ui copies and restyled. `components.json` is in place for `npx shadcn@latest add` on a developer machine.
- The catalog step should pass the BreviERP tree into the shell through a slot (as the Kedr `catalogNavigation` prop) and delete `navigation/catalog-sections.ts`.
