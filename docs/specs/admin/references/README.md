# Phased migration of Admin reference data

Each table has its own SDD under `$frontend-feature-spec`. Four old pages and their URLs are preserved; paired tables remain tabs on one page. Implementation follows the [menu](../navigation/001-legacy-menu/README.md) and depends on backend OpenAPI and frontend contract tooling.

| Order | Page                                 | Table / feature                                              |
| ----- | ------------------------------------ | ------------------------------------------------------------ |
| 1     | `/references/supplier`               | [Suppliers](001-suppliers/README.md)                         |
| 2     | `/references/garment-accessory`      | [Garment accessories](002-garment-accessories/README.md)     |
| 3     | Same page, “Тканини” tab             | [Fabrics](003-fabrics/README.md)                             |
| 4     | `/references/garment-part-operation` | [Garment parts](004-garment-parts/README.md)                 |
| 5     | Same page, “Роботи” tab              | [Operations](005-garment-part-operations/README.md)          |
| 6     | `/references/additional-reference`   | [Additional references](006-additional-references/README.md) |
| 7     | `/references/media`                  | [Media/photos](007-media/README.md)                          |

“Товари” has a separate [SDD](../products/001-products-table/README.md) because it is a menu item without a page in Angular Admin. The visual rules are [here](../table-visual-guidance.md).

The next agreed stage is captured in five separate change SDDs:

- [Fabrics and accessories](008-garment-materials-pages/README.md);
- [Operations: parts and work](009-operations-pages/README.md);
- [Suppliers](010-suppliers-pages/README.md) — SDD completed and closed, implementation partial;
- [Additional references](011-additional-references-pages/README.md);
- [Products](../products/003-products-table-pages/README.md) remains in the products domain.
