# Admin React: manager tasks and the «Мої завдання» board

**Status:** implemented 2026-11-04 ([feature card](../../../../features/admin/tasks.md)). **Backend:** BreviERP [TSK-001 manager tasks](https://github.com/Weretik/BreviERP/blob/master/docs/sdd/specs/crm/004-manager-tasks/README.md) (rules R-*, scenarios, API), module Crm, `/api/crm/tasks`. **Design:** [«Цех»](../../../../standards/admin/design-system.md); the owner picked variants H2, A1 with the workload of A2, and K2 on 2026-11-04.

Marks appear only for problems (overdue, urgent), never as an "all OK" chip.

## Who sees what

- Director and Admin (Director also holds Admin) set, edit, reassign and delete tasks. They see everyone's tasks on both pages and filter by manager.
- A Manager sees only own tasks, changes their status and checks their steps. They cannot create, edit, mark urgent or delete.
- Assignees are users with the Manager role. An urgent task past its due time is in «Прострочено».

## Menu

- «Адміністрування › Завдання менеджерам» (`/admin/tasks`, Admin role).
- «Менеджер сервісу › Мої завдання» (`/crm/tasks`, Manager or Admin role). It replaces «Завдання в роботу».
- The «Головна» link is now the «Робочий стіл» tile (H2). Its second line shows what burns («Завдання: прострочено 2 · терміново 1») or «Що чекає сьогодні». A line under it separates it from the menu.

## «Завдання менеджерам»

Header with «Нове завдання» and two tabs. The narrow workload column of the first version cut managers off, so on 2026-11-04 the owner chose L3, a separate tab.

- **«Завдання»** (A1): a metric strip (open, overdue, urgent, done in 7 days, % on time); wide search by title, number or client; filter chips with counts (Відкриті, Прострочені, Термінові, У роботі, Нові, Виконані); a server-paged table on the full width (number, title, manager, client, due, state). A «Менеджер: …» chip shows the manager filter, its cross clears it.
- **«Навантаження»** (L3): one row per manager, including managers with no tasks: open, overdue (red when above zero), urgent, in progress, done in 7 days, % on time over 30 days («—» without done tasks), and a bar overdue / urgent / in progress. A row click opens «Завдання» filtered to that manager.

## «Мої завдання» (K2)

- «На сьогодні»: up to three tasks, overdue first. Next to it are compact metrics.
- Four lanes: Прострочено · Терміново · У роботі · Виконано (done in the last 7 days).
- A card is dragged only where it is allowed. «Прострочено» follows the due time and is never a target. A Manager moves cards to «У роботі» and «Виконано». Director and Admin also move cards into or out of «Терміново».
- Director and Admin get the manager filter chips («Усі менеджери» + names), the avatar on each card when all managers are shown, and «Нове завдання».

## Side panel

Both pages use the same `ReferenceEditorDrawer`.

- The view shows the state, due time, client, description, steps with checkboxes, status buttons («Взяти в роботу», «Виконано», «Повернути в роботу») and the history.
- Director and Admin also get «Редагувати» and «Видалити завдання», which asks for confirmation.
- The form has title, description, manager, due date and time (tomorrow 18:00 by default), «Терміново», a client from KeepinCRM and up to 30 steps.
- A stale change (409) shows «Завдання змінили в іншому вікні».

## Code

Libraries `libs/admin/tasks/{model,data-access,ui,feature}` generated with `nx g @nx/react:library`, following [admin code organization](../../../../standards/admin/admin-code-organization.md). The generated OpenAPI types come from the BreviERP contract `crm/tasks.openapi.yaml`.

## Tests

See the [feature card](../../../../features/admin/tasks.md#tests).
