# Admin React: «Фонові задачі»

**Status:** implemented 2026-11-14. Backend: BreviERP SCH-001 (`docs/sdd/specs/scheduling/001-background-tasks`). [Consumer contract](contracts/api-contract.md).

## Goal and scope

The admin or director sees every background task of Brevi on one page, understands what each does, when it runs next, when it last worked and why it last failed, changes only its schedule, and starts it now without the owner. The task list is code on the backend: the page cannot add, rename or delete tasks.

Actor: a role with the page `background-tasks` on «Права доступу» (Admin by default; the Director always). Route `/admin/background-tasks`, menu «Адміністрування → Фонові задачі».

Out of scope: editing task names or descriptions, deleting runs, cloud settings (Cloud Scheduler, jobs).

## Rules

- **R-01** The table shows each task in the backend's order: name with its description under it, schedule in words («Пн–Пт о 09:00», «Щодня о 07:00, 13:00», «Кожні 10 хв, 08:00–20:00», «Лише вручну»), next run, last success with its summary, last failure with its reason.
- **R-02** Only problems are marked (no «все добре» badges): «Остання спроба з помилкою» when the last result failed, «Пропущено запуск» when the task is overdue, «Вимкнено» for a disabled task, «Виконується» while it runs, «Запуск заплановано» after «Запустити зараз».
- **R-03** A row opens the side panel (`ReferenceEditorDrawer`): description, schedule, results and the last 50 runs (when, how it started and by whom, result, message). «Запустити зараз» there needs the create right; «Змінити розклад» needs the edit right. The outbox row (not editable) shows neither: it runs every minute.
- **R-04** The schedule form: switch «Увімкнено», kind «За днями й часом» (1–6 Kyiv times, weekdays), «Через інтервал» (5–1440 min, optional hours from–to) or «Лише вручну», and an optional one-time «Наступний запуск» (not in the past). Ukrainian messages under the fields; the backend's reason is shown as is.
- **R-05** All times are shown in Kyiv time as «16.11.2026, 09:00». The page refreshes the list every 30 seconds while it is open so a run's result appears without reloading.

## Scenarios

- **SC-01** Given tasks, when the page opens, then each row shows its name, schedule in words, next run and last results, and only problems are marked.
- **SC-02** Given a row, when it is clicked, then the side panel shows the description, schedule, results and run history.
- **SC-03** Given the edit right, when «Змінити розклад» is saved with Mon and Fri at 07:00 and 13:00, then `updateScheduledTaskSchedule` gets `{kind: 'daily', times: ['07:00','13:00'], days: [1,5]}` and the list shows the new schedule.
- **SC-04** Given wrong input (no time, interval below 5 min, hours «з» ≥ «до»), when saved, then nothing is sent and the field shows the reason.
- **SC-05** Given the create right, when «Запустити зараз» is pressed, then `runScheduledTaskNow` is sent and the row shows «Запуск заплановано»; a 409 shows the backend reason.
- **SC-06** Given a role without edit or create, then «Змінити розклад» and «Запустити зараз» are hidden; the outbox never shows them.
- **SC-07** Loading, error with «Повторити», and forbidden states exist; the menu item shows only with the view right.

## Design

| Layer       | Path                                                          | Responsibility                                                           |
| ----------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| model       | `libs/admin/scheduling/model/src/entities/`                   | task, run and schedule models                                            |
| model       | `libs/admin/scheduling/model/src/mappers/`                    | schedule in words, Kyiv date and time                                    |
| model       | `libs/admin/scheduling/model/src/forms/`                      | form values ↔ input, validation                                          |
| data-access | `libs/admin/scheduling/data-access/src/api/`                  | RTK Query endpoints, errors                                              |
| data-access | `libs/admin/scheduling/data-access/src/mappers/`              | runtime checks, response → model                                         |
| feature     | `libs/admin/scheduling/feature/src/{pages,components,hooks}/` | page, table, side panel, schedule form, history                          |
| app         | `apps/admin-react/src/app/router/`                            | menu item `access: 'background-tasks'`, route inside `RequirePageAccess` |

## Tasks and evidence

- **TS-01** model: schedule in words and form validation unit tests (SC-03, SC-04).
- **TS-02** data-access: mapper unit tests (runtime checks).
- **TS-03** feature: page component tests (SC-01, SC-02, SC-03, SC-05, SC-06, SC-07).
- **TS-04** app: menu and `defaultAccess` (SC-07).
- **TS-05** feature card, catalog row, spec index; full feature audit.

**Evidence (2026-11-14):** TS-01..TS-05 done. `npx nx test` passes for `admin-scheduling-model` (6), `admin-scheduling-data-access` (3), `admin-scheduling-feature` (6) and `admin-react` (35); lint, typecheck and typecheck-tests pass for the four projects; `architecture:structure`, `docs:check` and `contracts:check` pass. Feature card: [background-tasks](../../../../features/admin/background-tasks.md).
