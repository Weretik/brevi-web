# Admin: «Контент»

**Status:** implementation exists, checked 2026-11-11.

«Контент» is the sidebar group for the public site's content.

- **«Товари сайту»** (`/content/products`, «Права доступу» page `content-products`: Admin everything, Manager view). Every product of «Товари» with the «На сайті» switch and what its page still misses (only problems are marked). The side panel shows what the site takes from «Товари» (name, code, section, prices, fabrics) and the page itself; «Редагувати» changes the mark, the address and, in Ukrainian and Russian, the name, SEO title and description, short facts, description and characteristics. Long texts are plain text with light marks (`## `, `- `, `**…**`, «Назва: значення»). «Видалити сторінку» removes the texts, not the product. «Перенести зі старого сайту» (create right) loads the old-site texts and SEO from a file: the server first counts what would happen, «Перенести» writes. [SDD](../../specs/admin/content/001-product-pages/README.md), [API contract](../../specs/admin/content/001-product-pages/contracts/api-contract.md).
- **«Конфіденційність та умови»** (`/content/legal`): cards for the BreviERP description, the privacy policy and the terms, with the edition date, «Відкрити» and «Копіювати посилання». The documents themselves stay static HTML ([public legal pages](public-legal-pages.md)).
- «Сторінки сайту» is shown as not yet available.

## Code structure

```text
libs/admin/content/model/src/
  entities/product-pages/content-product.ts        # row, editor, texts, viewer rights
  entities/product-pages/old-site-import.ts        # transfer report and options
  mappers/product-pages/old-site-import-file.ts    # reads and checks the transfer file
  queries/product-pages/content-product-query.ts   # list query, site filter, page sizes
  mappers/product-pages/content-text-markup.ts     # plain text <-> facts, blocks, spec groups
  mappers/product-pages/content-product-problems.ts # what the site would miss
  forms/product-pages/content-product-form.ts      # form values and the save body
  validators/product-pages/content-product-validation.ts # address rule and server limits
libs/admin/content/data-access/src/
  api/                                             # content API on adminApi, product page endpoints
  mappers/product-pages/content-product.mapper.ts  # runtime-checked responses
  mappers/product-pages/old-site-import.mapper.ts  # transfer report
  validators/content-response.ts, errors/, cache/
libs/admin/content/ui/src/
  tables/product-pages/content-products-table.tsx  # list with the «На сайті» switch
  components/product-pages/                        # read-only view, text preview, language tabs
  forms/product-pages/content-product-form.tsx     # editor fields with hints
  dialogs/content-product-delete-dialog.tsx
  dialogs/old-site-import-dialog.tsx               # file, options, count, «Перенести»
libs/admin/content/feature/src/
  content.routes.tsx                               # createContentRoutes: /content/products, /content/legal
  hooks/product-pages/                             # list state in the URL, panel editor, old-site transfer
  components/product-pages/                        # list content, side panel
  pages/product-pages/content-products-page.tsx
  model/legal-documents.ts, components/legal/, pages/legal/ # «Конфіденційність та умови»
apps/admin-react/src/app/router/
  legacy-menu.ts                                   # «Контент» group
  use-content-products-viewer.ts                   # rights from the session
```

## Tests

- `libs/admin/content/model/src/**/*.unit.test.ts`
- `libs/admin/content/data-access/src/mappers/product-pages/*.unit.test.ts`
- `libs/admin/content/ui/src/components/product-pages/content-text-preview.component.test.tsx`
- `libs/admin/content/feature/src/components/product-pages/content-products-content.component.test.tsx`
- `libs/admin/content/feature/src/pages/legal/legal-documents-page.component.test.tsx`
- `apps/admin-react/src/app/router/navigation-config.unit.test.ts`

Focused run: `npx nx test admin-content-model`, `admin-content-data-access`, `admin-content-ui`, `admin-content-feature`.
