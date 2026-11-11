# Admin: «Контент → Товари» (site pages of products)

**Status:** implemented and locally verified 2026-11-11. **Backend:** BreviERP [CNT-002](https://github.com/Weretik/BreviERP/blob/f4d8435ab91d5f165b8e30ced5397c77d0a00582/docs/sdd/specs/content/002-product-pages/README.md), stage 2 of its plan. **Contract:** [API contract](contracts/api-contract.md).

## Goal

The public site takes its products from the Admin. Staff decide which products of «Товари» the site shows and write what it says about each: the page address, SEO and texts in Ukrainian and Russian, in the same structure as the old site (short facts next to the photo, description, characteristics by garment part).

## Scope

- Page «Контент → Товари сайту» at `/content/products`, menu group «Контент».
- List of every product of «Товари» (sewing and PPE) with the «На сайті» switch and what the page still misses.
- Side panel: view first, then «Редагувати»; delete of the page with a confirmation.
- «Перенести зі старого сайту»: one-time transfer of old-site texts and SEO from a file (CNT-002 stage 3).

Not here: building the transfer file (a script in the project files), the public API and the site itself (stages 4–5), section names and SEO («Контент → Розділи», later).

## Rules

- R-01: The list is server-side: search by name, code or address; filters «Усі / На сайті / Не на сайті» with counts and «Усі типи / Швейна продукція / ЗІЗ»; state is kept in the URL.
- R-02: Only problems are marked. For a product marked for the site the row lists what the site would miss: product switched off in «Товари», no price, no photo, no Ukrainian or Russian text, no SEO. A complete page and a product not marked for the site have no mark.
- R-03: The «На сайті» switch saves at once. When the product is switched off in «Товари», a warning says the site will not show it.
- R-04: The side panel opens read-only: page mark and address, what comes from «Товари» (name, code, section, three prices, fabrics with prices) and the texts by language as the site lays them out.
- R-05: The editor has the mark, the address and, per language, name, SEO title, SEO description, short facts, description and characteristics. Changed 2026-11-11 by the owner's rule «no typed markup»: the description is edited in the shared visual editor (heading, bold, italic, list); short facts and characteristics are rows of fields with add and delete buttons. Bold and italic are kept inside the stored strings as `**…**` and `*…*`; the site renders them.
- R-06: Before saving the form checks the address rule and the same limits as the server; a characteristic line without «:» is an error because it would be lost. A language with an error is marked on its tab.
- R-07: Save sends the whole page with the revision that was opened. A stale revision or a taken address comes back as the server's message in the panel.
- R-08: «Видалити сторінку» asks for a confirmation that explains the difference from switching the product off the site.
- R-09: «Права доступу», page `content-products`: without «Редагувати» the switch is disabled and the panel has no «Редагувати»; without «Видаляти» there is no «Видалити сторінку». Defaults: Admin everything, Manager view. A role made on «Права доступу» has exactly the rights it was given.
- R-10: «Перенести зі старого сайту» is shown with the «Створювати» right. The dialog takes a JSON file (`{ items: [...] }` or the list, up to 500 pages, each with its old-site link) and refuses any other file before a request. After the file is picked the server counts what would happen (`dryRun`): pages to create, to replace, kept, old pages without a product and pages with a problem, each with its reason. Two switches, both off: «Одразу показувати перенесені товари на сайті» and «Замінити тексти сторінок, які вже заповнені»; changing one counts again. «Перенести» is enabled only after a count with something to create or replace; nothing is written before it.

## Scenarios

- SC-01: A manager opens the page, filters «Не на сайті», finds a model by code and reads its page in the panel.
- SC-02: An admin switches a product on from the list; the row shows what the site still misses.
- SC-03: An admin opens the panel, presses «Редагувати», fills the Ukrainian and Russian texts and saves; the list shows the result.
- SC-04: An admin types an address with Cyrillic letters; the form refuses it before any request.
- SC-05: An admin deletes a page after the confirmation; the product stays in the list without a page.
- SC-06: An admin picks the transfer file, reads the count and the old pages without a product, presses «Перенести» and sees the result; the list reloads.

## Design

Follows the design system «Цех»: reference list pattern (header, search, filter chips, table in a card) and the `ReferenceEditorDrawer` side panel. Libraries by layer: `@admin/content/model` (entities, rich text mapping, form, validation), `@admin/content/data-access` (RTK Query endpoints, runtime mappers), `@admin/content/ui` (table, view, form, dialog), `@admin/content/feature` (list state, panel, page, routes). The app gives the rights through `useContentProductsViewer`.

## Verification

Unit tests of the rich text mapping, validation, problems and mappers; component tests of the list, filters, switch, read-only rights, save with revision, invalid address, delete and the old-site transfer (check first, wrong file, no create right); the navigation test for the menu item by role. Evidence: `npx nx test admin-content-model`, `admin-content-data-access`, `admin-content-ui`, `admin-content-feature`, the admin-react navigation and router tests, lint and typecheck of the same projects, `npm run contracts:check`.
