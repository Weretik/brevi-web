# Admin: «Контент»

**Status:** implementation exists, checked 2026-11-11.

«Контент» is the sidebar group for the public site's content.

- **«Товари сайту»** (`/content/products`, «Права доступу» page `content-products`: Admin everything, Manager view). Every product of «Товари» with the «На сайті» switch and what its page still misses (only problems are marked). The side panel shows what the site takes from «Товари» (name, code, section, prices, fabrics) and the page itself; «Редагувати» changes the mark, the address and, in Ukrainian and Russian, the name, SEO title and description, short facts, description and characteristics. Nothing is typed as markup ([rule](../../standards/admin/admin-ui.md#texts-for-the-site-visual-editor-no-typed-markup)): the description is edited in the visual editor (heading, bold, italic, list), short facts and characteristics as rows of fields. «Видалити сторінку» removes the texts, not the product. «Перенести зі старого сайту» (create right) loads the old-site texts and SEO from a file: the server first counts what would happen, «Перенести» writes. [SDD](../../specs/admin/content/001-product-pages/README.md), [API contract](../../specs/admin/content/001-product-pages/contracts/api-contract.md).
- **«Розділи сайту»** (`/content/categories`, «Права доступу» page `content-categories`: Admin everything, Manager view). The category tree of the public site, separate from «Типи і розділи»: categories with their subcategories, the «На сайті» switch, the number of products and what the site would miss (only problems are marked). «Додати розділ» and «Додати підрозділ» add, the arrows change the order among neighbours, the side panel edits the place in the tree, the address and, in Ukrainian and Russian, the name, SEO title and description and the text in the visual editor; «Видалити розділ» removes the category, not its products. A subcategory is on the site only together with its category. The site does not read this tree yet (later stages). [SDD](../../specs/admin/content/002-site-categories/README.md).
- **«Конфіденційність та умови»** (`/content/legal`): cards for the BreviERP description, the privacy policy and the terms, with the edition date, «Відкрити» and «Копіювати посилання». The documents themselves stay static HTML ([public legal pages](public-legal-pages.md)).
- «Сторінки сайту» is shown as not yet available.

## Code structure

```text
libs/admin/content/model/src/
  entities/product-pages/content-product.ts        # row, editor, texts, viewer rights
  entities/product-pages/old-site-import.ts        # transfer report and options
  mappers/product-pages/old-site-import-file.ts    # reads and checks the transfer file
  queries/product-pages/content-product-query.ts   # list query, site filter, page sizes
  mappers/product-pages/content-rich-text.ts       # editor document <-> stored blocks, inline bold and italic
  mappers/product-pages/content-product-problems.ts # what the site would miss
  forms/product-pages/content-product-form.ts      # form values and the save body
  validators/product-pages/content-product-validation.ts # address rule and server limits
  entities|forms|validators|mappers/site-categories/ # category row and editor, form, limits, problems, search, move
libs/admin/content/data-access/src/
  api/site-categories/, mappers/site-categories/   # category endpoints and runtime-checked responses
  api/                                             # content API on adminApi, product page endpoints
  mappers/product-pages/content-product.mapper.ts  # runtime-checked responses
  mappers/product-pages/old-site-import.mapper.ts  # transfer report
  validators/content-response.ts, errors/, cache/
libs/admin/content/ui/src/
  tables/product-pages/content-products-table.tsx  # list with the «На сайті» switch
  components/product-pages/                        # read-only view, text preview, language tabs
  forms/product-pages/content-product-form.tsx     # editor fields with hints
  forms/product-pages/content-facts-editor.tsx     # short facts as rows of fields
  forms/product-pages/content-specs-editor.tsx     # characteristics: groups with rows of fields
  dialogs/content-product-delete-dialog.tsx
  dialogs/old-site-import-dialog.tsx               # file, options, count, «Перенести»
  tables|forms|components/site-categories/, dialogs/site-category-delete-dialog.tsx # tree table, editor, view
libs/admin/content/feature/src/
  content.routes.tsx                               # createContentRoutes: /content/products, /content/categories, /content/legal
  hooks|components|pages/site-categories/          # category panel state, tree page, side panel
  hooks/product-pages/                             # list state in the URL, panel editor, old-site transfer
  components/product-pages/                        # list content, side panel
  pages/product-pages/content-products-page.tsx
  model/legal-documents.ts, components/legal/, pages/legal/ # «Конфіденційність та умови»
apps/admin-react/src/app/router/
  legacy-menu.ts                                   # «Контент» group
  use-content-products-viewer.ts, use-site-categories-viewer.ts # rights from the session
```

## Tests

- `libs/admin/content/model/src/**/*.unit.test.ts`
- `libs/admin/content/data-access/src/mappers/product-pages/*.unit.test.ts`
- `libs/admin/content/ui/src/components/product-pages/content-text-preview.component.test.tsx`
- `libs/admin/content/feature/src/components/product-pages/content-products-content.component.test.tsx`
- `libs/admin/content/feature/src/components/site-categories/site-categories-content.component.test.tsx`
- `libs/admin/content/feature/src/pages/legal/legal-documents-page.component.test.tsx`
- `apps/admin-react/src/app/router/navigation-config.unit.test.ts`

Focused run: `npx nx test admin-content-model`, `admin-content-data-access`, `admin-content-ui`, `admin-content-feature`.
