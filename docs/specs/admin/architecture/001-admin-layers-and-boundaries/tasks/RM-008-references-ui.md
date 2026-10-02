# RM-008 — References UI та feature separation

- **Findings:** AF-005
- **Requirements:** AR-003
- **Depends on:** RM-006
- **Exact paths:** `libs/admin/references/ui/src/components/<capability>/`,
  `references/ui/src/hooks/reference-row-actions/`,
  `references/feature/src/{pages,components,hooks}/<capability>/`, tests.

## Work

- [x] Перенести reusable grids/forms/details/drawers/dialog presentation до UI.
- [x] Залишити route/tab/editor/delete/query orchestration у feature.
- [x] Передавати domain models, errors, loading і callbacks через typed props;
      UI не імпортує data-access або router.

## Evidence

- Reference grids, shared editor shell, forms, details, row menu й delete dialogs
  розміщені у `admin-references-ui`; feature володіє query/editor orchestration.
- Shared drawer має owner `components/reference-editor`; row menu і його hook
  мають owner `reference-row-actions`, а не лежать у корені role-каталогів.
- UI має focused test і executable lint/typecheck/typecheck-tests/test targets;
  graph показує єдину dependency на reference model.
- Feature згруповано спочатку за роллю, потім за capability:
  `pages/components/hooks/<reference-module>`; tests залишені поруч із page.

## Checkpoint

Reference UI має чистий dependency direction; усі six-table component/E2E
regressions зберігають поточну поведінку.
