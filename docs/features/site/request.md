# Site: «Заявка» page

**Status:** page and form exist, checked 2026-11-10; delivery of a request to a manager is not connected yet. Specification: [«Заявка» page](../../specs/site/request/001-request/README.md).

`/uk/request` and `/ru/request` are the request page every «Залишити заявку» button leads to. The visitor leaves a phone number and a manager calls back within 15 minutes. The form repeats the request form of the live `brevi.com.ua` page «Спецодяг для підприємств»: the phone is the only required field; what to sew, the approximate quantity, a comment, and a file with a brief or a layout (up to 10 MB) are optional. Next to the form are three steps of getting a quote and the site phone. The page is `noindex` and is not in the sitemap.

The form posts to the Server Action `submitRequest`, which cleans and checks the fields and the file. A request is not passed on yet: by the owner's decision requests will go to the «Ліди» page of BreviERP and to the Telegram group, and that work is postponed. Until then a valid request gets the answer «Не вдалося надіслати запит» with the phone, so no visitor is told a manager received it. The confirmation block `RequestSent` is ready for the `sent` state.

## Structure diagram

```mermaid
flowchart LR
  Route["apps/site: [locale]/request/page.tsx"] --> Feature["site-request-feature: RequestPage, submitRequest"]
  Route --> PageSeo["site-request-seo: metadata (noindex)"]
  Feature --> Ui["site-request-ui: form, blocks, dictionary"]
  Feature --> Model["site-request-model: form state, validators"]
  Ui --> Model
  Feature --> Seo["site-core-seo: JsonLd, BreadcrumbList"]
```

## Code structure

```text
apps/site/src/app/[locale]/request/page.tsx  # route
apps/site/next.config.ts                     # Server Action body limit for the file
libs/site/
├── request/model/src/lib/
│   ├── request-form.ts                      # fields, form state, limits, file formats
│   └── validators/request-validators.ts     # phone, field lengths, file
├── request/feature/src/lib/
│   ├── request-page.tsx                     # layout, links, JSON-LD
│   └── submit-request.ts                    # Server Action; delivery not connected
├── request/ui/src/lib/
│   ├── i18n/request-dictionary.ts           # uk and ru text
│   └── sections/                            # intro, form (client), sent, facts
└── request/seo/src/lib/request-metadata.ts
```

## Tests

- `libs/site/request/model/src/lib/validators/request-validators.spec.ts`
- `libs/site/request/ui/src/lib/request-ui.spec.tsx`
- `libs/site/request/feature/src/lib/request-page.spec.tsx`
- `libs/site/request/feature/src/lib/submit-request.spec.ts`
- `libs/site/request/seo/src/lib/request-metadata.spec.ts`

Run one project: `npx nx test site-request-ui`. All site libraries: `npm run test:site`.
