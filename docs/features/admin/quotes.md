# «КП» — commercial proposals

**State:** stages 1–3 implemented 2026-11-04 (list, «Товари та ціни» editor, «Сформувати КП» PDF, «Налаштування КП», «Надіслати КП» from each person's own Gmail), Admin React. Specification: [Admin «КП»](../../specs/admin/quotes/001-quotes/README.md); backend rules R-* in BreviERP `docs/sdd/specs/crm/003-quotes/README.md`. Look: [«Цех»](../../standards/admin/design-system.md).

## Behavior and routes

| Route                  | Purpose                                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `/crm/quotes`          | List: search by number, client or company; «Відповідальний» filter for Director and Admin; «Нове КП» |
| `/crm/quotes/new`      | Empty editor; the number is given on the first save, then the URL becomes `/crm/quotes/:quoteId`     |
| `/crm/quotes/:quoteId` | «Товари та ціни» editor of a saved КП                                                                |
| `/crm/quote-settings`  | «Налаштування КП» (Director and Admin; others are sent to the list)                                  |

- Menu «Менеджер сервісу»: «КП» links to the list; «Налаштування КП» is shown only for the Admin role (Director also holds it); «КП для знайомства» (stage 4) has no page yet.
- «Сформувати КП» in the editor footer saves unsaved changes first, then downloads `КП <number>.pdf`. The server builds the PDF from the saved КП only, with the shown prices and the responsible manager's contact from the settings.
- «Надіслати КП» (main footer action) saves unsaved changes, then opens a side panel: sender (the signed-in person's Gmail), letter variant, «Кому» (several addresses through a comma), subject and text, and the PDF name. The server sends from that Gmail with the PDF of the saved КП, then marks the КП «Надіслано» with the date; a refusal keeps the panel open with the reason and changes nothing. Without a connected Gmail the panel offers «Підключити мій Gmail».
- Gmail is connected in «Налаштування КП» → «Контакти менеджерів у КП» → «Підключити Gmail» (Director for anyone, a manager for themselves). Google returns to the same page with `?gmail=…`, shown as a notice; the button is disabled while the page has unsaved changes. Until the Google keys are set on the server (BreviERP `docs/sdd/operations/configuration/crm-gmail.md`) the panel says sending is not on yet.
- «Налаштування КП»: Brevi requisites and logo, each staff member's contact in the КП (empty phone or email falls back to the account), the email template, PDF texts, «КП для знайомства» texts with banners and five «Переваги», and letter variants. Until the first save the server returns the old calculator texts (version 0). Pictures are https links or photos from «Фото». The browser checks the same rules as the server; a 409 offers «Оновити».
- A Manager sees and opens only КП where they are responsible; the server enforces it (404 for others). Director and Admin see all, and «Передати розрахунок» hands a КП to any staff member.
- Items: a sewing model with fabric variants, a catalogue PPE, a one-off PPE. Each option has three prices (до 9 / 10–40 / від 41 шт.), each with «показати в КП». Catalog prices are taken by the server when an option is added and kept on later saves; «Перерахувати за актуальними цінами» shows old → new first and saves only on confirmation.
- A PPE price can be typed over the Catalog one and then needs a reason; a one-off PPE has only manual prices. A sewing price is never typed.
- The browser checks the same rules before saving (name, prices, reason, at least one shown price above zero); the server checks them again. A 409 shows «КП змінили в іншому вікні» with «Оновити».
- The internal name suggests KeepinCRM client names and accepts any text; it is for the manager only.

## Structure diagram

```mermaid
flowchart LR
  App[admin-react router + use-quote-actor] --> Feature[quotes feature: pages, panels, hooks]
  Feature --> UI[quotes ui: table, item cards, price boxes]
  Feature --> Model[quotes model: drafts, edits, validation]
  Feature --> DA[quotes data-access: RTK Query]
  Feature --> Clients[clients data-access: client names]
  Feature --> Media[media feature: photo picker]
  DA --> Backend[BreviERP /api/crm/quotes, /api/crm/quote-lookups, /api/crm/quote-settings, /api/crm/mailboxes]
```

## Code structure

```text
apps/admin-react/src/app/router/
  use-quote-actor.ts                 signed-in user → QuoteActor (Admin role sees all)
  admin-route-definitions.tsx        createQuotesRoutes({ useQuoteActor })
  legacy-menu.ts                     «КП», «КП для знайомства», «Налаштування КП»
libs/admin/quotes/
  model/src/
    entities/                        Quote, QuoteSummary, catalogue search, reprice report, QuoteSettings, send draft and form
    models/                          editor drafts, tiers and labels; settings draft and template marks
    mappers/                         saved КП/catalogue → draft, pure draft edits, price text, settings → draft
    validators/                      editor rules by place; settings rules by field; recipients and letter rules
  data-access/src/
    api/                             quotes (list, get, create, save, delete, reprice, responsible), lookups (catalogue, staff), settings, sending (draft, send, connect and disconnect Gmail)
    mappers/                         contract → model, draft → save input (КП and settings)
    files/quote-pdf.ts               download the КП PDF
    errors/                          Ukrainian API messages
  ui/src/
    tables/quotes-table.tsx          server-paged list
    components/editor/               header, item card, option row, price box, notes
    components/picker/               catalogue product row
    components/reprice/              old → new report
    components/settings/             settings cards and shared field helpers
  feature/src/
    quotes.routes.tsx                route factory; the app passes the actor
    pages/{list,editor,settings}/    list page; editor page, its header actions and footer; «Налаштування КП»
    components/picker/               «Додати товар» and «Додати тканину» side panels
    components/editor/               «Передати розрахунок», reprice panel, delete dialog
    components/settings/             picture field with the «Фото» picker
    components/sending/              «Надіслати КП» side panel
    hooks/{list,editor,picker,settings,sending}/  list state; draft, save, PDF and client names; catalogue search; settings draft; send panel, Gmail connect and its return notice
```

The feature library cannot import `core/auth`, so the app passes `useQuoteActor` into the route factory. Generated contract types stay in data-access.

## Tests

- Model: `validators/quote-draft-validation.unit.test.ts`, `validators/quote-settings-validation.unit.test.ts`, `validators/quote-send-validation.unit.test.ts`, `mappers/quote-price-text.unit.test.ts` — `npx nx test admin-quotes-model`.
- Data access: `mappers/quote-input.mapper.unit.test.ts`, `mappers/quote-settings.mapper.unit.test.ts`, `errors/quote-api-error.unit.test.ts` — `npx nx test admin-quotes-data-access`.
- UI: `components/editor/quote-price-box.component.test.tsx` — `npx nx test admin-quotes-ui`.
- Feature: `pages/list/quotes-page.component.test.tsx` (own-only list, responsible filter), `pages/editor/quote-editor-page.component.test.tsx` (manual price needs a reason, hide a price, 409 reload, «Сформувати КП» saves then downloads, «Надіслати КП» saves then sends, Gmail refusal, no recipient, no Gmail), `pages/settings/quote-settings-page.component.test.tsx` (save, field rules, 409, «Підключити Gmail») — `npx nx test admin-quotes-feature`.
- Menu and routes: `apps/admin-react/src/app/router/*.test.ts(x)` — `npx nx test admin-react -- src/app/router`.
