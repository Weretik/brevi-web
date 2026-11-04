# Admin React: «КП» — commercial proposals

**Status:** stages 1–2 implemented 2026-11-04 ([feature card](../../../../features/admin/quotes.md)); stages 3–6 planned. **Backend:** BreviERP [CRM-003 «КП»](https://github.com/Weretik/BreviERP/blob/master/docs/sdd/specs/crm/003-quotes/README.md) (rules R-*, scenarios, API), module Crm, `/api/crm/quotes`. **Design:** [«Цех»](../../../../standards/admin/design-system.md).

The screens follow the client's old Calculator cabinet (owner's screenshots, 2026-11-04) in the «Цех» look. Marks appear only for problems, with the reason (no «Готово» or «у КП» success chips).

## Menu

Group «Менеджер сервісу»: «КП» (`/crm/quotes`), «КП для знайомства» (stage 4), «Налаштування КП» (`/crm/quote-settings`, Director and Admin, stage 2). The Codex items «Розрахунки та КП», «Реквізити та шаблон КП» and «Архів КП» and their screens were removed in stage 1 by the owner's decision.

## Stage 1 screens

### «КП» list (`/crm/quotes`)

Reference list pattern: wide search (number, client, company), a filter «Відповідальний» for Director and Admin, table rows: number, internal client name, company, responsible, items count, updated. Button «Нове КП». A Manager sees only their own КП. Row click opens the editor.

### «Товари та ціни» editor (`/crm/quotes/new`, `/crm/quotes/:id`)

- Header: «Комерційна пропозиція / Товари та ціни», buttons «Передати розрахунок» (Director, Admin: pick a staff member), «Перерахувати за актуальними цінами» (shows old → new, then saves), «Додати товар», «Додати разовий ЗІЗ».
- Card «Створив(-ла) / Відповідальний(-а)».
- Fields: «Номер КП» (read-only, «Буде присвоєно після збереження»), «Внутрішня назва клієнта / запиту» (combo with KeepinCRM clients, free text allowed; hint «Лише для менеджера»), «Ім'я отримувача», «Назва підприємства».
- Line «N товарів у пропозиції» with the price legend до 9 шт. / 10–40 шт. / від 41 шт.
- Item card «Позиція 01»: photo (stage 2: «Замінити фото» from «Фото»), name, kind line («Швейна продукція · готові варіанти тканини», «ЗІЗ · готовий товар»), season, editable «Опис позиції у КП» with hint «Підтягується з таблиці. Зміна діє лише в цьому КП.», code, «Відкрити на сайті», actions duplicate and delete.
- Sewing item: «Варіанти тканини» rows: fabric name, composition, density, fabric price, supplier; three price boxes, each toggles «показати в КП»; «Рекомендований варіант»; «Додати тканину» lists the model's other active variants.
- PPE item: one row «Ціна» with three boxes; a box can be overwritten («Ціну можна виправити вручну»), which asks for a reason; supplier link.
- One-off PPE: name, description, supplier link, three manual prices.
- «Коментар для клієнта» (green, «Клієнт побачить у КП») and «Нотатки менеджера до КП» (yellow, «Клієнт цього не побачить»).
- Footer: «Закрити», «Зберегти зміни», «Сформувати КП» (stage 2: saves unsaved changes, then downloads the PDF built by the server).
- «Додати товар» opens the side panel: search by name or code, tabs «Швейна продукція» / «ЗІЗ», each row with photo and від-price; a model without a priced variant is shown disabled with the reason.
- A stale save (409) shows «КП змінили в іншому вікні» with «Оновити».

## Code

Libraries `libs/admin/quotes/{data-access,model,ui,feature}` generated with `nx g @nx/react:library`, following [admin code organization](../../../../standards/admin/admin-code-organization.md); the generated OpenAPI types come from the BreviERP contract `crm/quotes.openapi.yaml`. Stage 1 photo: the Catalog's main photo; «Замінити фото» comes in stage 2.

## Stages

Same numbering as the backend: 1 list + editor (done); 2 settings + PDF (done); 3 Gmail sending from each manager's own Gmail; 4 КП для знайомства (4 steps: layout, recipient, letter variant, catalogue pages, «Зберегти як готовий шаблон», «Готові шаблони»); 5 composition editing, model from scratch, history, archive; 6 import of old КП from the calculator, if it proves easy.

## Stage 2 screens

- «Налаштування КП» cards: «Реквізити та контакти Brevi» (with logo), «Контакти менеджерів у КП» (one row per staff member: account, then name, phone and email the client sees), «Лист, що надсилається з КП» (subject, body, marks), «Тексти PDF», «КП для знайомства — рекламний каталог» (texts, summer and winter banners, accent colour, five «Переваги»), «Варіанти листа» (add and remove, up to 10). One «Зберегти зміни» saves the whole page; version 0 shows the defaults until the first save.
- There was no old PDF sample, so the PDF layout is new: Brevi header, title and number, items with photo and the shown prices only, comment, VAT note, call to action with the manager's contact, requisites in the footer.

## Tests

Stage 1: list (search, own-only for a Manager), editor (add model and fabrics, hide a price, manual PPE price needs a reason, one-off PPE validation, 409 reload), picker disabled reason. Stage 2: «Сформувати КП» saves first and does not download after a failed save; settings save, field rules and 409. Focused run: `npx nx test admin-quotes-feature`.
