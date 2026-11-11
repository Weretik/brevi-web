# Admin: «Контент → Розділи» (categories of the site catalog)

**Status:** implemented and locally verified 2026-11-11. **Backend:** BreviERP [CNT-003](https://github.com/Weretik/BreviERP/blob/e6bd361411744e2db8bdc2c2e6afeb5721f4e6ad/docs/sdd/specs/content/003-site-categories/README.md), stage 2 of its plan. **Contract:** [content-categories.openapi.yaml](../../../../contracts/openapi/backend/content/content-categories.openapi.yaml), operations `getSiteCategories`, `getSiteCategory`, `createSiteCategory`, `saveSiteCategory`, `setSiteCategoryVisibility`, `reorderSiteCategories`, `deleteSiteCategory`.

## Goal

The owner asked on 2026-11-11 to manage the categories and subcategories of the public site in the Admin the same way as products: decide which ones the site shows, edit their SEO and texts, and fully control the tree (add, change, move, delete, hide). The tree belongs to the site and is not «Типи і розділи».

## Scope

- Page «Контент → Розділи сайту» at `/content/categories`, menu group «Контент».
- The tree as one table: categories with their subcategories under them, the «На сайті» switch, the number of products, what the site would miss, arrows for the order.
- Side panel: view first, then «Редагувати»; «Додати розділ» and «Додати підрозділ» open it as a form; delete with a confirmation.

Not here (later stages of CNT-003): choosing the categories of a product, the old-site transfer, the public API and the site reading this tree. Until then the site keeps its current tree.

## Rules

- R-01: The whole tree is loaded at once (two levels, up to 500 rows). Search by name or address is done in the browser and keeps the category of a found subcategory.
- R-02: Only problems are marked, and only for a category marked for the site: its category is hidden, no Russian name, no products, no SEO.
- R-03: The «На сайті» switch saves at once. A subcategory whose category is hidden gets a warning that the site will not show it.
- R-04: The arrows move a category one step among its neighbours and save the whole order of that parent. They are disabled at the edges and while a search is on.
- R-05: The form has the mark, «Де стоїть» (top level or a subcategory of a top-level category), the address and, per language, the name, SEO title, SEO description and the text in the shared visual editor ([rule](../../../../standards/admin/admin-ui.md#texts-for-the-site-visual-editor-no-typed-markup)). The Ukrainian name is required. A new category may leave the address empty: the server builds it from the name. A category with subcategories cannot be moved under another one.
- R-06: Save sends the whole category with the revision that was opened. A stale revision, a taken address or a refused move come back as the server's message in the panel.
- R-07: «Видалити розділ» asks for a confirmation that says products stay and that hiding is the switch. The server refuses a category with subcategories and its message is shown.
- R-08: «Права доступу», page `content-categories`: without «Створювати» there are no add buttons; without «Редагувати» the switch and arrows are disabled and the panel has no «Редагувати»; without «Видаляти» there is no «Видалити розділ». Defaults: Admin everything, Manager view.

## Scenarios

- SC-01: A manager opens the page and reads a category in the panel; nothing can be changed.
- SC-02: An admin adds a category, then a subcategory under it with only the Ukrainian name.
- SC-03: An admin switches a subcategory on while its category is hidden and sees the warning.
- SC-04: An admin moves a subcategory down and a category up.
- SC-05: An admin edits the Russian name and the text in the visual editor and saves.
- SC-06: An admin deletes a subcategory after the confirmation.

## File-role map

| Path                                                                                                 | Role                                 |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `libs/admin/content/model/src/entities/site-categories/site-category.ts`                             | row, editor, texts, viewer rights    |
| `libs/admin/content/model/src/forms/site-categories/site-category-form.ts`                           | form values, new form, save body     |
| `libs/admin/content/model/src/validators/site-categories/site-category-validation.ts`                | name, address and server limits      |
| `libs/admin/content/model/src/mappers/site-categories/site-category-tree.ts`                         | problems, search, one-step move      |
| `libs/admin/content/data-access/src/api/site-categories/site-category-endpoints.ts`                  | endpoints on the content API         |
| `libs/admin/content/data-access/src/mappers/site-categories/site-category.mapper.ts`                 | runtime-checked responses            |
| `libs/admin/content/data-access/src/{cache/site-category-tags.ts,errors/site-category-api-error.ts}` | cache tags, error texts              |
| `libs/admin/content/ui/src/tables/site-categories/site-categories-table.tsx`                         | tree table                           |
| `libs/admin/content/ui/src/forms/site-categories/site-category-form.tsx`                             | editor fields                        |
| `libs/admin/content/ui/src/components/site-categories/site-category-view.tsx`                        | read-only panel                      |
| `libs/admin/content/ui/src/dialogs/site-category-delete-dialog.tsx`                                  | delete confirmation                  |
| `libs/admin/content/feature/src/hooks/site-categories/use-site-category-editor.ts`                   | panel state: view, edit, new, delete |
| `libs/admin/content/feature/src/components/site-categories/`                                         | page content and side panel          |
| `libs/admin/content/feature/src/pages/site-categories/site-categories-page.tsx`                      | route page                           |
| `apps/admin-react/src/app/router/use-site-categories-viewer.ts`                                      | rights from the session              |

## Verification

`npx nx run-many -t typecheck,lint,test -p admin-content-model,admin-content-data-access,admin-content-ui,admin-content-feature`, `npx nx test admin-react -- navigation-config`, `npm run docs:check`, `npm run contracts:check`.
