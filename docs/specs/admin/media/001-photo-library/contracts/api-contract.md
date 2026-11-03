# Consumer contract: photo library

- **Canonical OpenAPI:** `docs/sdd/contracts/media/media-library.openapi.yaml` in
  `https://github.com/Weretik/BreviERP.git`, commit `8e3cd1aa8525d0069c75da1570049388457da1f2`
  (PR #27, stage 1).
- **Snapshot:** `docs/contracts/openapi/backend/media/`, types in `@admin/shared/contracts`.

| operationId       | Admin use                                       | Cache                                      |
| ----------------- | ----------------------------------------------- | ------------------------------------------ |
| getMediaFolders   | Folder tree, folder selects                     | provides `MediaFolder` LIST                |
| createMediaFolder | «Нова папка», «Нова підпапка»                   | invalidates folders                        |
| updateMediaFolder | Rename and move a folder                        | invalidates folders                        |
| deleteMediaFolder | «Видалити папку» (only empty)                   | invalidates folders                        |
| searchMediaFiles  | Photo grid: folder, subfolders, search, page 48 | provides `MediaFile` LIST and ids          |
| getMediaFile      | Side panel with usages                          | provides `MediaFile` id                    |
| uploadMediaFile   | «Завантажити фото», product editor upload       | invalidates photos and folder counts       |
| updateMediaFile   | «Редагувати» in the side panel                  | invalidates photos, folder counts, the id  |
| moveMediaFiles    | «Перемістити» for selected photos               | invalidates photos, folder counts, the ids |
| deleteMediaFile   | «Видалити N»                                    | invalidates photos, folder counts, the id  |

`data-access/src/mappers` validate every field at runtime and return
`@admin/media/model` types. Errors: 400 shows the backend's first field
message (for example a fake image), 404 says the folder or photo is gone, 409
keeps the backend reason (photo used by «Товари», duplicate folder name,
depth limit, non-empty folder). The products library keeps its own
`listProductMedia` (all pages of `searchMediaFiles`, pageSize 100) and
`uploadProductMedia` for the current product editor.
