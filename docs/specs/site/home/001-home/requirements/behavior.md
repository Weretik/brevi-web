# Behavior: home page

## Rules

- **R-001.** `/uk` and `/ru` render the home page inside the site shell with exactly one `h1`.
- **R-002.** Blocks follow the mockup order: first screen, catalog sections, logo, process, own production, industries, contacts, SEO text with FAQ.
- **R-003.** The page reads no API. Text comes from the home dictionary, company facts from `COMPANY`, catalog sections from `site-catalog-model`.
- **R-004.** The page shows no prices and no form. «Залишити заявку» scrolls to the contacts block (`#zayavka`).
- **R-005.** Every link is a real `<a href>` with the locale prefix. Phones are `tel:` links, the e-mail is a `mailto:` link.
- **R-006.** The FAQ is `<details>`; every answer is in the server HTML.
- **R-007.** Both languages have the same blocks and the same number of items in every list.
- **R-008.** On a phone the page has no horizontal scroll; blocks stack in one column.

## Scenarios

- **SC-001.** Given `/uk`, when the page opens, then the visitor sees the offer, three facts, «Залишити заявку», the sales phone, and the suit photo with four callouts.
- **SC-002.** Given the first screen, when the visitor presses «Залишити заявку», then the page scrolls to the contacts block.
- **SC-003.** Given the catalog block, when the visitor presses a section or «Весь каталог», then `/{locale}/catalog` opens.
- **SC-004.** Given `/ru`, when the page opens, then all text and links are Russian and start with `/ru`.
- **SC-005.** Given the contacts block, when the visitor presses «Зателефонувати» or «Написати на пошту», then the phone or the mail client opens with the company contacts.
- **SC-006.** Given the FAQ, when the visitor opens a question, then the answer shows; the same questions and answers are in `FAQPage`.
- **SC-007.** Given a crawler, when it reads `/uk`, then it gets the home title, description, canonical, `hreflang`, and `WebSite`, `LocalBusiness`, `FAQPage`.
