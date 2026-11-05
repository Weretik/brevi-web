# Admin: Бухгалтерія

**Status:** stage 1 («Рахунки і каси», «Категорії») and stage 2 («Огляд», «Операції», «Перекази», archive «Домашня бухгалтерія», balances) implemented 2026-11-05. Backend decisions and later stages are in the BreviERP specification `docs/sdd/specs/accounting/001-finance`; the consumed contract is [backend/accounting](../../contracts/openapi/backend/accounting/finance.openapi.yaml).

The «Бухгалтерія» menu group is shown only to the director: every item has `requiredRoles: ['Director']`, and the routes are wrapped in `RequireRole` with `canUseAccounting`. The backend allows the same role (policy `CanUseAccounting`). Items of later stages («Контрагенти», «Потребують перевірки», «Імпорт виписок», «Звіти», «Журнал змін») are in the menu without a page yet.

`/accounting/accounts` «Рахунки і каси»:

- header with «Додати рахунок», search by name, IBAN (spaces ignored) or note, chips «Активні / Без залишку на 01.10 / Архів» with counts;
- «Цех» table: name, type, IBAN, and «Залишок на 01.10». A confirmed balance shows the amount; a missing one shows only the problem pill «Не підтверджено». Active accounts carry no badge;
- the row menu opens the side panel (`ReferenceEditorDrawer`): view with the account, the balance on 01.10 (who and when confirmed), «Підтвердити залишок» / «Змінити залишок» / «Скасувати підтвердження», «Історія змін» and «Перенести в архів» / «Відновити з архіву»; «Редагувати» and «Додати рахунок» open the form. Money is typed as «62 546,40» and sent in kopecks;
- the table also shows «Поточний залишок» and «Домашня бухгалтерія» (legacy balance); the view has a «Залишки» section;
- «Видалити» asks first; an account with operations or transfers can only be moved to the archive (the backend answers 409). The log keeps the last snapshot. Every change sends the version the panel opened; if someone saved first, the panel stays open with the backend reason.

`/accounting/categories` «Категорії»:

- tabs «Поточний облік з 01.10.2026» and «Домашня бухгалтерія до 01.10.2026» (`?tab=archive`), chips «Витрати / Надходження» with counts, search that keeps the root of a matching subcategory;
- the table lists each root with its subcategories right under it (sorting off);
- the side panel: view with «Додати підкатегорію» (on a root) and «Історія змін»; the form has the direction and «Входить у» (root or one of the active roots) only when creating;
- deleting a root warns that its subcategories go with it; a category already used in operations is switched off instead (pill «Вимкнена»).

`/accounting/overview` «Огляд»: period figures (надходження, витрати, різниця) and the balances table per account for the chosen area; only accounts without a balance on 01.10 get a problem mark.

`/accounting/transactions` «Операції» and `/accounting/transfers` «Перекази»:

- both share the area tabs (`?tab=archive` for «Домашня бухгалтерія», which opens on its own period ending the day before 01.10), a filter row applied on «Застосувати», server paging (50) and sorting, and totals of the whole selection;
- operations: signed amounts, category with subcategory, account, counterparty text, status; the side panel creates, edits («Зберегти і додати ще» keeps account and date) and cancels with the opened version;
- transfers: from / to account, amount; a transfer between accounts of different currencies is refused before saving.

## Structure diagram

```mermaid
flowchart LR
  App["admin-react: RequireRole canUseAccounting, legacy menu"] --> Routes["accounting/feature: accountingRoutes"]
  Routes --> Pages["pages: accounts, categories, overview, transactions, transfers"]
  Pages --> Drawers["components: account / category drawers"]
  Drawers --> Hooks["hooks: editors with version, journal, choices, settings"]
  Pages --> UI["accounting/ui: grids, forms, details, history"]
  UI --> RefUI["references/ui: ReferenceDataGrid, ReferenceEditorDrawer"]
  Hooks --> DataAccess["accounting/data-access: RTK Query"]
  DataAccess --> Model["accounting/model: entities, money, forms, filters, tree"]
  DataAccess --> API["BreviERP /api/accounting"]
```

## Code structure

