# Admin: «Права доступу» in every feature

Every staff page of the Admin is controlled by «Права доступу» (`/admin/access`). The director grants each role «Бачить», «Створювати», «Редагувати» and «Видаляти» per page, and the server checks the same rights on every request. A new feature, or a change that adds a page, a tab or a button, must take part in this, or the director can't control it. The page itself is described in the [feature card](../../features/admin/access-rights.md).

## Where the rights come from

- The backend owns the list of pages (`AccessCatalog` in BreviERP) and their defaults, and guards every endpoint with `access:<page>[:<action>]`. Its checklist is in BreviERP `docs/sdd/architecture/security/authorization/roles-and-policies.md`, section «New feature or page».
- The session loads the signed-in user's rights from `GET /api/auth/session/access`. `canAccess(user, page, action = 'view')` from `@admin/core/auth` answers from them; the director has `allowAll`.
- The Admin never decides rights by role names for a work page. `user.roles.includes(…)` is only for users, «Права доступу», system settings and the rules inside a page (for example, a manager sees only their own КП).

## Checklist for a new feature or change

Decide the page key and its default rights in the SDD together with the backend. Then, in the same change:

1. **Backend first.** The page is in `AccessCatalog`, its endpoints carry `access:<page>`, and the contract is synced (`npm run contracts:sync`). Without the backend entry the page can't be granted.
2. **Menu.** Give the item in `apps/admin-react/src/app/router/legacy-menu.ts` an `access: '<page>'` key; `navigation-config.ts` hides it from users without «Бачить». Use `requiredRoles` only for Admin-only system pages.
3. **Route.** Put the routes inside the `RequirePageAccess` wrapper in `create-admin-router.tsx`. A URL resolves to a page by the longest menu path; a page reached only from inside another one (a detail page with another prefix, an old redirect) goes into `innerPages` in `router/page-access.ts`. Without that, the URL opens for everyone.
4. **Buttons and actions.** Hide or disable a create, edit or delete control with `canAccess(user, '<page>', 'create' | 'edit' | 'delete')`. The app passes it into the feature through the actor hook it already gives (`use-quote-actor.ts`, `use-production-order-actor.ts`, …), because a feature library may not import `@admin/core/auth`. Never show an action the server will refuse.
5. **A part of an existing page** (tab, panel, card) reuses that page's key; a new key only when the director should grant it separately.
6. **Role rules inside a page** stay as they are, and the SDD says how a role made on «Права доступу» behaves there (today: like a manager).
7. **Tests.**
   - `navigation-config.unit.test.ts` covers the menu item for the right roles.
   - Router tests build users with `defaultAccess(roles)` from `apps/admin-react/src/test/default-access.ts`. Add the new page there with the same defaults as the backend's `AccessCatalog`.
   - Feature tests cover the hidden or disabled action.
8. **Docs.** The feature card names the page key and who gets it by default. The [«Права доступу» card](../../features/admin/access-rights.md) needs no change for an ordinary page.
