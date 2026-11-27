# Admin: «Права доступу»

**Status:** implementation exists, redesigned 2026-11-27 (concept Б «Ролі зліва, права справа», ACC-002). Backend: BreviERP `docs/sdd/features/identity/access-rights.md` (ACC-001, ACC-002).

Admin and the director only: «Адміністрування → Права доступу» (`/admin/access`).

- **Roles on the left:** every role with its number of people and «N сторінок» (the director «усе, не змінюється», a role made here «власна роль · …», the open one «· не збережено» while changed); the selected role is kept as `?role=`. Under the list, «Порівняти ролі» switches the right side to a read-only matrix of every page against every saved role (П С Р В).
- **Selected role on the right:** title, the names of its people, the last change; «Копіювати з ролі…» (puts another role's rights into the draft, saved only by «Зберегти»), «Перейменувати» and «Видалити роль» for a role made here (delete only once nobody has it). Built-in roles are never renamed or deleted; the director is read only.
- **Pages:** the search («склад», «КП») and «Усі · Видані · Змінені» chips with counts; groups in menu order fold, «Згорнути все» folds them all. A group header has one level for the whole group (Немає · Перегляд · Усе). Each page has a level in one click — Немає · Перегляд · Робота (create and edit) · Усе, offering only what the page has — and under it the page's real actions with their names from the server («Створювати КП», «Запускати зараз», «Змінювати статус і відмічати кроки»); «Вибірково» marks actions picked one by one, «змінено» an unsaved page.
- **Save bar:** sticks to the bottom while the role has changes: «N змін у ролі «…»: pages», «Показати зміни» (filter «Змінені»), «Скасувати», «Зберегти». A conflict (someone else saved) offers «Перезавантажити».
- **«Тільки адміністратор»:** the system pages and actions no role can be given (from the server's `adminOnly`), each with its reason.

«Нова роль», «Перейменувати» and «Копіювати з ролі…» open the side panel; a role made here is picked on «Користувачі» like a built-in one.

## How the rights are used

- The session loads `GET /api/auth/session/access` together with `/session/me` (`core/auth/session-transport.ts`); `canAccess(user, page, action)` answers from it, and the director has `allowAll`.
- The menu (`apps/admin-react/src/app/router/navigation/legacy-menu.ts`) names the page of every item (`access`); `navigation-config.ts` hides the items the user cannot see.
- `RequirePageAccess` (`router/require-page-access.tsx`) shows «Немає доступу» on a URL of a page the user cannot see; `page-access.ts` maps URLs to pages (the longest menu path, plus inner pages such as `/crm/clients`).
- Buttons: deleting a КП follows «Видаляти» on «Комерційні пропозиції»; «Передати в цех» needs «Створювати» on «Виробничі завдання» and seeing КП; the home blocks follow «Комерційні пропозиції» and «Виробничі завдання».
- «Користувачі», «Налаштування ШІ» and this page stay Admin only. «Завдання менеджерам» is its own page `manager-tasks` (it also gives «Нове завдання» and managing tasks on the «Мої завдання» board); the embroidery cost and «Налаштування» follow `embroidery-settings`; product photos follow «Редагувати» on «Товари». Business rules inside a page (a manager sees only their КП) still follow the built-in role; a role made here is treated like a manager there.
- After a save, a new role or a deletion the page calls `refreshSession`, so the admin's own menu updates at once; other people get the new rights on their next page load (the server checks every request anyway).

## Code structure

```text
libs/admin/core/auth/src/session/       # SessionAccess, canAccess, loading /session/access
apps/admin-react/src/app/router/        # legacy-menu access keys, navigation, page-access, require-page-access
libs/admin/users/
  model/src/entities/access-rights.ts   # areas (with action labels), roles (with people), admin-only items
  model/src/mappers/access-grants.ts    # draft actions, dirty check, counts per group
  model/src/queries/access-levels.ts    # Немає · Перегляд · Робота · Усе per page and per group
  model/src/queries/access-overview.ts  # search and filters, changed pages, role summary, compare cells
  model/src/validators/role-title-rules.ts
  data-access/src/api/access-rights.api.ts   # GET /api/admin/access, save, create, rename, delete roles
  ui/src/components/access-rights/      # roles/ (list, header, compare), rights/ (group, page row, level, toolbar),
                                        # page/ (header, save bar, «Тільки адміністратор»)
  ui/src/details/access-rights/access-role-panel.tsx   # the right column
  ui/src/panels/access/                 # «Нова роль», «Перейменувати», «Копіювати з ролі…»
  feature/src/access.routes.tsx         # createAccessRoutes({ onAccessChanged })
  feature/src/hooks/access/             # draft (levels, copy, changes), list view, mutations
  feature/src/pages/access-rights-page.tsx, components/access-rights-workspace.tsx
```

## Tests

- `npx nx test admin-core-auth`, `npx nx test admin-users-model`, `admin-users-data-access`, `admin-users-ui`, `admin-users-feature`.
- `npx nx test admin-react -- src/app/router` (menu and guards by the built-in defaults in `src/test/default-access.ts`).
