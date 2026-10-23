# Existing Storefront Modules

This is a map of current Nx projects from their `project.json` files. Check
actual targets and versions in the [frontend inventory](../frontend-inventory.md)
and project configuration.

| Area            | Existing Nx projects                                                                             | Responsibility                                                              |
| --------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Application     | `apps/storefront`                                                                                | Angular SSR, routes, and global providers                                   |
| Storefront base | `libs/storefront/{data-access,shell,ui,util}`                                                    | Data, shell, presentation, and utilities                                    |
| Feature         | `libs/storefront/feature/{home,catalog,contacts,about-us,not-found}`                             | Main and informational pages                                                |
| Feature         | `libs/storefront/feature/order-in-bulk/order-in-bulk`, `libs/storefront/feature/regions/regions` | Bulk orders and regions; code has an additional same-named nested directory |

`apps/storefront/src/app/app.routes.ts` wires feature routes under `/uk` and
`/ru`; the root path redirects to `/uk`. The presence of a library does not
prove that every scenario is complete. Check shared `libs/shared/*` against
the code and [frontend inventory](../frontend-inventory.md).
