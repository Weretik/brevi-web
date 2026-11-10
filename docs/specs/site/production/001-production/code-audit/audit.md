# Structure check: «Виробництво» page

**Date:** 2026-11-10. Short check of the files this step created, under the staged structure check in the [delivery rules](../../../../../standards/shared/delivery-rules.md). It is not the full code audit.

| Check                       | Result                                                                                                                                               |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route is thin               | `about-company/page.tsx` checks the locale and calls `buildProductionMetadata` and `ProductionPage`.                                                 |
| One responsibility per file | One block per file in `production/ui/src/lib/sections`; the dictionary is the only long file (text of two languages).                                |
| Client code                 | None.                                                                                                                                                |
| No dump folders             | `production/ui/src/lib` has `i18n` and `sections`. No `utils`, `types`, or `constants` folders.                                                      |
| No duplicates               | The block frame is shared: `HomeSection` moved to `site-shared-ui` as `PageSection` and both pages use it. Breadcrumbs and their JSON-LD are shared. |
| Facts in one place          | Phone from `COMPANY`; paths from `SITE_PATHS`. The address inside the order paragraph is part of the page text.                                      |
| Boundaries                  | `site-production-ui` (`type:ui`) uses `config`, `i18n`, `shared/ui`; the feature composes `ui`, `core/seo`, `shared/ui`.                             |
| Generator leftovers         | Removed sample components, CSS modules, and `.babelrc`; configs follow the home libraries.                                                           |

## Notes for the next steps

- The next content pages reuse `PageSection`, `Breadcrumbs`, and `buildBreadcrumbJsonLd`.
- The `#zayavka` anchor is written in the home and production features; the request step replaces both with the request page path.
