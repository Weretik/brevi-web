# Structure check: home page

**Date:** 2026-11-10. Short check of the files this step created, under the staged structure check in the [delivery rules](../../../../../standards/shared/delivery-rules.md). It is not the full code audit.

| Check                       | Result                                                                                                                                                                                                                                                      |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route is thin               | `[locale]/page.tsx` checks the locale and calls `buildHomeMetadata` and `HomePage`; the temporary text from step 1 is gone.                                                                                                                                 |
| One responsibility per file | One block per file in `home/ui/src/lib/sections`; the largest is about 100 lines. `home-page.tsx` only orders blocks and builds links.                                                                                                                      |
| Client code                 | None: the home libraries have no `'use client'`. The FAQ is `<details>`.                                                                                                                                                                                    |
| No dump folders             | `home/ui/src/lib` is grouped into `i18n`, `layout`, `sections`. No `utils`, `types`, or `constants` folders.                                                                                                                                                |
| Facts in one place          | Company facts only in `COMPANY`; page paths only in `SITE_PATHS` (`SHELL_PATHS` is the same object, type-checked against the menu); catalog sections only in `site-catalog-model`.                                                                          |
| Boundaries                  | `site-home-ui` (`type:ui`) uses `config`, `i18n`, `shared/ui`, and `catalog/model`. `site-home-feature` composes `ui`, `seo`, and the model. `site-core-seo` is retagged `type:util`: it only builds values from `config` and `i18n`, and features need it. |
| Generator leftovers         | Removed sample components, CSS modules, and `.babelrc` from the four generated libraries; configs follow the existing site libraries.                                                                                                                       |

## Notes for the next steps

- The catalog step replaces `HomeCatalog` sections with the BreviERP tree and adds the product cards and the price calculator of the mockup.
- The request step replaces the right side of `HomeContacts` with the form.
- When the admin gets home blocks, `getHomeDictionary` becomes the fallback of a `site-home-data-access` loader, as on the Kedr site.
