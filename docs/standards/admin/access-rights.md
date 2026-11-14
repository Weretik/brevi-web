# Admin: «Права доступу» in every feature

Every staff page of the Admin is controlled by «Права доступу» (`/admin/access`). The director grants each role «Бачить», «Створювати», «Редагувати» and «Видаляти» per page, and the server checks the same rights on every request. A new feature, or a change that adds a page, a tab or a button, must take part in this, or the director can't control it. The page itself is described in the [feature card](../../features/admin/access-rights.md).

## Where the rights come from

- The backend owns the list of pages (`AccessCatalog` in BreviERP) and their defaults, and guards every endpoint with `access:<page>[:<action>]`. Its checklist is in BreviERP `docs/sdd/architecture/security/authorization/roles-and-policies.md`, section «New feature or page».
- The session loads the signed-in user's rights from `GET /api/auth/session/access`. `canAccess(user, page, action = 'view')` from `@admin/core/auth` answers from them; the director has `allowAll`.
- The Admin never decides rights by role names for a work page. `user.roles.includes(…)` is only for users, «Права доступу», system settings and the rules inside a page (for example, a manager sees only their own КП).

## Checklist for a new feature or change

Decide the page key and its default rights in the SDD together with the backend. Then, in the same change:

1. **Backend first.** The page is in `AccessCatalog`, its endpoints carry `access:<page>`, and the contract is synced (`npm run contracts:sync`). Without the backend entry the page can't be granted.
2. **Menu.** Give the item in `apps/admin-react/src/app/router/navigation/legacy-menu.ts` an `access: '<page>'` key; `navigation-config.ts` hides it from users without «Бачить». Use `requiredRoles` only for Admin-only system pages.
3. **Route.** Put the routes inside the `RequirePageAccess` wrapper in `create-admin-router.tsx`. A URL resolves to a page by the longest menu path; a page reached only from inside another one (a detail page with another prefix, an old redirect) goes into `innerPages` in `router/page-access.ts`. Without that, the URL opens for everyone.
4. **Buttons and actions.** Hide a create, edit or delete control the role lacks; never show an action the server will refuse. `RequirePageAccess` provides the rights of the current route's page, and a feature reads them with `usePageRights()` from `@admin/shared/ui` (`canCreate`, `canEdit`, `canDelete`, or `can(action, '<other page>')` for an action on another page, such as adding to a КП). A screen that holds several pages under one route wraps each part in `<PageRightsScope page="<key>">`. Intersect page rights with any flag the server sends (`permissions.canMove && canCreate`). The shared «Цех» parts already follow them: `ReferenceDataGrid` and `ReferenceRowMenu` hide «Редагувати», «Видалити» and the checkbox column, `ReferenceBulkDeleteButton` hides itself, and `ReferenceEditorDrawer` hides «Редагувати» without the edit right. Pass `deleteRight="edit"` where the menu's last item archives or voids, and `editRight` (`'create'` or `null`) where the drawer's main button is not an edit. A page whose `AccessCatalog` entry has no «Створювати» or «Видаляти» (for example «Рахунки на закупку») checks `canEdit` for its writes, as the server does. Outside the app (component tests) every action is allowed.
5. **A part of an existing page** (tab, panel, card) reuses that page's key; a new key only when the director should grant it separately.
6. **Role rules inside a page** stay as they are, and the SDD says how a role made on «Права доступу» behaves there (today: like a manager).
7. **Tests.**
   - `navigation-config.unit.test.ts` covers the menu item for the right roles.
   - Router tests build users with `defaultAccess(roles)` from `apps/admin-react/src/test/default-access.ts`. Add the new page there with the same defaults as the backend's `AccessCatalog`.
   - Feature tests cover the hidden or disabled action.
8. **Docs.** The feature card names the page key and who gets it by default. The [«Права доступу» card](../../features/admin/access-rights.md) needs no change for an ordinary page.
