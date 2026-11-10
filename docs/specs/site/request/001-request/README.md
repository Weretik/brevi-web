# «Заявка» page (request form)

**Status:** page and form implemented and verified locally 2026-11-10; delivery of requests is a separate later stage.
**Variant:** `nextjs`.
**Source:** [migration plan](../../migration/README.md), step 6; design «Строчка»; owner decisions of 2026-11-10; the request form of the live `brevi.com.ua` page «Спецодяг для підприємств» (version of 2026-11-10, saved in project files `brevi-site/old-site-html/request/`).
**Feature card:** [site request](../../../../features/site/request.md).

## Owner decisions (2026-11-10)

- The idea of the page: the visitor leaves a request quickly and a manager calls back.
- The fields and the text come from the fresh form of the live site: phone (required), what to sew, approximate quantity, comment, file with a brief or a layout up to 10 MB. The form has no name field.
- The callback promise is the live site's: a manager calls within 15 minutes.
- Requests will go to the «Ліди» page of BreviERP and to the existing Telegram group. The admin and backend part is postponed («пока не трогай админку»), so this stage builds only the page.
- The site has no cart, no online order, and no online payment.
- Only the site phone 050 469 86 75 is shown; the live page's other number is not carried over.

## Scenarios

1. A visitor opens `/uk/request` from any «Залишити заявку» button and sees the heading, three steps, and the form.
2. An empty or wrong phone, a field that is too long, a file over 10 MB, or a file of another format: the error is written next to the field, typed text stays. The browser clears the chosen file, so the visitor attaches it again.
3. A valid request while delivery is not connected: the form shows «Не вдалося надіслати запит» and the phone to call. The page never says a request was sent when it was not.
4. After delivery is connected: the form is replaced by «Дякуємо! Запит надіслано» with the visitor's number and the link «Виправити і надіслати ще раз».

## SEO

`noindex, follow`, self canonical, both language alternates, `BreadcrumbList`. The page is not in the sitemap, and links to it carry `rel="nofollow"`.

## Not in this stage

- Passing the request to BreviERP «Ліди» and Telegram, storing the file, spam protection (honeypot and rate limit), request analytics.
- The list of products chosen in the catalog and the counter in the header: they come with the catalog.

## Structure check

Four libraries by the page pattern plus `model` for the form state and validators (`validators/` folder). The form is the only client component; the dictionary, intro, and facts are server components. No generic `utils`, `types`, or `constants` files.
