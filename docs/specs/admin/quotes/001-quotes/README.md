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
- Settings redesign (2026-11-04, variant A «Розділи + перегляд» on the [canvas](https://claude.ai/artifact/6PgHcivoYcbKubMNki9gM1)): the same data in five sections named by what the client gets (Компанія, PDF КП під запит, Лист клієнту with the main letter and the variants in one list, КП для знайомства, Менеджери і Gmail); a «Розділи» list with marks only for changes and problems; a «Перегляд» sketch of the PDF and the letter with example data; mark buttons instead of typed braces and unknown marks as errors; «Повернути як було» per field and «Скасувати зміни»; colour presets and a Catalog model picker; manager fields in a side panel; Gmail connects without saving first (unsaved changes are kept for the Google trip). Frontend only, the API is unchanged.
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

## PDF «Класика+» and preview before sending (2026-11-05)

The owner sent the old Calculator КП 22-11-2026 as the sample and chose variant A «Класика+» with the dark note of variant B from the [audit and three variants](https://claude.ai/artifact/UedNTgi4ot6h29hRvBS4Ey). The PDF layout is backend crm R-30; this page adds:

- «Надіслати КП» and «Переглянути PDF» save unsaved changes, then open «Перегляд КП» full screen: the server PDF in the browser viewer, problems only on the right (an item without a shown price is left out of the PDF; an item without a photo has only its description), «Надіслати КП» (opens the letter panel; off for an archived КП), «Завантажити», «Друкувати», «Повернутися до редагування». The same preview serves «КП для знайомства».
- «Налаштування КП» → «PDF КП під запит» gains «Вступ під назвою клієнта» (`introText`, `{client}` is the client; empty means the standard text); the settings sketch follows the new layout.

## Client corrections, stage 1 (2026-11-08)

The owner's client list (16 items, kept in the project files `brevi-client-corrections-2026-11-08/list.md`); stage 1 is the editor:

- The card of a changed model no longer shows the «Фурнітура / Операції» text under its header.
- The item photo is about 2.5 times larger (140 px, 96 px on phones).
- «Показувати / Сховано» right under every price replaces the checkboxes in the row «⋯»; the row «⋯» is gone.
- A visible bin icon removes a fabric; the last fabric removes the whole item after a confirmation.
- Every fabric shows one manager line «Склад · Щільність · грн/м · постачальник» from the current Reference fabric (backend crm R-31); the ★ stays on the title line.

## Client corrections, stage 2 (2026-11-08)

- R-32: the supplier in the fabric line opens the read-only supplier side panel (owner's variant B from the [design variants](https://claude.ai/artifact/FVoc1c6pMDTxc28itEA33E)): contacts as links, «Тканини цього постачальника в КП», notes and «Відкрити в контрагентах». The same panel now opens from every supplier name in the admin. Who sees «Відкрити в контрагентах» moves to the access rights page (client item 11); until then everyone who can open the КП sees it.

## Client corrections, stage 3 (2026-11-08)

Backend rules R-23, R-33 and R-34 in BreviERP `docs/sdd/specs/crm/003-quotes/README.md`.

- R-23: the archive is gone. The list is «Комерційні пропозиції» (menu item too) with no «В роботі» / «Архів» tabs, and the editor has no «В архів» or archived notice. КП left from the old archive are hidden; the Director sees a warning on the list with their count and «Видалити назавжди» after a confirmation (those with a production order come back to the list).
- R-33: «Нове КП» only opens the editor; the client may be left for later and nothing is saved until «Зберегти». The КП has four actions: «Надіслати КП», «Переглянути PDF», «Зберегти» (saves and goes back to the list with «КП збережено») and «Скасувати» (goes back without saving). The PDF and sending of a new or changed КП ask «Щоб продовжити, збережіть КП»; after saving the КП stays open and the PDF opens. «Змінити фото» uploads an own JPG, PNG or WebP photo to the CDN folder «Фото КП» for that item only, also for items without a Catalog product.
- R-34: only the Director deletes a КП (until the access rights page), from its row in the list or from «Ще», in any status after a confirmation; the server's refusal (a production order, a newer version) stays in the dialog.

## Tests

Stage 1: list (search, own-only for a Manager), editor (add model and fabrics, hide a price, manual PPE price needs a reason, one-off PPE validation, 409 reload), picker disabled reason. Stage 2: «Сформувати КП» saves first and does not download after a failed save; settings save, field rules and 409. Stage 3: «Надіслати КП» saves first, sends and marks the КП sent; a Gmail refusal stays in the panel; no recipient blocks sending; no Gmail offers to connect it; «Підключити Gmail» opens Google (since the settings redesign it works with unsaved changes and keeps them); recipient and subject rules. Stage 5a: the panel prices the composition and adds the item; «Нове КП» offers «КП з нуля»; the products block opens the panel. Stage 5b: «Змінити склад» starts from the Catalog composition, a removed service leaves the price request, and the saved item keeps the model. Stage 5c: «Історія змін» panel, copy opens the new КП with a notice (the archive tests went with the archive in client corrections stage 3). Redesign: «Нове КП» panel passes the client to the editor; the title, number and status; КП-level tier switch; problems list; add tiles; price cell «вручну». PDF preview: «Переглянути PDF» shows the saved КП and downloads it, unsaved changes are saved first (since client corrections stage 3 after «Щоб продовжити, збережіть КП»), a failed save opens nothing, sending goes through the preview; warnings list only problems (`quote-preview-warnings.unit.test.ts`). Settings redesign: manager side panel, problems by section, mark buttons and preview, «Повернути як було» and «Скасувати зміни», Gmail with unsaved changes. Client corrections stage 1: the price switch hides a price, the fabric line shows composition, density, price per metre and supplier, the last fabric removes the item after a confirmation (`quote-editor-page.component.test.tsx`, `quote-price-cell.component.test.tsx`, `quote-fabric-facts.unit.test.ts`). Stage 2: the supplier opens its card with the КП fabrics of that supplier (`quote-editor-page.component.test.tsx`, `quote-fabric-facts.unit.test.ts`, references `supplier-preview.component.test.tsx`, `suppliers-page.component.test.tsx`). Stage 3: title without tabs and «КП збережено», delete only for the Director with the server's refusal, the old archive warning and its purge, «Нове КП» without a client (`quotes-page.component.test.tsx`); «Зберегти» closes, «Скасувати» does not save, «Видалити КП» in «Ще», the PDF and sending ask to save first and keep the КП open (`quote-editor-page.component.test.tsx`); own photo upload and its error (`quote-photo-picker-drawer.component.test.tsx`). Focused run: `npx nx test admin-quotes-feature`.
