# Admin: «Склад тканин» stage 4, issuing fabric by actual cutting

**Status:** implemented 2026-11-11.

**Backend:** [WH-004 in BreviERP](https://github.com/Weretik/BreviERP/tree/main/docs/sdd/specs/warehouse/004-issue-by-cutting).

**Source:** TZ «Brevi — склад тканин» v1.0 (old «Цех» v133), sections 5.2, 7 and 8; scenarios A13–A27.

**Feature card:** [«Склад тканин»](../../../../features/admin/warehouse.md). Follows [stage 3](../002-movement-revisions/README.md).

## Scope

- «Рух тканини» gets the button «Видача на завдання». It opens a side panel that searches open items by order number, client, model or fabric. The chosen item shows its fabric card, and «Видати тканину» opens the issue form.
- The «Тканина» section of an item in «Виробничі завдання» shows the same card and form. The old production issue form, its side panel, hooks, model and endpoints are removed, so the item tab now comes from `@admin/warehouse/feature`.
- Order-issue movements can be edited and voided in «Рух тканини» (WH-004). Their edit panel hides «Куди використано».
- There is no new page or route. The actions belong to the `fabric-stock` page of «Права доступу» and show only when the server says the person may issue (`canIssue`).

## Decisions

| Topic                 | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Form                  | The form records the number of products cut now (from 1 to the item quantity), the issue date, a comment and from 1 to 20 lines. Each line names what it covers: a planned part, or «Понад план (додаткова)» with an optional role (Верх, Підкладка, Утеплювач, Фліс). Each line also has a pair from «Залишки», the metres actually taken, and an optional note. The form starts with one line per part still missing, set to the planned pair when the stock holds it. Metres start empty because they are what was really cut.          |
| Purpose               | A chip shows the purpose the server will give the line. The planned pair is «Планова», another pair for a part is «Заміна», and a line with no part is «Додаткова». The person never picks the purpose.                                                                                                                                                                                                                                                                                                                                    |
| Check step            | «Перевірити» validates the form and shows a check step before anything moves. It lists the number of products, the total metres, metres per product (3 decimals), and plan and fact by part. The plan is P × n / N in hundredths, rounded half up, counted once per part. The check step also shows each pair's balance now and after the issue, and warns when a balance goes below zero. «Записати» sends the package, and «Назад до форми» returns to the form.                                                                         |
| Repeats and conflicts | The operation id lives as long as the form. The order version, the plan version and each pair version are sent. A 409 shows the server's reason.                                                                                                                                                                                                                                                                                                                                                                                           |
| Card                  | The card shows the fabric, the quantity, metres issued and the version of the saved plan. Its plan table has a row per part (with its layer), with planned, covered, still to cut, issued, reserved and available metres. A shortage is shown in red. The card also shows why there is no plan, and a notice when the order is closed. Each issue shows its products, its lines (voided lines struck through, with layer and note) and a plan and fact table. «Оновити план» appears once a plan is saved. «Сторно видачі» takes a reason. |
| Access                | The «Тканина» tab reads the card through the orders endpoint, so people who see orders see it. Issue, «Оновити план» and the warehouse search use the `fabric-stock` endpoints.                                                                                                                                                                                                                                                                                                                                                            |

## Contract

The snapshot is synced from BreviERP. The admin uses:

- `GET /api/warehouse/fabric-stock/issue-items?search`
- `GET …/issue-items/{orderId}/{itemId}`
- `POST …/issue-items/{orderId}/{itemId}/issues`
- `POST …/issue-items/{orderId}/{itemId}/plan`
- `GET /api/warehouse/orders/{id}/items/{itemId}/fabric`
- `POST /api/warehouse/orders/{id}/fabric-issues/{issueId}/reverse`

## Acceptance

| TZ            | Test                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------- |
| A16, A17      | `item-issue-form.test.ts`: «counts the plan of a cut…» and «compares two lines of one part…» |
| A13–A15       | `item-issue-form.test.ts`: «calls a line planned, replacement or additional…»                |
| A20           | `item-issue-form.test.ts`: «refuses more products than the item has»                         |
| §7 check step | `item-issue-drawer.component.test.tsx`                                                       |
| Card mapping  | `item-fabric.mapper.test.ts`                                                                 |
| Item tab      | `production-order-page.component.test.tsx`: «shows the fabric plan of an item…»              |

## File map

```text
libs/admin/warehouse/model/src/
  entities/issues/item-fabric.ts          # card, plan part, issue with plan and fact, layers, bodies
  forms/item-issue/item-issue-form.ts     # values, purposes, comparison plan, validation, check step, body
libs/admin/warehouse/data-access/src/
  api/item-fabric.api.ts                  # issue-items search, card (orders or stock), issue, refresh, reversal
  mappers/item-fabric.mapper.ts
libs/admin/warehouse/ui/src/
  panels/item-fabric/item-fabric-card.tsx
  forms/item-issue/item-issue-form.tsx, item-issue-preview.tsx
  components/issue-items/fabric-issue-item-list.tsx
libs/admin/warehouse/feature/src/
  components/item-issue/                  # ItemFabricSection (exported), issue drawer, «Видача на завдання» drawer
  hooks/item-issue/                       # issue in two steps, «Сторно видачі»
libs/admin/production/feature/src/components/tracking/production-item-work.tsx # uses ItemFabricSection
```
