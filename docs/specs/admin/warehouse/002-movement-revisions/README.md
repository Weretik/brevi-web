# Admin: «Склад тканин» stage 3, edit, void and restore of movements

**Status:** implemented 2026-11-11. Backend: [WH-003 in BreviERP](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/003-movement-revisions). Source: TZ «Brevi — склад тканин» v1.0 (old «Цех» v133), section 8; scenarios A28–A32. Feature card: [«Склад тканин»](../../../../features/admin/warehouse.md). Follows [stage 2](../001-ledger-pages/README.md).

## Scope

- «Рух тканини»: per row an edit icon, «Скасувати» and «Історія правок»; voided rows marked «Скасовано».
- No new page or route: the actions sit under the `fabric-stock` page of «Права доступу». Edit, «Скасувати» and «Скасувати останню правку» are shown only when the server says the person may move stock (`permissions.canMove`) and the row allows it (`canEdit`); the history is readable by everyone with access.
- Out of scope: movements of an issue to an order item (stage 4), reversals and reversed movements (no `canEdit`; «Сторно» stays).

## Decisions

| Topic                   | Decision                                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edit panel              | Right side panel «Правка руху» (`ReferenceEditorDrawer`). Fields follow the kind: date and metres for all; receipt adds the offer, colour of «Кольори», supplier and document; one-off issue adds a pair of «Залишки» and «Куди використано»; opening and correction keep their line. A correction is entered with its sign. Optional reason. |
| Effect before saving    | The panel shows how the balance changes: one line «зміниться на ±X м», or, when the fabric or colour changes, what goes back to the old one and what the new one gets (TZ §8).                                                                                                                                                                |
| Unchanged               | Saving with nothing changed is refused on the form («Нічого не змінено»). An offer equal to the current one counts as unchanged.                                                                                                                                                                                                              |
| «Скасувати»             | Reason dialog (3–500 characters) with the effect on the balance; the row stays as «Скасовано».                                                                                                                                                                                                                                                |
| «Історія правок»        | Side panel with each change: what and who, values before and after (amount or «Скасовано», date, fabric and colour, supplier and document or purpose), reason; changes taken back are struck through. «Скасувати останню правку» appears only when the server allows it.                                                                      |
| Concurrency and repeats | Every request sends the movement revision it shows and a new operation id, kept across failed tries; a 409 shows the server's reason.                                                                                                                                                                                                         |

## Contract

`PUT /api/warehouse/fabric-stock/movements/{id}`, `POST …/{id}/void`, `POST …/{id}/restore`, `GET …/{id}/revisions`; row fields `isVoided`, `revision`, `canEdit`. Snapshot synced from BreviERP.

## Acceptance

| TZ     | Test                                                                                |
| ------ | ----------------------------------------------------------------------------------- |
| A28    | `movement-edit-form.test.ts` «a receipt 10 → 8…»; page test «edits a receipt…»      |
| A30    | `movement-edit-form.test.ts` «an issue moved to another pair…»                      |
| A31    | page tests «voids a movement…», «shows the history… and takes the last edit back»   |
| Access | page test «hides «Прихід» and «Сторно»…» (also edit and void hidden, history shown) |

## File map

```text
libs/admin/warehouse/model/src/
  entities/movements/fabric-movement.ts      # row fields, revision, history types and labels
  entities/operations/stock-operation.ts     # edit, void, restore bodies
  forms/movement-edit/movement-edit-form.ts  # values, signs by kind, validation, effect, body
libs/admin/warehouse/data-access/src/        # four endpoints, history mapper
libs/admin/warehouse/ui/src/
  forms/movement-edit/fabric-movement-edit-form.tsx
  tables/movements/fabric-movement-history-table.tsx
  tables/movements/fabric-movements-table.tsx   # actions per row, «Скасовано»
libs/admin/warehouse/feature/src/
  components/movements/fabric-movement-edit-drawer.tsx, fabric-movement-history-drawer.tsx
  hooks/movements/use-movement-void.ts
  pages/movements/fabric-movements-page.tsx
```
