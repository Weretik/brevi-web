# Admin React: «КП» — commercial proposals

**Status:** stages 1–4 implemented 2026-11-04 ([feature card](../../../../features/admin/quotes.md)); stages 5–6 planned. **Backend:** BreviERP [CRM-003 «КП»](https://github.com/Weretik/BreviERP/blob/master/docs/sdd/specs/crm/003-quotes/README.md) (rules R-*, scenarios, API), module Crm, `/api/crm/quotes`. **Design:** [«Цех»](../../../../standards/admin/design-system.md).

The screens follow the client's old Calculator cabinet (owner's screenshots, 2026-11-04) in the «Цех» look. Marks appear only for problems, with the reason (no «Готово» or «у КП» success chips).

## Menu

Group «Менеджер сервісу»: «КП» (`/crm/quotes`), «Налаштування КП» (`/crm/quote-settings`, Director and Admin, stage 2). The Codex items «Розрахунки та КП», «Реквізити та шаблон КП» and «Архів КП» and their screens were removed in stage 1 by the owner's decision.

## Stage 1 screens

### «КП» list (`/crm/quotes`)

Reference list pattern: wide search (number, client, company), a filter «Відповідальний» for Director and Admin, table rows: number, internal client name, company, responsible, items count, updated. Button «Нове КП» opens a menu: «КП під запит» (`/crm/quotes/new`) or «КП для знайомства» (`/crm/quote-introductions/new`, stage 4; owner 2026-11-04: not a menu item). A Manager sees only their own КП. Row click opens the editor.

### «Товари та ціни» editor (`/crm/quotes/new`, `/crm/quotes/:id`)

- Header: «Комерційна пропозиція / Товари та ціни», buttons «Передати розрахунок» (Director, Admin: pick a staff member), «Перерахувати за актуальними цінами» (shows old → new, then saves). «Додати товар» and «Додати разовий ЗІЗ» sit in the products block: under the hint while it is empty, then as «Додати ще товар» / «Додати ще разовий ЗІЗ» under the last item (owner 2026-11-04).
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

Same numbering as the backend: 1 list + editor (done); 2 settings + PDF (done); 3 Gmail sending from each manager's own Gmail (done); 4 КП для знайомства (4 steps: layout, recipient, letter variant, catalogue pages, «Зберегти як готовий шаблон», «Готові шаблони») (done); 5a «Виріб з нуля» (done); 5b «Змінити склад» of a Catalog model (done); 5c history, archive, copy (done); 6 import of old КП from the calculator, if it proves easy.

## Stage 2 screens

- «Налаштування КП» cards: «Реквізити та контакти Brevi» (with logo), «Контакти менеджерів у КП» (one row per staff member: account, then name, phone and email the client sees), «Лист, що надсилається з КП» (subject, body, marks), «Тексти PDF», «КП для знайомства — рекламний каталог» (texts, summer and winter banners, accent colour, five «Переваги»), «Варіанти листа» (add and remove, up to 10). One «Зберегти зміни» saves the whole page; version 0 shows the defaults until the first save.
- There was no old PDF sample, so the PDF layout is new: Brevi header, title and number, items with photo and the shown prices only, comment, VAT note, call to action with the manager's contact, requisites in the footer.

## Stage 3 screens

