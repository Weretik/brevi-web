# Admin: Фонові задачі

**Status:** implemented 2026-11-14. Requirements are in [specification 001](../../specs/admin/scheduling/001-background-tasks/README.md); backend decisions are in the BreviERP specification for the Scheduling module; the consumed contract is [backend/scheduling](../../contracts/openapi/backend/scheduling/background-tasks.openapi.yaml).

`/admin/background-tasks` («Адміністрування → Фонові задачі») is page `background-tasks` of «Права доступу» (Admin by default: view, create = «Запустити зараз», edit = «Змінити розклад»). The list of tasks lives in the backend code: the page cannot add or delete a task, only change when it runs.

- Table: task name and description, schedule in words («Пн–Пт о 09:00», «Кожні 10 хв, 08:00–20:00», «Лише вручну»), next run, last success with its summary, last failure with its reason, and marks only for what needs attention («Остання спроба з помилкою», «Пропущено запуск», «Виконується», «Запуск заплановано», «Вимкнено»). The list refreshes every 30 seconds.
- A row opens the side panel: description, schedule, results and the last runs. «Запустити зараз» (create right) asks the backend to start the task within a minute; it is hidden while the task runs or is already requested. «Змінити розклад» (edit right) edits on/off, the kind (days and Kyiv times, interval with optional hours, or manual only) and an optional one-time next run.
- The outbox («Повідомлення в Telegram») runs every minute with the scheduler and shows neither button.

## Code structure

```text
libs/admin/scheduling/
├── model/src/entities/scheduled-task{,-run}.ts        # task, schedule, run, schedule input
├── model/src/mappers/describe-schedule.ts             # schedule in words
├── model/src/mappers/kyiv-time.ts                     # Kyiv date-time display and input
├── model/src/forms/schedule-form{,-validation}.ts     # form values ↔ input, field checks
├── data-access/src/api/scheduling-api{,-error}.ts     # GET tasks, GET runs, PUT schedule, POST run now
├── data-access/src/mappers/                           # runtime response checks, response → model
└── feature/src/
    ├── pages/background-tasks-page.tsx                # the page; tasks-summary.tsx in the header
    ├── components/table/                              # DataGrid and the problem marks
    ├── components/panel/                              # side panel: view, run history, schedule form
    ├── hooks/use-background-tasks.ts, use-schedule-form.ts
    └── background-tasks.routes.tsx                    # /admin/background-tasks
apps/admin-react/src/app/router/{routes/admin-route-definitions.tsx,navigation/legacy-menu.ts}   # route behind «Права доступу», menu item
```

## Tests

`npx nx test admin-scheduling-feature`, `admin-scheduling-data-access`, `admin-scheduling-model`:

- `feature/src/pages/background-tasks-page.component.test.tsx` — list and marks, side panel, saving a schedule, «Запустити зараз» and its refusal, hidden actions without rights and for the outbox, load error;
- `data-access/src/mappers/scheduled-task.mapper.unit.test.ts`, `model/src/mappers/{describe-schedule,kyiv-time}.test.ts`, `model/src/forms/schedule-form.test.ts`;
- `apps/admin-react/src/app/router/navigation/navigation-config.unit.test.ts` — the menu item.
