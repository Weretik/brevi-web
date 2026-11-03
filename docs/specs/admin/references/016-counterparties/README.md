# 016 — «Контрагенти»: suppliers and clients from KeepinCRM

**Status:** implemented 2026-11-03. **Backend:** BreviERP CRM-002 (`POST /api/crm/customers/keepin-sync`, list fields `keepinCrmId`, `contactName`, `phones`).

Step 4 of moving the client's Calculator into Brevi. The product owner asked on 2026-11-02 to move «Клієнти» out of «Менеджер сервісу» into «Загальні довідники → Контрагенти». The page has the tabs «Постачальники» and «Клієнти». Both come from KeepinCRM and are refreshed by one daily job.

## Rules

- **R-01:** `/references/counterparties` holds the tabs «Постачальники» (default) and «Клієнти» (`?tab=clients`). The menu shows «Контрагенти» in «Загальні довідники». «Клієнти» and the placeholder «Постачальники» are removed from «Менеджер сервісу».
- **R-02:** The old addresses redirect: `/references/supplier` → `/references/counterparties`, and `/crm/clients` → `/references/counterparties?tab=clients`. Client cards stay at `/crm/clients/:id` and `/crm/clients/new`, and their back button returns to the clients tab.
- **R-03:** The clients tab follows reference pattern B: a header with «Оновити з KeepinCRM» and «Додати клієнта», a full-width search row, activity chips with server counts, then the table. Search, the activity filter and the page live in the URL and run on the server; search waits 300 ms after typing.
- **R-04:** The table shows the name with its KeepinCRM ID, the type, the contact person, the phones and the status. Clicking a row opens the card.
- **R-05:** «Оновити з KeepinCRM» runs the daily refresh (applied, never deleting) and reports the counts. The one-time transfer that deletes old clients is not a button. It runs once through the API after a preview and the owner's confirmation.

## Scenarios

- **SC-01 / R-03, R-04:** Given KeepinCRM clients, the tab shows the counts and the row, and a click opens the card.
- **SC-02 / R-03, R-05:** Typing searches on the server, and the refresh shows its summary.
- **SC-03 / R-01, R-02:** The old suppliers address opens «Контрагенти», the menu links to it, and «Клієнти» is gone from «Менеджер сервісу».

## Tests

- `libs/admin/clients/feature/src/pages/customers/reference/customers-reference-content.component.test.tsx`
- `libs/admin/clients/data-access/src/mappers/customers/customer-response.unit.test.ts`
- `libs/admin/clients/model/src/mappers/customers/describe-customer-keepin-sync.unit.test.ts`
- `apps/admin-react/src/app/router/{app-router.integration.test.tsx,navigation-config.unit.test.ts}`
- `apps/admin-react-e2e/src/admin-react.shell.spec.ts`