- «Контакти менеджерів у КП» gets a «Gmail для надсилання» column: the connected address and «Відключити», or «Підключити Gmail». The button opens Google in the same tab; Google returns to the page with `?gmail=connected` or `?gmail=error&reason=…`, shown as a notice. With unsaved changes on the page the button is disabled with «Спочатку збережіть зміни на сторінці.». Director connects anyone, a manager only themselves (the server enforces it).
- Editor footer: «Сформувати КП» becomes outlined and «Надіслати КП» is the main action. It saves unsaved changes first, then opens the «Надіслати КП» side panel: «Від кого» (the signed-in person's Gmail), «Лист» (standard letter from the email template plus the letter variants), «Кому» (several addresses through a comma), «Тема», «Текст листа», and the PDF name. «Надіслати» sends from the person's own Gmail with the PDF of the saved КП attached.
- Success closes the panel, shows «КП N надіслано.» and adds « · надіслано <date>» to the subtitle; the КП status becomes «Надіслано». A failure keeps the panel open with the server's reason; the КП stays as it was.
- Without a connected Gmail the panel offers «Підключити мій Gmail» and «Надіслати» is disabled. While Google keys are not configured on the server the panel says sending is not on yet.

## Stage 4 screens

- «КП для знайомства» (`/crm/quote-introductions/new`, a saved one at `/crm/quote-introductions/:id`; the menu item opens a new selection, the list opens saved ones by kind and has a «Вид» column). Four step cards in the old calculator order: 1 «Оберіть основу добірки» (Загальне, Літній, Зимовий); 2 «Вкажіть отримувача» (client or request name for the list, email, company, contact person, internal note); 3 «Оберіть текст листа» (letter variants from the settings with their subject); 4 «Зберіть сторінки каталогу» (per page the fixed main model, then three «Обрати модель» slots; each has a fabric select and the від 41 шт. price, not editable).
- «Обрати модель» side panel lists only the page's season; a fabric is chosen there with its price; a model already in the selection cannot be chosen again.
- Header: «Нова добірка», «Зберегти як шаблон» (side panel with the name; needs every model and fabric), «Готові шаблони» (side panel: name, layout, author, date, models; «Застосувати», and «Видалити» for the author, Director or Admin). Applying fills the selection with current Catalog data; a model or fabric that is gone leaves the slot empty with the reason.
- Footer as in the editor: «Зберегти зміни», «Сформувати КП» (catalogue PDF), «Надіслати КП» (the chosen letter first, «Кому» filled with the saved email).
- «Налаштування КП» → «КП для знайомства»: the codes of the main summer and winter models (empty = MOD-166 «Імпульс» and MOD-169 «Прайм»).

## Stage 5a screens

- «Нове КП» menu gets «КП з нуля (новий виріб)»: it opens a new editor (`/crm/quotes/new?custom=1`) with the «Виріб з нуля» side panel open. In the products block «Додати виріб з нуля» (later «Додати ще виріб з нуля») opens the same panel.
- The panel (ReferenceEditorDrawer, 720 px): «Назва виробу», «Опис для клієнта», then «Тканини» (metres each), «Фурнітура» (quantity in its unit), «Операції» (how many times; «Хвилин» for an operation without a fixed norm), each with a search from the references. «Розрахунок» shows per fabric the three prices, time, labour and full cost, or the first missing thing / the server's reason. «Додати в КП» is enabled only when every fabric is priced.
- The item card shows «Склад» (accessories and operations with quantities), «Тканини» with read-only prices and «Змінити склад і тканини», which reopens the panel with «Зберегти склад».

## Stage 5b screens

- A sewing model card gets «Змінити склад» next to «Додати тканину». It loads the model's Catalog composition and opens the panel titled «Змінити склад моделі»: the fabrics of the variants already in the КП with their metres, «Додаткові тканини» and «Послуги» of the model (quantity and remove only), «Фурнітура» and «Операції» with search to add more, and «Розрахунок».
- «Зберегти склад» replaces the model in the КП with its changed composition: the card shows «Склад», the fabrics with read-only prices and «Змінити склад і тканини»; code, site link and season stay, the subtitle reads «змінений склад моделі».

## Stage 5c screens

- Backend rules R-22–R-24. The list gets tabs «В роботі» and «Архів» (`archived=true`).
- The header of a saved КП gets «Ще» (both editors): «Історія змін» (side panel, newest first: what, details, who and when), «Копіювати» («Нове КП з тими ж товарами та цінами»; opens the copy with «Створено КП N — копію КП M»), «В архів» / «Повернути з архіву». Copy and archive are disabled with unsaved changes («Спочатку збережіть зміни»).
- An archived КП shows a warning «КП в архіві з <дата> (<хто>)» with «Повернути з архіву»; «Зберегти зміни», «Надіслати КП», «Перерахувати» and «Передати розрахунок» are off.

## Editor redesign (variant A, 2026-11-04)

The owner found the editor unclear and chose variant A «Документ + підсумок» from the [UX analysis and three variants](https://claude.ai/artifact/6PgHcivoYcbKubMNki9gM1). Frontend only; the API and saved data do not change. It replaces the stage 1–5c header, footer, item card and «Нове КП» menu described above; the [feature card](../../../../features/admin/quotes.md) holds the current behavior.

- «Нове КП» is a side panel: client first (KeepinCRM or typed), then «КП під запит» or «КП для знайомства». «КП з нуля» stops being a КП kind; «Новий виріб» is one of the three «Додати позицію» tiles.
- Header: kind, status pill, the client as the title, number and owner; «Історія» and «Ще» (copy, hand over, reprice, archive, delete draft). No red button in the header.
- Items are compact cards with a price table; «показати в КП» is set once per tier for the whole КП in «Підсумок», a single price is hidden from its row menu.
- A sticky right column holds «Підсумок», «Перед надсиланням» (problems only, as links) and the actions «Надіслати КП», «Переглянути PDF», «Зберегти».
- Notes lose the green and yellow fills (status colours are for states only).

## Tests

Stage 1: list (search, own-only for a Manager), editor (add model and fabrics, hide a price, manual PPE price needs a reason, one-off PPE validation, 409 reload), picker disabled reason. Stage 2: «Сформувати КП» saves first and does not download after a failed save; settings save, field rules and 409. Stage 3: «Надіслати КП» saves first, sends and marks the КП sent; a Gmail refusal stays in the panel; no recipient blocks sending; no Gmail offers to connect it; «Підключити Gmail» opens Google and is disabled with unsaved changes; recipient and subject rules. Stage 5a: the panel prices the composition and adds the item; «Нове КП» offers «КП з нуля»; the products block opens the panel. Stage 5b: «Змінити склад» starts from the Catalog composition, a removed service leaves the price request, and the saved item keeps the model. Stage 5c: «Історія змін» panel, archive locks saving and restore unlocks it, copy opens the new КП with a notice, «Архів» tab. Redesign: «Нове КП» panel passes the client to the editor; the title, number and status; КП-level tier switch; problems list; add tiles; price cell «вручну». Focused run: `npx nx test admin-quotes-feature`.