```text
libs/admin/accounting/
├── model/src/entities/{accounts,categories,history,settings}/   # account, category, log entry, cutover date
├── model/src/entities/{movements,transactions,transfers,overview}/ # operations, transfers, totals, overview
├── model/src/mappers/money/finance-money.ts                       # «62 546,40» ↔ kopecks, dates
├── model/src/forms/{accounts,...,transfers}/                     # form values ↔ request bodies
├── model/src/validators/{accounts,...,transfers}/                # field limits shared with BreviERP
├── model/src/queries/accounts/finance-account-filters.ts         # chips and search
├── model/src/queries/categories/finance-category-tree.ts         # root + subcategory rows, parents
├── model/src/queries/journal/finance-journal-filters.ts          # area tabs, journal filters → query params
├── data-access/src/api/{accounts,...,overview}/                  # endpoints; accounting.api.ts joins them
├── data-access/src/validators/accounting-response.ts             # runtime response checks
├── data-access/src/mappers/accounting.mapper.ts                  # response → model
├── data-access/src/mappers/accounting-movement.mapper.ts         # operations, transfers, overview
├── data-access/src/errors/accounting-api-error.ts                # keeps backend reasons (409)
├── ui/src/tables/{accounts,categories,transactions,transfers,overview}/ # «Цех» grids, balances
├── ui/src/forms/{accounts,categories,transactions,transfers}/   # account, balance, category, operation, transfer forms
├── ui/src/details/{accounts,...,transfers}/                      # read-only views in the side panel
├── ui/src/components/{history,status,journal,overview}/          # history, problem pill, filters, totals, overview
├── ui/src/dialogs/finance-delete-dialog.tsx                      # delete confirmation
└── feature/src/
    ├── accounting.routes.tsx                                     # accounts, categories, overview, transactions, transfers
    ├── pages/{accounts,categories,overview,transactions,transfers}/ # pages
    ├── components/{accounts,categories,transactions,transfers}/  # side panels
    ├── components/journal/                                       # area tabs, journal toolbar
    ├── hooks/                                                    # editors, journal, choices, settings
    └── testing/{render.tsx,finance-api-stub.ts}                  # render with the API store, stubbed API
libs/admin/core/auth/src/session/session-user.ts                  # canUseAccounting
apps/admin-react/src/app/router/{create-admin-router.tsx,legacy-menu.ts,admin-route-layout.tsx}
```

`libs/admin/references/ui` `ReferenceDataGrid` and its row menu accept text ids (uuid) as well as numbers.

## Tests

`npx nx test admin-accounting-feature`, `admin-accounting-ui`, `admin-accounting-data-access`, `admin-accounting-model`, and `npx nx test admin-react -- navigation-config`:

- `feature/src/pages/accounts/finance-accounts-page.component.test.tsx` — problem pill only for a missing balance, archive chip, create in kopecks, confirm the balance with the opened version;
- `feature/src/pages/accounts/finance-accounts-page.component.test.tsx` also checks that an account with movements offers only the archive;
- `feature/src/pages/categories/finance-categories-page.component.test.tsx` — root with subcategories, direction and area switch, subcategory from the root panel, delete warning;
- `feature/src/pages/overview/finance-overview-page.component.test.tsx` — period figures, problem mark only without the balance on 01.10, area switch;
- `feature/src/pages/transactions/finance-transactions-page.component.test.tsx` — signed amounts and totals, expense in kopecks with a subcategory, cancel with the version, archive period and filters on demand;
- `feature/src/pages/transfers/finance-transfers-page.component.test.tsx` — totals, currency mismatch refused before saving;
- `model/src/queries/journal/finance-journal-filters.unit.test.ts`, `model/src/validators/transactions/finance-transaction-validation.unit.test.ts`, `data-access/src/mappers/accounting-movement.mapper.unit.test.ts`;
- `model/src/mappers/money/finance-money.unit.test.ts`, `model/src/validators/accounts/finance-account-validation.unit.test.ts`, `model/src/queries/categories/finance-category-tree.unit.test.ts`;
- `data-access/src/mappers/accounting.mapper.unit.test.ts`, `ui/src/components/history/finance-history-list.component.test.tsx`;
- `apps/admin-react/src/app/router/navigation-config.unit.test.ts` — the group only for the director.
