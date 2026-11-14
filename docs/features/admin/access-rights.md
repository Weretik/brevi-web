# Admin: «Права доступу»

**Status:** implementation exists, checked 2026-11-08. Backend: BreviERP `docs/sdd/features/identity/access-rights.md` (ACC-001, client corrections item 11).

Admin and the director only: «Адміністрування → Права доступу» (`/admin/access`). A tab per role (the selected one is kept as `?role=`); the pages are grouped in cards in menu order («Менеджер сервісу», «Швейний цех», «Бухгалтерія», «Нагадування», «Загальні довідники», «Фото»). Each page row has a «Бачить» switch and only the actions the page has: «Створювати», «Редагувати», «Видаляти». Turning «Бачить» off clears the page; «Зберегти» saves one role and answers a conflict (someone else saved) with «Перезавантажити». The director tab is read only: the director always has every right.

«Нова роль» opens a side panel with «Назва ролі»; a role made here is picked on «Користувачі» like a built-in one. «Видалити роль» is only for a role made here, and only once no user has it. Built-in roles are never deleted.

## How the rights are used

- The session loads `GET /api/auth/session/access` together with `/session/me` (`core/auth/session-transport.ts`); `canAccess(user, page, action)` answers from it, and the director has `allowAll`.
- The menu (`apps/admin-react/src/app/router/navigation/legacy-menu.ts`) names the page of every item (`access`); `navigation-config.ts` hides the items the user cannot see.
- `RequirePageAccess` (`router/require-page-access.tsx`) shows «Немає доступу» on a URL of a page the user cannot see; `page-access.ts` maps URLs to pages (the longest menu path, plus inner pages such as `/crm/clients`).
- Buttons: deleting a КП follows «Видаляти» on «Комерційні пропозиції»; «Передати в цех» needs «Створювати» on «Виробничі завдання» and seeing КП; the home blocks follow «Комерційні пропозиції» and «Виробничі завдання».
- «Користувачі», «Завдання менеджерам», «Налаштування ШІ» and this page stay Admin only. Business rules inside a page (a manager sees only their КП) still follow the built-in role; a role made here is treated like a manager there.
- After a save, a new role or a deletion the page calls `refreshSession`, so the admin's own menu updates at once; other people get the new rights on their next page load (the server checks every request anyway).

## Code structure

```text
libs/admin/core/auth/src/session/       # SessionAccess, canAccess, loading /session/access
apps/admin-react/src/app/router/        # legacy-menu access keys, navigation, page-access, require-page-access
libs/admin/users/
  model/src/entities/access-rights.ts   # areas, roles, action labels
  model/src/mappers/access-grants.ts    # draft: «Бачить» and actions, dirty check, counts per group
  model/src/validators/role-title-rules.ts
  data-access/src/api/access-rights.api.ts   # GET /api/admin/access, save, create and delete roles
  ui/src/components/access-rights/      # role tabs, group card, page row
  ui/src/panels/new-role-panel.tsx      # «Нова роль»
  feature/src/access.routes.tsx         # createAccessRoutes({ onAccessChanged })
  feature/src/pages/access-rights-page.tsx
```

## Tests

- `npx nx test admin-core-auth`, `npx nx test admin-users-model`, `admin-users-data-access`, `admin-users-ui`, `admin-users-feature`.
- `npx nx test admin-react -- src/app/router` (menu and guards by the built-in defaults in `src/test/default-access.ts`).
