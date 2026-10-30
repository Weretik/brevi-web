# Existing Admin Modules

This is a map of Nx projects currently in the repository, not a list of planned
libraries. The source is `project.json` in the listed directories; check the
current code and [frontend inventory](../../frontend-inventory.md) before
making changes. Target boundaries and possible future domains are described
in [domains.md](domains.md).

| Area         | Existing Nx projects                                   | Responsibility                                    |
| ------------ | ------------------------------------------------------ | ------------------------------------------------- |
| Application  | `apps/admin-react`, `apps/admin-react-e2e`             | React Admin composition and browser checks        |
| Core         | `libs/admin/core/{auth,shell}`                         | Session and application shell                     |
| Products     | `libs/admin/products/{model,data-access,ui,feature}`   | Product model, API, presentation, and scenarios   |
| References   | `libs/admin/references/{model,data-access,ui,feature}` | Admin reference data                              |
| Clients      | `libs/admin/clients/{model,data-access,ui,feature}`    | Customers, quotes, documents, and custom sewing   |
| Admin shared | `libs/admin/shared/{api-client,config,contracts}`      | API transport, configuration, and Admin contracts |

The route list in `apps/admin-react/src/app/router/admin-route-definitions.tsx`
wires clients, products, and references. `orders`, `dashboard`, `shared/ui`,
and `core/permissions` in the [target structure](domains.md) do not mean the
corresponding Nx projects already exist. Check shared `libs/shared/*` against
the code and [frontend inventory](../../frontend-inventory.md).
