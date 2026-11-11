# Admin: «Контент → Статті» (articles of the site)

**Status:** implemented and locally verified 2026-11-11. **Backend:** BreviERP CNT-004 (`docs/sdd/specs/content/004-articles`), stage 2 of its plan. **Contract:** [content-articles.openapi.yaml](../../../../contracts/openapi/backend/content/content-articles.openapi.yaml), operations `getContentArticles`, `getContentArticle`, `createContentArticle`, `saveContentArticle`, `setContentArticleVisibility`, `deleteContentArticle`.

## Goal

The owner asked on 2026-11-11 to manage the articles of the public site in the Admin: add and edit them, set their SEO, and keep their pictures on our CDN. The articles of the site are copied by hand into its code today, so staff cannot change one.

## Scope

- Page «Контент → Статті» at `/content/articles`, menu group «Контент».
- The list as one table: cover, title, address, date, what the site would miss, the «На сайті» switch.
- Side panel: view first, then «Редагувати»; «Додати статтю» opens it as a form; delete with a confirmation.
- The shared visual editor gets a «Фото» button for texts that may have pictures.

Not here (later stages of CNT-004): the transfer of the old-site articles and the site reading the articles. Until then the site keeps its own articles.

## Rules

- R-01: All articles are loaded at once, the newest date first. Search by title or address is done in the browser.
- R-02: Only problems are marked, and only for an article marked for the site: no cover, no Ukrainian text, no Russian title or text, no SEO.
- R-03: The «На сайті» switch saves at once.
- R-04: The form has the mark, the date readers see, the address, the cover and, per language, the title, the short text for lists, SEO title, SEO description and the text in the shared visual editor ([rule](../../../../standards/admin/admin-ui.md#texts-for-the-site-visual-editor-no-typed-markup)). The Ukrainian title is required. A new article may leave the address empty: the server builds it from the title; its date is today.
- R-05: Pictures come only from the «Фото» library: «Обрати обкладинку» and the «Фото» button of the editor open the library panel, where staff choose photos or upload new ones. A photo of the text is a block between paragraphs with the field «Опис фото» (alt text, up to 200 characters); several chosen photos are put one after another at the cursor. No link to a picture is typed, so no picture stays on another site.
- R-06: A photo that was deleted from the library is shown as a warning in the view, in the editor block and at the cover; the save is refused by the server until it is replaced or removed.
- R-07: Save sends the whole article with the revision that was opened. A stale revision, a taken address or a missing photo come back as the server's message in the panel.
- R-08: «Видалити статтю» asks for a confirmation that says the photos stay in the library and that hiding is the switch.
- R-09: «Права доступу», page `content-articles`: without «Створювати» there is no «Додати статтю»; without «Редагувати» the switch is disabled and the panel has no «Редагувати»; without «Видаляти» there is no «Видалити статтю». Defaults: Admin everything, Manager view.

## Scenarios

- SC-01: A manager opens the page and reads an article with its photo in the panel; nothing can be changed.
- SC-02: An admin adds an article with only the Ukrainian title and a cover from the library.
- SC-03: An admin switches an article on from the list.
- SC-04: An admin opens an article, puts a photo into the text with the «Фото» button and saves.
- SC-05: An admin deletes an article after the confirmation.

## File-role map

| Path                                                                                                                            | Role                                                           |
| ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `libs/admin/shared/ui/src/inputs/rich-text-editor/rich-text-photo.tsx`                                                          | photo block of the visual editor with the «Опис фото» field    |
| `libs/admin/shared/ui/src/inputs/rich-text-editor/` (editor, toolbar, extensions)                                               | optional `onPickImages`: the «Фото» button and the photo block |
| `libs/admin/content/model/src/entities/articles/article.ts`                                                                     | row, editor, blocks, viewer rights                             |
| `libs/admin/content/model/src/forms/articles/article-form.ts`                                                                   | form values and the save body                                  |
| `libs/admin/content/model/src/mappers/articles/article-rich-text.ts`                                                            | editor document <-> stored blocks with photos                  |
| `libs/admin/content/model/src/mappers/articles/article-list.ts`                                                                 | title, problems, search, date label                            |
| `libs/admin/content/model/src/validators/articles/article-validation.ts`                                                        | server limits, date, address                                   |
| `libs/admin/content/data-access/src/api/articles/`, `mappers/articles/`, `errors/article-api-error.ts`, `cache/article-tags.ts` | endpoints and runtime-checked responses                        |
| `libs/admin/content/ui/src/tables/articles/`, `forms/articles/`, `components/articles/`, `dialogs/article-delete-dialog.tsx`    | table, editor fields, read-only view, delete confirmation      |
| `libs/admin/content/feature/src/hooks/articles/use-article-editor.ts`                                                           | panel state: view, edit, save, delete                          |
| `libs/admin/content/feature/src/components/articles/`                                                                           | page content and the side panel with the «Фото» library        |
| `libs/admin/content/feature/src/pages/articles/articles-page.tsx`, `content.routes.tsx`                                         | route `/content/articles`                                      |
| `apps/admin-react/src/app/router/use-articles-viewer.ts`, `legacy-menu.ts`                                                      | rights from the session, menu entry                            |

## Tests

| Rule / scenario          | Test                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| R-02, R-04, R-05         | `libs/admin/content/model/src/**/articles/*.unit.test.ts`                                |
| contract shapes          | `libs/admin/content/data-access/src/mappers/articles/article.mapper.unit.test.ts`        |
| R-05 editor              | `libs/admin/shared/ui/src/inputs/rich-text-editor/rich-text-editor.component.test.tsx`   |
| SC-01..SC-05, R-03, R-09 | `libs/admin/content/feature/src/components/articles/articles-content.component.test.tsx` |
| menu and rights          | `apps/admin-react/src/app/router/navigation-config.unit.test.ts`                         |
