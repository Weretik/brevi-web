# RM-003 — Products domain model boundary

- **Findings:** AF-002
- **Requirements:** AR-002
- **Depends on:** RM-001, RM-002
- **Exact paths:** `libs/admin/products/model/src/product-editor/`,
  `product-media/`, `sewing/`, `ordering/`, product consumers/tests.

## Work

- [x] Створити `admin-products-model` із entities, query types, defaults,
      invariants і pure validators/mappers, що не залежать від React/HTTP/browser.
- [x] Замінити exported aliases на generated schemas власними domain contracts.
- [x] Залишити transport request/response types private у data-access і оновити
      DTO→domain mappers/runtime validation.
- [x] Класифікувати browser-dependent media validation окремо; не переносити
      `File` API у pure model.

## Evidence

- Product entities/drafts/queries/collections/validators мають canonical owner у
  `@admin/products/model`; `File` validation лишилась у feature.
- Model tests і mapper/integration tests пройшли; generated DTO imports знайдені
  лише в data-access.

## Checkpoint

Feature/UI імпортують products contracts із `@admin/products/model`; generated
types використовуються лише у data-access; product model unit tests green.
