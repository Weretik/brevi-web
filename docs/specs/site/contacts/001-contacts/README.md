# «Контакти» page

**Status:** implemented and verified locally 2026-11-10.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md); design «Строчка»; facts from the live `brevi.com.ua` page «Контакти» (owner's reference screenshot).
**Feature card:** [site contacts](../../../../features/site/contacts.md).

## Goal

Build the page at `/uk/contacts` and `/ru/contacts`; the menu, the footer, and other pages already link to it.

## Scope

- Libraries `site-contacts-ui`, `site-contacts-seo`, `site-contacts-feature`, created with `nx g @nx/react:library`.
- `COMPANY.managers` and `COMPANY.mapQuery` in `site-core-config`; manager photos cut from the reference screenshot.
- `PageHeader` in `site-shared-ui` (the former `DeliveryHero`), used by «Доставка та оплата» and «Контакти».
- The page in the sitemap.

## Out of scope

- A contact form (the request step) and editing contacts in the admin.
- Social network QR codes: profile addresses are unknown.

## Rules

| ID    | Rule                                                                                                                |
| ----- | ------------------------------------------------------------------------------------------------------------------- |
| R-001 | One `h1`; blocks follow the live page: contact information with the map and hours, then the managers.               |
| R-002 | Phones, email, address, hours, and managers come from `COMPANY`; phones are `tel:` links, emails `mailto:` links.   |
| R-003 | Weekdays show 09:00–18:00; Saturday and Sunday are days off.                                                        |
| R-004 | The map is an `iframe` with a title and `loading="lazy"`; the link opens the place in Google Maps in a new tab.     |
| R-005 | Breadcrumbs are visible; JSON-LD has `BreadcrumbList` and `LocalBusiness`; title and description per language.      |
| R-006 | Ukrainian and Russian have the same captions; manager names are localized; no client components; no phone overflow. |

## Traceability

| Rule         | Code                                         | Test                                             |
| ------------ | -------------------------------------------- | ------------------------------------------------ |
| R-001, R-005 | `contacts-page.tsx`, `contacts-metadata.ts`  | `contacts-page.spec.tsx`, `contacts-seo.spec.ts` |
| R-002, R-003 | `contacts-info.tsx`, `contacts-managers.tsx` | `contacts-ui.spec.tsx`                           |
| R-004        | `contacts-map.tsx`                           | `contacts-ui.spec.tsx`                           |
| R-006        | `contacts-dictionary.ts`, `company.ts`       | `contacts-ui.spec.tsx`, `contacts-page.spec.tsx` |

## Verification (2026-11-10)

`curl` against `next start` of a production build and headless Chromium: both URLs prerendered as static HTML; title «Контакти виробника спецодягу в Полтаві — Brevi»; self canonical; one `h1`; `BreadcrumbList`, `LocalBusiness`, and the layout `Organization`; no horizontal scroll on an iPhone 13 profile. The map tiles could not be checked here: the build environment blocks `google.com`; check the map on the Cloudflare preview.

## Structure check (2026-11-10)

Short check under the staged structure check in the [delivery rules](../../../../standards/shared/delivery-rules.md).

| Check                       | Result                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| Route is thin               | `contacts/page.tsx` checks the locale and calls `buildContactsMetadata`, `ContactsPage`.    |
| One responsibility per file | One block per file in `contacts/ui/src/lib/sections`.                                       |
| Client code                 | None; the map is a plain lazy `iframe`.                                                     |
| No duplicates               | The page head is now `PageHeader` in `site-shared-ui`; `DeliveryHero` is removed.           |
| Facts in one place          | All contacts and managers only in `COMPANY`; the home contacts block reads the same object. |
| Generator leftovers         | Removed sample components, CSS modules, and `.babelrc`.                                     |
