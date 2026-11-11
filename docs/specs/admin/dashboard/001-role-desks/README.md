# Admin «Робочий стіл» by role (DESK-001)

**Status:** stage 1 implemented 2026-11-11. **Backend:** BreviERP [DESK-001](https://github.com/Weretik/BreviERP/blob/master/docs/sdd/specs/identity/003-role-desks/README.md) (role `Seo`, «Права доступу» group «Робочі столи»). **Source:** owner request 2026-11-11, [concept](https://claude.ai/artifact/BABr1LD9V1954wsa6w4Uip).

## Goal

The admin home `/` («Робочий стіл», the tile at the top of the sidebar) shows the desk of the person's role with the blocks of their work. The director and administrators get their own main desk and every other desk as foldable blocks (stage 5).

## Decisions

| ID  | Decision                                                                                                                                                                                                                                                                                                              |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | A desk is shown when the person has view on its «Права доступу» page: `desk-workshop` «Цех», `desk-sales` «Продажі» (stage 1 tabs); `desk-seo`, `desk-accounting`, `desk-main` come with their stages.                                                                                                                |
| D2  | Each block inside a desk also needs view on its own page (`production-orders`, `fabric-booking`, `hardware-order`, `quotes`); a missing right hides the block, the server refuses the data anyway.                                                                                                                    |
| D3  | One desk opens as it is, titled «Робочий стіл цеху» or «Робочий стіл менеджера». Several desks get tabs under «Робочий стіл»; the last chosen tab is kept in this browser (`brevi-admin:desk`). No desk: «Оберіть розділ у меню ліворуч.»                                                                             |
| D4  | Workshop desk: the old «Огляд виробництва» without КП and «Новий розрахунок»; plus «Не вистачає тканини» (pairs to order in red, pairs below zero in amber, at most five, link to «Бронь і що замовити») and «Фурнітура до замовлення» (largest five, link to the report). Blocks with nothing missing are not shown. |
| D5  | Until the manager desk (stage 2), «Продажі» keeps what the old home gave managers: «Клієнти», «Новий розрахунок» and «Останні КП».                                                                                                                                                                                    |
| D6  | New built-in role «SEO-фахівець» (`Seo`) is known to the session and «Користувачі» (title fallback); its desk comes in stage 3.                                                                                                                                                                                       |

## Stages

| Stage | Scope                                                                                        | Status                 |
| ----- | -------------------------------------------------------------------------------------------- | ---------------------- |
| 1     | Desk frame, tabs, workshop desk, interim «Продажі», role `Seo`                               | implemented 2026-11-11 |
| 2     | Manager desk: «Мій день» of leads, tasks that burn, own КП, own orders in the workshop       | planned                |
| 3     | SEO desk: «SEO-огляд» on the desk                                                            | planned                |
| 4     | Accountant desk: balances, the month, what waits for review, purchase invoices with problems | planned                |
| 5     | Director and admin main desk with «Потребує уваги»; every desk as a foldable block           | planned                |

## Tests

`npx nx test admin-dashboard-feature` (`dashboard-page.test.tsx`: workshop desk blocks, hidden blocks without rights, manager desk, tabs and remembered choice, no desk), `npx nx test admin-react` (`app-router.integration.test.tsx`: manager desk on `/`).
