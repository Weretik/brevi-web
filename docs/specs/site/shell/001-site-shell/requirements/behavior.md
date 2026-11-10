# Behavior: site shell

## Rules

- **R-001.** Every localized page is framed by the top line, the header, and the footer of the «Строчка» mockup.
- **R-002.** The header menu is «Каталог», «Пошиття з логотипом», «Ціни для опту», «Галузі», «Про виробництво», «Контакти», then «Заявка» and the sales phone. The header stays on screen while scrolling.
- **R-003.** «Каталог» opens a mega menu with every section and subsection. All its links are real `<a href>` and are in the initial HTML.
- **R-004.** Every page of the Angular storefront is reachable from the header or the footer.
- **R-005.** Below 1024 px the menu moves into a side sheet; «Заявка» and the phone become icon buttons. The phone is a `tel:` link.
- **R-006.** The site has two languages, `/uk` and `/ru`. The switch leads to the same page in the other language.
- **R-007.** `/` answers 308 to `/uk`. A trailing slash answers 308 to the path without it. Unknown paths answer 404.
- **R-008.** Indexing is off unless `SITE_ENV=production` and `SITE_INDEXING=true`.
- **R-009.** Orange is an accent only; orange text uses `brand-text`. There is no dark theme.
- **R-010.** Company facts (phones, address, email, hours) come from one place, `COMPANY` in `site-core-config`.

## Scenarios

- **SC-001.** Given a visitor on `/ru`, when the page loads, then the header shows the Russian menu, both phones, and the footer shows the address and email.
- **SC-002.** Given a visitor on `/ru/contacts`, when they look at the menu, then «Контакты» has `aria-current="page"`.
- **SC-003.** Given the header, when the visitor presses «Каталог», then the mega menu opens; Escape or a press outside closes it.
- **SC-004.** Given a phone, when the visitor opens the menu, then a side sheet lists the catalog sections and the menu pages.
- **SC-005.** Given a visitor on `/ru/contacts`, when they press «UA», then they get `/uk/contacts`.
- **SC-006.** Given `/`, then the answer is 308 to `/uk`; given `/uk/`, then 308 to `/uk`; given `/uk/no-such-page`, `/en`, or `/foo/bar`, then 404.
- **SC-007.** Given a non-production environment, then `robots.txt` is `Disallow: /` and every page has `noindex, nofollow`.
- **SC-008.** Given `/uk`, then the HTML has a title, a description, a self canonical, `hreflang` for `uk-UA`, `ru-UA`, and `x-default`, and JSON-LD `Organization`, `WebSite`, `LocalBusiness`.
- **SC-009.** Given the «Заявка» link, then it has `rel="nofollow"` and its page is disallowed in `robots.txt` once indexing is on.
