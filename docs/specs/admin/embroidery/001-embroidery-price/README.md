# Admin React: «Ціна вишивки», stages 1–2

**Status:** stages 1 and 2 («Збережені») implemented 2026-11-04 ([feature card](../../../../features/admin/embroidery.md)). **Backend:** BreviERP [EMB-001 embroidery price](https://github.com/Weretik/BreviERP/blob/master/docs/sdd/specs/crm/005-embroidery-price/README.md) (formulas, rules R-*, scenarios), module Crm, `/api/crm/embroidery`. **Design:** [«Цех»](../../../../standards/admin/design-system.md); the owner picked variant A «Форма + живий підсумок» on 2026-11-04 from the [concept canvas](https://claude.ai/artifact/2pXPhQwf477xw9s4HAfNcr).

It replaces the «Ціна вишивки» page of the old calculator.brevi.com.ua. Marks appear only for problems (a rate not set, «Орієнтовна»), never as an "all OK" chip.

## Who sees what

- A Manager calculates and sees the three prices per unit, the order total and the repeat price. The server never sends a Manager the cost, the rates, the markup percents or material money.
- Director and Admin (Director also holds Admin) also see the cost card, the cost breakdown and material sums, and the «Налаштування» tab.
- The menu item «Менеджер сервісу › Ціна вишивки» (`/crm/embroidery`) shows for Admin and Manager.

## «Розрахунок» (variant A)

- Left, four numbered cards: «1 · Що вишиваємо» (Вишивка на виробі / Шеврони, quantity, stitches, stabilizer layers, chevrons per hoop and fabric layers for chevrons, hoop tiles with the blank size); «2 · Програма вишивки» (Нова / Доопрацювання / Готова, hours and minutes, chips 15 хв, 30 хв, 1 год, 2 год); «3 · Як рахувати флізелін» (only used blanks or the whole cut); «4 · Додаткові витрати» (ticks for this calculation only; chevron-only costs hide on garments; the machine time field shows while a cost per machine hour is ticked).
- Right, a sticky column (under the form below `lg`): «Ціна за 1 шт» with Опт / Стандарт / Терміново, order total and repeat price, copy per level and «Копіювати ціни»; the cost card for Director and Admin.
- Below the form for Director and Admin: «Розшифровка собівартості» and the roll layout of the stabilizer (and fabric for chevrons).
- The price is computed on the server 300 ms after the last change, only when the form has no problems. Before quantity and stitches it says where the price will appear. A server reason (no stitch rate, blank wider than the roll) replaces the prices. Ticked costs without a rate make the prices «Орієнтовна» with their names.

## «Збережені» (stage 2)

- «Зберегти розрахунок» under the prices (shown once a price is on screen) opens a side panel with an optional name and client from «Контрагенти». The server prices the same form again with the current rates and freezes them; a snackbar names the number «ВШ-0042» with «До збережених».
- Tab «Збережені» (`?tab=saved`, everyone who calculates): search by name, client or number, 25 per page, newest first; a row shows number, name and client, what is embroidered, the three unit prices, when and by whom; «Орієнтовна» marks prices that missed a rate.
- A row opens a read-only side panel: the saved prices (copy works), the form, and for Director and Admin the cost breakdown and «Ставки на момент збереження». «Повторити розрахунок» loads the form into «Розрахунок», where it is priced with today's rates; a hoop or cost removed since then falls back to the default. Director and Admin can delete after a confirmation.

## «Додати в КП» (stage 2)

- In the saved side panel «Додати в КП» opens a second panel: the price for the client (Опт / Стандарт / Терміново with the saved unit price, «Стандарт» by default) and the КП «Під запит» in work (search by number or client; a Manager sees only own ones). «Додати» appends one row; a snackbar offers «Відкрити КП».
- In the КП editor the row is «Вишивка» with its number, the level as the row title and the price in all three columns (owner's choice of 2026-11-04); the price cannot be typed, the description and «показати» ticks can.

## «Імпорт архіву» (stage 2, removed)

- The old calculator's archive (8 records) was moved on 2026-11-05 through a one-time «Імпорт архіву» panel; the owner then asked to remove the button. The backend endpoint `importCrmEmbroideryArchive` stays for a repeat transfer but has no Admin screen.

## «Налаштування»

- «Ставки»: the stitch rate is read-only here and links to «Параметри ціноутворення»; threads, hooping, program hour and tax are edited.
- «Націнки»: exactly three levels, name and percent.
- «Матеріали»: stabilizer and chevron fabric price per metre and roll width, the fabric blank increase.
- «П’яльця» and «Додаткові витрати»: tables; a row click or «Додати…» opens the reference side panel (`ReferenceEditorDrawer`). «Готово» puts the row into the page draft. An empty expense rate means «not set yet», 0 means free. «Клей» cannot be removed; a hoop's own glue rate overrides it.
- The page is saved whole from the sticky bottom bar («Змінено: …», «Виправте: …», «Скасувати зміни», «Зберегти»). Until the first save it shows the old site's rates and asks to check and save them. A stale save (409) offers «Оновити». Leaving the page with unsaved changes asks first.

## API contract

Snapshot: BreviERP `docs/sdd/contracts/openapi.yaml` at commit `a9c88f4ad7d1593c279a1b60729613d1fea6b061` (`docs/contracts/openapi/SOURCE.json`), slice `crm/embroidery.openapi.yaml`.

| operationId                      | Method and path                                | Client use                                                                                              |
| -------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `getCrmEmbroideryForm`           | GET `/api/crm/embroidery/form`                 | hoops, costs, markup names, `seesCost`; tag `EmbroiderySettings`                                        |
| `calculateCrmEmbroidery`         | POST `/api/crm/embroidery/calculate`           | an RTK query (no side effects), cached by request; overrides only for changed ticks                     |
| `getCrmEmbroiderySettings`       | GET `/api/crm/embroidery/settings`             | Admin only; version 0 = defaults                                                                        |
| `saveCrmEmbroiderySettings`      | PUT `/api/crm/embroidery/settings`             | whole page with `version`; 409 → «Оновити»; success invalidates the tag, so the form and prices refresh |
| `getCrmEmbroideryCalculations`   | GET `/api/crm/embroidery/calculations`         | «Збережені» page with `search`; tag `EmbroideryCalculations` LIST                                       |
| `getCrmEmbroideryCalculation`    | GET `/api/crm/embroidery/calculations/{id}`    | side panel; `rates` and `result.cost` null for a Manager                                                |
| `saveCrmEmbroideryCalculation`   | POST `/api/crm/embroidery/calculations`        | name, client, the priced request; invalidates LIST                                                      |
| `addCrmQuoteEmbroidery`          | POST `/api/crm/quotes/{id}/embroidery`         | «Додати в КП»: calculation id and level; invalidates the КП, its history and the list                   |
| `deleteCrmEmbroideryCalculation` | DELETE `/api/crm/embroidery/calculations/{id}` | Admin only, after confirmation                                                                          |

Responses pass a shape check in `data-access/src/validators` before mapping. A 400 shows the server's first message.

## Stages

1. «Розрахунок» and «Налаштування» — done.
2. «Збережені» calculations — done; the old calculator's archive (8 records) was moved on 2026-11-05.
3. «Додати в КП» — done.

## Code

Libraries `libs/admin/embroidery/{model,data-access,ui,feature}` generated with `nx g @nx/js:library` and `nx g @nx/react:library`, then trimmed to the [admin code organization](../../../../standards/admin/admin-code-organization.md).

## Tests

See the [feature card](../../../../features/admin/embroidery.md#tests).
