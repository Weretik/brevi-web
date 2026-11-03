# Admin: Контрагенти

**Status:** implemented 2026-11-03 ([SDD 016](../../../specs/admin/references/016-counterparties/README.md)).

`/references/counterparties` («Загальні довідники → Контрагенти») has two tabs: «Постачальники» (default, the [suppliers page](suppliers.md)) and «Клієнти» (`?tab=clients`). The data for both comes from KeepinCRM and is refreshed by the daily backend job `brevierp-sync`. The old addresses `/references/supplier` and `/crm/clients` redirect here.

The «Клієнти» tab follows reference pattern B. It has:

- a header with «Оновити з KeepinCRM» and «Додати клієнта», and a subtitle with the last KeepinCRM sync time, as for suppliers;
- a search row;
- the chips «Активні / Не використовуються / Усі», with counts from the server;
- a server-paged «Цех» table: name with its KeepinCRM ID, type, contact person, phones and status.

Search, the filter and the page are kept in the URL. A row opens the client card at `/crm/clients/:id` (see [clients and quotes](../clients-and-quotes.md)). The tab lives in `clients/feature`, and `references/feature` only hosts the tabs.

## Code structure

```text
libs/admin/references/feature/src/pages/counterparties/counterparties-page.tsx  # tabs host, ?tab=
libs/admin/references/feature/src/references.routes.tsx                          # route and old supplier redirect
libs/admin/clients/
├── feature/src/pages/customers/reference/customers-reference-content.tsx       # «Клієнти» tab
├── feature/src/hooks/customers/use-customer-reference-list.ts                  # URL state, server list and counts
├── feature/src/hooks/customers/use-customer-keepin-sync.ts                     # «Оновити з KeepinCRM»
├── feature/src/clients.routes.tsx                                              # /crm/clients redirect
├── ui/src/tables/customers/customers-reference-grid.tsx                        # server-paged table
├── data-access/src/api/customers/customer-keepin-sync.ts                       # POST keepin-sync
├── data-access/src/mappers/customers/customer-keepin-sync.mapper.ts            # result mapping
└── model/src/mappers/customers/describe-customer-keepin-sync.ts                # notice text
apps/admin-react/src/app/router/legacy-menu.ts                                  # «Контрагенти» menu item
```

## Tests

Run focused tests with `npx nx test admin-clients-feature -- customers-reference`, `npx nx test admin-clients-data-access -- customer-response` and `npx nx test admin-react`. The full list is in [SDD 016](../../../specs/admin/references/016-counterparties/README.md#tests).
