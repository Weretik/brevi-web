# Site: «Сертифікати» page

**Status:** code exists, checked 2026-11-10. Specification: [«Сертифікати» page](../../specs/site/certificates/001-certificates/README.md).

`/uk/certificates` and `/ru/certificates` show the eight documents on Brevi workwear: type examination certificates, declarations of conformity, annexes with the fabric lists, and sanitary conclusions, each for clothing against general industrial dirt and against low temperatures. A card shows the scan, the document name, the clothing it covers, and its standards; the scan opens in a new tab. A closing block says certified copies come with the shipment and links to «Контакти». Text and scans are from the live `brevi.com.ua` page. The page is static and reads no API.

## Structure diagram

```mermaid
flowchart LR
  Route["apps/site: [locale]/certificates/page.tsx"] --> Feature["site-certificates-feature: CertificatesPage"]
  Route --> PageSeo["site-certificates-seo: metadata"]
  Feature --> Ui["site-certificates-ui: document cards, copies block, dictionary"]
  Feature --> Seo["site-core-seo: JsonLd, BreadcrumbList"]
  Feature --> Shared["site-shared-ui: PageHeader, PageSection"]
  Ui --> Scans["apps/site/public/assets/certificates"]
```

## Code structure

```text
apps/site/src/app/[locale]/certificates/page.tsx     # route
apps/site/public/assets/certificates/                # scans, thumbnails, conformity mark
libs/site/
├── certificates/feature/src/lib/certificates-page.tsx  # block order, links, JSON-LD
├── certificates/ui/src/lib/
│   ├── data/certificate-documents.ts                # documents, standards, file paths
│   ├── i18n/certificates-dictionary.ts              # uk and ru text
│   └── sections/                                    # certificates-documents, certificates-copies
└── certificates/seo/src/lib/certificates-metadata.ts
```

To replace a document: put the new scan and thumbnail under the same file names; to change its standards, edit `CERTIFICATE_DOCUMENTS`.

## Tests

- `libs/site/certificates/ui/src/lib/certificates-ui.spec.tsx`
- `libs/site/certificates/feature/src/lib/certificates-page.spec.tsx`
- `libs/site/certificates/seo/src/lib/certificates-seo.spec.ts`

Run one project: `npx nx test site-certificates-ui`. All site libraries: `npm run test:site`.
