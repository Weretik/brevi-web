# Site shell 002: header, catalog menu, and footer redesign

**Status:** implemented 2026-11-10. Feature card: [site shell](../../../../features/site/shell.md). Earlier specification: [001 site shell](../001-site-shell/README.md).

## Why

The owner's review of the first shell (2026-11-10): «Каталог» looked like any other menu link, and the header and footer repeated the layout of the Kedr site. An audit of the shell added: the phone and «Заявка» collapsed to icons below 1280 px, the catalog menu was eight equal numbered cards, the phone menu showed sections without subsections, and the footer had four `h2` headings and no legal details.

## Decisions (owner, 2026-11-10)

| ID     | Decision                                                                                                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SH2-01 | Header in two rows, nothing hidden: logo with the brand line, short terms, phone with hours and e-mail, «Залишити заявку»; then the «Каталог» button, the site menu, language toggle. |
| SH2-02 | «Каталог» is a filled graphite button, the first item of the menu row; orange while open.                                                                                             |
| SH2-03 | The language switch is a two-segment toggle with the current language filled, not «UA / RU» text.                                                                                     |
| SH2-04 | Catalog menu in two panes: sections with icons, subsections of the chosen section, the logo sewing card.                                                                              |
| SH2-05 | Phones and tablets get a bottom bar: «Каталог», «Заявка», «Дзвінок», «Меню».                                                                                                          |
| SH2-06 | Dark footer with the call band, link columns, contacts with the map link, legal name and ЄДРПОУ.                                                                                      |

## Acceptance

- SH2-A1: the phone number is text on every width from 1024 px; below that the bottom bar has the call action.
- SH2-A2: every catalog section and subsection is a link in the HTML of the closed menu; one section is shown at a time.
- SH2-A3: while the page is scrolled, the menu row stays and (from 1280 px) shows the phone.
- SH2-A4: the footer has no headings; the legal line names the company and its ЄДРПОУ.
- SH2-A5: request links stay `rel="nofollow"`; the language toggle keeps the page and `hreflang`.

## Not in this change

- Search field: added with the catalog page.
- Own URL per catalog section: arrives with the BreviERP category tree; until then every entry opens `/catalog`.
- Subsection photos in the menu: need client photos.
- Social links: the owner has not given the addresses.

Design boards: canvas «Brevi: шапка, меню и подвал», board «Итог», header H1.
