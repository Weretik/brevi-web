# Admin: Журнал дій

**Status:** implemented 2026-11-16. The requirements are in [specification 001](../../specs/admin/activity-log/001-staff-activity-log/README.md). The backend decisions are in the BreviERP specification ACT-001 (the ActivityLog module, domain events through each module's outbox). The consumed contract is [backend/activity-log](../../contracts/openapi/openapi.json).

`/admin/activity-log` («Адміністрування → Журнал дій») is the page `activity-log` of «Права доступу». Admin gets «Бачить» by default and the Director always has it. The page is read only: who created, changed or deleted what, and when, in КП, виробничі завдання, warehouse movements, the catalogue, reference data, clients and photos. Every staff member is recorded, and the page shows managers by default. A new action appears within about a minute.

- **Table:**
  - «Коли»: Kyiv time, mono font.
  - «Хто»: avatar, name and roles.
  - «Дія».
  - «Об'єкт»: type and number or name.
  - «Що змінено»: the summary and the first two «Поле: було → стало», plus «ще N».
  - 50 rows per page from the server.
- **Filters:**
  - Search: object name and summary, with a 300 ms pause.
  - «Хто».
  - «Роль»: «Менеджер» by default, «Усі ролі» removes it.
  - «Об'єкт» and «Дія».
  - Dates «З» and «По».
  - Everything lives in the URL, so a link keeps the view.
- **Side panel:** a row opens it read only. It shows every change, and the object links to its page (КП, виробниче завдання, клієнт, товар) unless the entry deleted it.

## Code structure

```text
libs/admin/activity-log/
├── model/src/activity-entry.ts                 # entry, change, filter options, query
├── model/src/activity-labels.ts                # action and role titles, object links, Kyiv time
├── model/src/activity-query.ts                 # URL ↔ query, managers by default, «Усі ролі» = role=all
├── data-access/src/activity-log-api.ts         # GET entries, GET filters
├── data-access/src/activity-log-response.ts    # runtime response checks
└── feature/src/
    ├── pages/activity-log-page.tsx, use-activity-log.ts   # the page and its URL state
    ├── components/                                          # table, filter row and chips, change list, side panel
    └── activity-log.routes.tsx                              # /admin/activity-log
apps/admin-react/src/app/router/{routes/admin-route-definitions.tsx,navigation/legacy-menu.ts}   # route behind «Права доступу», menu item
```

## Tests

`npx nx test admin-activity-log-feature`, `admin-activity-log-data-access`, `admin-activity-log-model`:

- `feature/src/pages/activity-log-page.component.test.tsx`: managers by default, «Усі ролі», filters and search back to page 1, the side panel with the link, empty and error states.
- `data-access/src/activity-log-response.unit.test.ts` and `model/src/activity-query.test.ts`.
- `apps/admin-react/src/app/router/navigation/navigation-config.unit.test.ts`: the menu item.
