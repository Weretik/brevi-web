# Admin React: photo library with folders (MED-001, stage 2)

**Status:** implemented and locally verified 2026-11-03. Backend: BreviERP
`docs/sdd/specs/media/001-media-library/README.md` (stage 1). Consumer
contract: [api-contract.md](contracts/api-contract.md).

## Why

Photos lived in «Довідники → Медіа/Фото» as one flat gallery that loaded every
photo and searched only in the browser. The owner asked (2026-11-03) for a
separate place with folders and subfolders, a visible folder tree, search by
name or by folder, and a library that product settings can pick photos from
later.

## Scenario

1. The sidebar has its own group «Фото» with «Бібліотека фото» (`/media`).
   The old link `/references/media` redirects there.
2. The left column shows «Усі фото» and the folder tree with photo counts
   (including subfolders). A folder opens with its parents and children
   expanded. Below `lg` the tree sits above the photos.
3. The search row searches photo names on the server, inside the open folder;
   chips «З підпапками» / «Лише ця папка» choose the scope. Folder, search,
   scope and page are kept in the URL (`?folder=&q=&sub=0&page=`).
4. «Завантажити фото» uploads one or many JPEG/PNG/WebP files up to 15 MB into
   the open folder, one after another, with progress and a list of failures.
5. A photo click opens the side panel: big preview, facts, «Де
   використовується» (products), copy link and open original. «Редагувати»
   changes name, alt text and folder.
6. Selecting photos shows «Перемістити» (side panel with the target folder) and
   «Видалити N» (confirmation). A used photo is refused by the server and the
   message names the product.
7. The folder menu (⋮) offers «Нова підпапка», «Перейменувати або перемістити»
   and «Видалити папку». A folder with photos or subfolders is not deleted; the
   move list leaves out the folder itself and its subfolders; the depth limit
   is 8 levels, as on the backend.

## Rules

| ID   | Rule                                                                                                                               |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------- |
| R-01 | Folders are virtual; moving or renaming never changes a photo URL.                                                                 |
| R-02 | Search and paging run on the server (48 per page).                                                                                 |
| R-03 | Name rules match the backend: trimmed, no `/` or `\\`, folder 120, photo 255, alt 300 characters.                                  |
| R-04 | Forms open in the shared side panel `ReferenceEditorDrawer`; dialogs only confirm deletion.                                        |
| R-05 | The product editor keeps its photo dropdown for now; it reads all library pages. Stage 4 replaces it with a «Вибрати фото» picker. |

## Code

New libraries `libs/admin/media/{model,data-access,ui,feature}` (scaffolded
with `nx g @nx/react:library`, then aligned with the other domains). The old
page and its components under `libs/admin/products` were removed;
`product-media.api.ts` now calls `/api/media/files`. See the
[feature card](../../../../features/admin/media.md).

## Verification

- `npx nx run-many -t test lint typecheck typecheck-tests -p admin-media-model admin-media-data-access admin-media-ui admin-media-feature` — green.
- `npx nx test admin-products-data-access`, `npx nx test admin-react -- src/app/router` — green.
- `npx nx test admin-products-feature` — one failure, `use-product.unit.test.tsx`, fails the same way on `master`.
- `npm run contracts:check` — snapshot `8e3cd1aa8525d0069c75da1570049388457da1f2`.
- E2E specs updated (`media.spec.ts`, `products.spec.ts`), not run.

## Next stages

- Stage 3: thumbnails and image dimensions (backend), grid uses thumbnails.
- Stage 4: «Вибрати фото» picker in the product card, after the «Товари» work ends.
