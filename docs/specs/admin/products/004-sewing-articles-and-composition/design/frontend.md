# Frontend design

The current [Admin product feature](../../../../../features/admin/products/products.md) uses `products/feature` for scenarios, `products/ui` for presentation, `products/model` for application types/drafts and `products/data-access` for API/mapping. Continue those boundaries. Existing routes `/references/products/:id`, `/:id/edit` and `/create` stay; add Article and composition sections in the existing detail/edit flow, not another product master screen.

## State and interaction

- Base Product form remains on its existing create/replace API and local `ProductDraft`. Article/composition edits use separate draft state, mutation and concurrency token; closing or switching Article with dirty input prompts through the existing Admin pattern.
- Resolve selected Article ID in feature state. Render model-wide lines once and effective lines for the selected Article. Distinguish a physical material from `Other cost` with text and appropriate controls.
- Use the existing reference lookup data for fabric/accessory/operation selection where supported, with a focused extension only if the approved backend contract needs new fields. Display blocked/missing references without coercing them to a valid choice.
- Server validation maps at `data-access`; feature decides when to show error/empty/loading/dirty states; `ui` renders accessible fields and messages. No generated API DTO import in `feature` or `ui`.
- Keep responsive page sections and MUI controls consistent with [Admin UI rules](../../../../../standards/admin/admin-ui.md) and use Ukrainian labels.

## Key path map

**Implemented navigation decision, 2026-10-25:** EN-003 changes the application composition root to a React Router data router while preserving domain routes and lazy pages. The Sewing feature uses one navigation blocker for dirty/in-flight work, covering browser history and SPA links; scope switching has its local confirmation and browser unload has `beforeunload`. This replaces the draft assumption that a shared Admin dirty-state pattern already existed. The [feature card](../../../../../features/admin/products/sewing-composition.md) records actual paths.

| Frontend path                                                                  | State                        | Responsibility                                                              |
| ------------------------------------------------------------------------------ | ---------------------------- | --------------------------------------------------------------------------- |
| `libs/admin/products/feature/src/pages/product-detail/product-detail-page.tsx` | Existing, change             | Add Article list and effective composition section.                         |
| `libs/admin/products/feature/src/components/product-editor/product-editor.tsx` | Existing, guarded change     | Keep base Product save path independent from composition save.              |
| `libs/admin/products/feature/src/components/`                                  | Planned focused component    | Article selection/editor and composition form orchestration.                |
| `libs/admin/products/ui/src/`                                                  | Planned focused components   | Article list, scoped lines, validation and readiness display.               |
| `libs/admin/products/model/src/`                                               | Planned model                | Article/composition draft and view types, validation and dirty-state rules. |
| `libs/admin/products/data-access/src/api/products.api.ts`                      | Existing, change or split    | Add approved Article/composition operations and cache invalidation.         |
| `libs/admin/products/data-access/src/mappers/`                                 | Existing plus planned mapper | Runtime-validated API result to application model.                          |
| `libs/admin/shared/contracts/src/generated/openapi.ts`                         | Generated, never hand-edit   | Types from pinned backend OpenAPI snapshot.                                 |

The list/detail/product editor already exist; do not rebuild or duplicate them. If the feature component grows too large, split only the Article/composition orchestration while retaining Product base-field responsibilities. Check project graph and exact Nx targets before implementation.
