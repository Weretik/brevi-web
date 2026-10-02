# RM-007 — Products UI та feature separation

- **Findings:** AF-005
- **Requirements:** AR-003
- **Depends on:** RM-005
- **Exact paths:** `libs/admin/products/ui/src/{product-list,product-editor,product-detail,product-content,media}/`,
  `products/feature/src/{pages,components,hooks,model}/<capability>/`, tests.

## Work

- [x] Перенести reusable forms, fields, tables, details, dialogs і states до
      products UI як typed presentation contracts.
- [x] Залишити page/router/API mutation coordination і local workflow state у feature.
- [x] Розділити editor/delete/upload containers від presentation; UI отримує
      values/errors/loading/callbacks і не імпортує data-access/router.

## Evidence

- Product fields/details/media presentation перенесені до `admin-products-ui`;
  photo upload передається presentation-компоненту typed render callback.
- Feature спочатку розділено за ролями, а всередині `pages/components/hooks`
  файли згруповані за capability; tests лежать поруч із page/component/hook
  свого рівня.
- UI lint/typecheck/test і product feature 17/17 tests пройшли; graph показує
  лише model dependencies для UI.

## Checkpoint

Products UI залежить лише від model/UI-safe shared modules; feature regression
підтверджує незмінні create/edit/detail/list/media flows.
