# React Admin migration sequence

This index does not replace individual SDDs. Each table has its own rules, API contract, tasks, and verification criteria. Four reference-data pages retain their old URLs, while two pairs of tables share pages with tabs.

| Step | SDD                                                                     | What becomes available                                           |
| ---- | ----------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1    | [Menu and header](navigation/001-legacy-menu/README.md)                 | All old items are visible; only the existing `/` is active       |
| 2    | [Suppliers](references/001-suppliers/README.md)                         | `/references/supplier`, including selection data for later forms |
| 3    | [Garment accessories](references/002-garment-accessories/README.md)     | `/references/garment-accessory`, first tab                       |
| 4    | [Fabrics](references/003-fabrics/README.md)                             | Second tab on the same page                                      |
| 5    | [Garment parts](references/004-garment-parts/README.md)                 | `/references/garment-part-operation`, “Елементи” tab             |
| 6    | [Operations](references/005-garment-part-operations/README.md)          | “Роботи” tab on the same page                                    |
| 7    | [Additional references](references/006-additional-references/README.md) | `/references/additional-reference`                               |
| 8    | [Products](products/001-products-table/README.md)                       | New `/references/products` with backend CRUD support             |

At each step, a menu item becomes active only after a real React route exists. Items that have not been migrated remain unavailable. Backend OpenAPI for Reference operations is missing, and the local product contract is not committed to Git. Before API integration, each SDD therefore requires its own `operationId` values, pinned backend commit, frontend snapshot, and generated types. The shared [contract-tooling enabler](references/001-suppliers/tasks/EN-002-contract-tooling.md) runs once and is reused by all table features.
