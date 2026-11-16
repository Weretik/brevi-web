# Admin React: «Журнал дій»

**Status:** implemented 2026-11-16. **Backend:** BreviERP ACT-001 (`docs/sdd/specs/activity-log/001-staff-activity-log`), endpoints `getActivityEntries` and `getActivityFilters`. **Owner decision (2026-11-16):** every staff member is recorded, and the page shows managers by default through the role filter.

## Goal and scope

The director sees who created, changed or deleted what, and when: КП, виробничі завдання, warehouse movements, the catalogue, reference data, clients, photos. It is one read-only list with filters, and each row can be opened for the full field changes.

Actor: a role with the page `activity-log` on «Права доступу» (by default Admin «Бачить»; the Director always). Route `/admin/activity-log`, menu «Адміністрування → Журнал дій».

Out of scope: editing or deleting entries, exports, and instant updates. An entry appears within about a minute, once the outbox delivers it.

## Rules

- **R-01** The table shows the newest entries first, 50 per page, with server paging. Columns:
  - «Коли»: Kyiv time «16.11.2026, 14:30», mono font.
  - «Хто»: the person's avatar, name and role titles.
  - «Дія»: «Створено», «Змінено», «Видалено», «Надіслано», «Закрито», «Скасовано», «Відновлено в роботі», «Анульовано», «Відновлено», «Імпорт».
  - «Об'єкт»: the type title and the object's number or name.
  - «Що змінено»: the summary and the first changes as «Поле: було → стало», plus «ще N».
- **R-02** Filters:
  - Search: its own row. It searches the object name and summary, with a 300 ms pause.
  - Chips with menus: «Хто» (the people from `getActivityFilters`), «Роль», «Об'єкт» (types), «Дія».
  - Period: dates «з» and «по».
  - «Роль» is «Менеджер» by default. «Усі ролі» removes it.
  - All filters and the page live in the URL (`?role=all&actor=7&type=quote&action=Changed&from=2026-11-01&to=2026-11-16&q=…&page=2`), so a link keeps the view.
  - A filter change returns to page 1.
- **R-03** A row opens a read-only side panel (`ReferenceEditorDrawer`). It shows when and who (with roles), the action, the object (a link for КП, виробниче завдання, клієнт and товар unless the entry is a delete), the summary, and every change as «було → стало», with «—» for an empty value.
- **R-04** States:
  - Loading.
  - Empty: «Записів немає»; with filters, «Нічого не знайдено за цими фільтрами».
  - Error with «Повторити».
  - The menu item and the route need the view right.
  - There are no write actions, so no buttons depend on other rights.

## Scenarios

- **SC-01** When the page opens, `getActivityEntries` is called with `role=Manager, page=1, pageSize=50`, and the rows show when, who, the action, the object and the changes.
- **SC-02** When «Роль → Усі ролі» is chosen, the request has no role and the URL has `role=all`.
- **SC-03** When «Хто», «Об'єкт», «Дія», the dates or the search change, the request carries them and the page returns to 1.
- **SC-04** When a row is clicked, the side panel lists every change, and a КП entry links to `/crm/quotes/{id}`.
- **SC-05** Given an empty result with filters, the empty text says nothing was found; given an error, «Повторити» refetches.
- **SC-06** The menu shows «Журнал дій» to a role with the view right, and hides it from a role without it.

## Design

| Layer       | Path                                                   | Responsibility                                                                        |
| ----------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| model       | `libs/admin/activity-log/model/src/activity-entry.ts`  | entry, change, filters and query types                                                |
| model       | `libs/admin/activity-log/model/src/activity-labels.ts` | action and role titles, object links                                                  |
| model       | `libs/admin/activity-log/model/src/activity-query.ts`  | URL params ↔ query (default role Manager), Kyiv time                                  |
| data-access | `libs/admin/activity-log/data-access/src/`             | RTK Query endpoints, runtime-checked mappers                                          |
| feature     | `libs/admin/activity-log/feature/src/pages/`           | page and its state hook (URL, search pause)                                           |
| feature     | `libs/admin/activity-log/feature/src/components/`      | table, filter row, choice chip, side panel, change list                               |
| app         | `apps/admin-react/src/app/router/`                     | menu item `access: 'activity-log'`, route inside `RequirePageAccess`, `defaultAccess` |

## Tasks and evidence

- **TS-01** model: query ↔ URL and label unit tests (SC-01, SC-02).
- **TS-02** data-access: mapper unit tests (runtime checks).
- **TS-03** feature: page component tests (SC-01 to SC-05).
- **TS-04** app: menu, route, `defaultAccess` (SC-06).
- **TS-05** contract sync, feature card, catalog row, spec index.

**Evidence (2026-11-16):** TS-01 to TS-05 are done.

- `npx nx test` passes for `admin-activity-log-model` (5), `admin-activity-log-data-access` (3), `admin-activity-log-feature` (5) and `admin-react` (35).
- lint, typecheck and typecheck-tests pass for the four projects.
- `architecture:structure`, `contracts:drift` and `docs:check` pass.
- Feature card: [activity-log](../../../../features/admin/activity-log.md).
