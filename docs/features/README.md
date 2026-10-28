# Brevi Web feature map

**Checked against routes and code:** 2026-10-16. This is a map of the implementation, not a list of future SDDs. Verify an individual scenario's status in the code and its related specification.

In each feature card, “Structure diagram” shows relationships between parts, “Code structure” shows actual directories and key files with their roles, and “Tests” lists test files with the focused run command. Separate trees for `apps/` and `libs/` do not replace architecture documentation.

## Admin React (`apps/admin-react`)

- Clients: [клієнти, контакти, перевірка дублювання та чернетки КП](admin/clients-and-quotes.md).
- Admin foundation: [shell, navigation, and session](admin/shell.md).
- Products: [list, details, creation, and editing](admin/products/products.md); [media library](admin/products/media.md); [Sewing Articles and composition](admin/products/sewing-composition.md); [Article calculation and published prices](admin/products/sewing-pricing.md); [PPE pricing and input approval](admin/products/ppe-pricing.md).
- Reference data: [suppliers](admin/references/suppliers.md); [hardware and fabrics](admin/references/materials.md); [garment parts and operations](admin/references/garment-parts.md); [additional reference data](admin/references/additional-references.md).

## Storefront Angular (`apps/storefront`)

- Main page: [home](storefront/home.md).
- Catalog: [product list and product page](storefront/catalog.md).
- Information: [contacts](storefront/information/contacts.md); [company and information pages](storefront/information/about-us.md); [regions](storefront/information/regions.md).
- Orders: [bulk order](storefront/order-in-bulk.md).
- Navigation: [404 page](storefront/not-found.md).

`apps/storefront/src/app/app.routes.ts` assembles localized `/uk` and `/ru` routes; `apps/admin-react/src/app/router/app-router.tsx` assembles Admin routes. Requirements and task specifications have a [separate SDD index](../specs/README.md); this map explains existing code and relationships. Add a new feature here together with its short description, and update the relevant page after architecture changes.
