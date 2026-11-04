# Admin: «Контент»

**Status:** implementation exists, checked 2026-11-04.

«Контент» is the sidebar group for the public site's content. Today it holds «Конфіденційність та умови» (`/content/legal`): cards for the BreviERP description, the privacy policy and the terms, with the edition date, «Відкрити» and «Копіювати посилання». The documents themselves stay static HTML ([public legal pages](public-legal-pages.md)); the profile menu no longer links to them. «Сторінки сайту» is shown as not yet available until the Next.js site gets its content API.

## Code structure

```text
libs/admin/content/feature/src/
  content.routes.tsx                         # /content/legal
  model/legal-documents.ts                   # the three documents, paths and edition
  components/legal/legal-document-card.tsx   # open and copy link
  pages/legal/legal-documents-page.tsx
apps/admin-react/src/app/router/legacy-menu.ts # «Контент» group
```

## Tests

- `libs/admin/content/feature/src/pages/legal/legal-documents-page.component.test.tsx`

Focused run: `npx nx test admin-content-feature`.
