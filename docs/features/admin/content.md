# Admin: «Контент»

**Status:** implementation exists, checked 2026-11-11.

«Контент» is the sidebar group for the public site's content.

- **«Товари сайту»** (`/content/products`, «Права доступу» page `content-products`: Admin everything, Manager view). Every product of «Товари» with the «На сайті» switch and what its page still misses (only problems are marked). The side panel shows what the site takes from «Товари» (name, code, section, prices, fabrics) and the page itself; «Редагувати» changes the mark, the address and, in Ukrainian and Russian, the name, SEO title and description, short facts, description and characteristics. Nothing is typed as markup ([rule](../../standards/admin/admin-ui.md#texts-for-the-site-visual-editor-no-typed-markup)): the description is edited in the visual editor (heading, bold, italic, list), short facts and characteristics as rows of fields. The field «Розділи сайту» puts the product into one or several site categories; a product on the site without a category is marked «Немає розділу сайту». The list names each product's site categories under its section, and the filter «Розділ сайту» narrows it to one category with its subcategories or to products «Без розділу сайту» (kept in the URL as `category`; hidden without the right to see «Розділи сайту»). «Видалити сторінку» removes the texts, not the product. «Перенести зі старого сайту» (create right) loads the old-site texts and SEO from a file: the server first counts what would happen, «Перенести» writes. [SDD](../../specs/admin/content/001-product-pages/README.md), [API contract](../../specs/admin/content/001-product-pages/contracts/api-contract.md).
- **«Розділи сайту»** (`/content/categories`, «Права доступу» page `content-categories`: Admin everything, Manager view). The category tree of the public site, separate from «Типи і розділи»: categories with their subcategories, the «На сайті» switch, the number of products and what the site would miss (only problems are marked). «Додати розділ» and «Додати підрозділ» add, the arrows change the order among neighbours, the side panel edits the place in the tree, the address and, in Ukrainian and Russian, the name, SEO title and description and the text in the visual editor; «Видалити розділ» removes the category, not its products. A subcategory is on the site only together with its category. «Перенести зі старого сайту» (create right) loads the old-site tree with names, SEO, texts and the products of each category from a file: first a count, then «Перенести». The site does not read this tree yet (later stages). [SDD](../../specs/admin/content/002-site-categories/README.md).
- **«Статті»** (`/content/articles`, «Права доступу» page `content-articles`: Admin everything, Manager view). Articles of the public site, the newest first: cover, title, address, date, the «На сайті» switch and what the site would miss (only problems are marked). «Додати статтю» and the side panel edit the date, the address, the cover and, in Ukrainian and Russian, the title, the short text for lists, SEO title and description and the text in the visual editor. The cover and the photos of the text are chosen in the «Фото» library (button «Фото» of the editor), so every picture lives on our CDN; each photo of the text has its «Опис фото». «Видалити статтю» removes the article, not its photos. «Перенести зі старого сайту» brings the old-site articles from a prepared file: a count first, then the transfer in parts of three articles with their photos downloaded into «Фото». The site does not read these articles yet (stage 4). [SDD](../../specs/admin/content/003-articles/README.md).
- **«Конфіденційність та умови»** (`/content/legal`): cards for the BreviERP description, the privacy policy and the terms, with the edition date, «Відкрити» and «Копіювати посилання». The documents themselves stay static HTML ([public legal pages](public-legal-pages.md)).
- «Сторінки сайту» is shown as not yet available.

## Code structure

```text
libs/admin/content/model/src/
  entities/product-pages/content-product.ts        # row, editor, texts, viewer rights
  entities/product-pages/old-site-import.ts        # transfer report and options
  mappers/product-pages/old-site-import-file.ts    # reads and checks the transfer file
  queries/product-pages/content-product-query.ts   # list query, site and site-category filters, page sizes
  mappers/product-pages/content-rich-text.ts       # editor document <-> stored blocks, inline bold and italic
  mappers/product-pages/content-product-problems.ts # what the site would miss
  forms/product-pages/content-product-form.ts      # form values and the save body
  validators/product-pages/content-product-validation.ts # address rule and server limits
  entities|forms|validators|mappers/site-categories/ # category row and editor, form, limits, problems, search, move, transfer file
  entities|forms|validators|mappers/articles/      # article row and editor, form, limits, problems, search, body <-> editor document with photos
libs/admin/content/data-access/src/
  api/articles/, mappers/articles/                 # article endpoints and runtime-checked responses
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
  tables|forms|components/articles/, dialogs/article-delete-dialog.tsx # articles table, editor with cover and photos, view
libs/admin/content/feature/src/
  hooks|components|pages/articles/                 # article panel state, list page, side panel with the «Фото» library
  content.routes.tsx                               # createContentRoutes: /content/products, /content/categories, /content/articles, /content/legal
  hooks|components|pages/site-categories/          # category panel state, tree page, side panel
  hooks/product-pages/                             # list state in the URL, panel editor, old-site transfer
  hooks/old-site/use-old-site-transfer.ts          # file → count → «Перенести», shared by both transfers
  components/product-pages/                        # list content, side panel
  pages/product-pages/content-products-page.tsx
  model/legal-documents.ts, components/legal/, pages/legal/ # «Конфіденційність та умови»
apps/admin-react/src/app/router/
  legacy-menu.ts                                   # «Контент» group
  use-content-products-viewer.ts, use-site-categories-viewer.ts, use-articles-viewer.ts # rights from the session
libs/admin/shared/ui/src/inputs/rich-text-editor/  # visual editor; rich-text-photo.tsx is the photo block for texts with pictures
```

## Tests

- `libs/admin/content/model/src/**/*.unit.test.ts`
- `libs/admin/content/data-access/src/mappers/product-pages/*.unit.test.ts`
- `libs/admin/content/ui/src/components/product-pages/content-text-preview.component.test.tsx`
- `libs/admin/content/feature/src/components/product-pages/content-products-content.component.test.tsx`
- `libs/admin/content/feature/src/components/site-categories/site-categories-content.component.test.tsx`
- `libs/admin/content/feature/src/components/articles/articles-content.component.test.tsx`
- `libs/admin/shared/ui/src/inputs/rich-text-editor/rich-text-editor.component.test.tsx`
- `libs/admin/content/feature/src/pages/legal/legal-documents-page.component.test.tsx`
- `apps/admin-react/src/app/router/navigation-config.unit.test.ts`

Focused run: `npx nx test admin-content-model`, `admin-content-data-access`, `admin-content-ui`, `admin-content-feature`.
