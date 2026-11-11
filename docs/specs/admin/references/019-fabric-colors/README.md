# 019 — «Кольори»: colours tab and colours picked from the list in the workshop

**Status:** implemented 2026-11-11. **Backend:** BreviERP REF-006 (`api/reference/fabric-colors`, `GET /api/production/orders/colors`, `colors` in `GET /api/production/fabric-stock/choices`).

The owner asked on 2026-11-11 for a colours reference as a separate tab of «Тканини та фурнітура», filled with the 61 colours of the client sheet («Тканини», column «Загальний перелік кольорів»), because colours take part in the workshop calculations (stock and reservations by fabric and colour, fabric plan by item colours). On the decision card he chose «Только из справочника»: the workshop picks colours only from this list.

## Rules

| ID   | Rule                                                                                                                                                                                                                                               |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R-01 | `/references/materials?tab=colors` is the third tab «Кольори» of the materials page, on the reference list pattern: list number, colour, status pill; search by name; bulk and row deletion.                                                       |
| R-02 | The same right drawer views, creates and edits a colour: name (≤ 80, unique ignoring case and spaces, checked before saving and by the backend) and the active switch. A new colour goes last.                                                     |
| R-03 | Deletion asks for confirmation, says saved items and stock keep their colour text, and suggests switching a colour off instead.                                                                                                                    |
| R-04 | The item form (new order and item edit) picks «Основний колір» and «Додатковий колір N» only from the active colours; the receipt form picks the colour of a new stock line from them; the issue form offers them plus the item's planned colours. |
| R-05 | A colour the record already has stays selectable even when it is no longer in the list, so items saved before the list keep it.                                                                                                                    |
| R-06 | Access: the tab is part of the page `materials` of «Права доступу» (no new key); the workshop reads colours through its own endpoints.                                                                                                             |

## Verification 2026-11-11

- `npx nx test admin-references-model -- fabric-color`, `admin-references-data-access -- fabric-color`, `admin-references-feature -- materials`: pass.
- `npx nx run-many -t test -p admin-production-model admin-production-data-access admin-production-ui admin-production-feature`: pass.
- Typecheck and lint for the references and production libraries and `admin-shared-api-client`: pass. `npm run contracts:check`: pass.
