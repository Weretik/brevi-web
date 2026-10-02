# Операції — проєктування frontend

## Наявний контекст

- `garment-parts-page.tsx` тримає локальний tab, за замовчуванням «Роботи».
- `garment-parts-content.tsx` і `garment-part-operations-content.tsx` поєднують
  list/selection, active dialog, delete flow і notifications.
- Обидва grids мають action columns і лише feature-specific `noRowsLabel`.
- `garment-part-dialog.tsx` та `garment-part-operation-dialog.tsx` поєднують
  view/create/edit; editor hooks і validation відокремлені.
- Data-access domain folders мають list/create/update/delete. GET-by-ID немає.
- Форма роботи залежить від `getGarmentParts`; current hook уже розрізняє
  loading/error/retry lookup.
- Реальні Nx tests/targets є в `admin-references-feature`,
  `admin-references-data-access`, `admin-react`, `admin-react-e2e`.

## Відповідальності

| Область    | Відповідальність                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| Data       | Чинні list/writes і lookup повторно використовуються; активний рядок надає дані view/edit Drawer.          |
| State      | URL володіє tab; list content володіє лише active editor descriptor; editor hooks — draft/write lifecycle. |
| UI         | Shared MUI Drawer shell; domain Drawer на сутність володіє view/create/edit fields і Paper sections.       |
| Navigation | Базовий route і query tab не змінюються під час роботи Drawer.                                             |
| Locale     | Shared locale owner — products/003 TS-001; feature лишає лише domain empty text.                           |
| Tests      | Unit validation, API integration, component/menu/pages, router integration й paired E2E.                   |

## Початковий аудит

| Область           | Поточні ролі                  | Рішення                                                                 | Ціль                  |
| ----------------- | ----------------------------- | ----------------------------------------------------------------------- | --------------------- |
| paired page       | tab і panels                  | зробити URL owner, лишити composition                                   | page/router tests     |
| contents          | fetch, dialog, delete, alerts | замінити dialog descriptor на Drawer descriptor, зберегти orchestration | current contents      |
| grids             | columns, buttons, grid        | remove action col; reuse one menu pattern лише якщо API лишається ясним | grids/local component |
| dialogs           | presentation + mode           | замінити MUI Dialog на Drawer; reuse hooks/validation                   | domain Drawer         |
| operation content | list плюс parts lookup        | lookup тримати в orchestration і передавати Drawer через typed props    | content/editor hook   |
| data-access       | list/writes                   | повторно використати чинні boundaries без ручного detail DTO            | domain folders        |

## Точні межі реалізації

- URL-вкладкою володіє
  `libs/admin/references/feature/src/pages/garment-parts/garment-parts-page.tsx`; значення
  `tab=parts|operations` зберігається під час навігації й reload.
- List orchestration, active Drawer descriptor і delete confirmation лишаються
  у `garment-parts-content.tsx` та `garment-part-operations-content.tsx`.
- `garment-parts-grid.tsx` і `garment-part-operations-grid.tsx` лишаються
  власниками колонок Data Grid та підключають наявні
  `use-reference-row-context-menu.ts` і `reference-row-context-menu.tsx`.
- `reference-editor-drawer.tsx` володіє спільним адаптивним MUI shell,
  доступним header, form submit guard і footer actions.
- `garment-part-drawer.tsx` і `garment-part-operation-drawer.tsx` володіють
  лише domain fields, read-only sections і lookup presentation; editor hooks
  володіють draft, validation і writes.
- Detail/editor routes не додаються: явне UX-рішення 2026-10-01 використовує
  list-backed Drawer, тому GET-by-ID не потрібний у поточному scope.
- Generated transport boundary лишається в
  `libs/admin/references/data-access/src/{garment-parts,garment-part-operations}`;
  ручні detail DTO до контракту не створюються.

## Референси

- Local: `detail-customer-payments.png`, `detail-section-cards.png`,
  `create-order-basic-billing.png`, `create-order-line-items.png`.
- Official: [MUI Menu context example](https://mui.com/material-ui/react-menu/#context-menu),
  [Data Grid row customization](https://mui.com/x/react-data-grid/components/#row),
  [localization](https://mui.com/x/react-data-grid/localization/),
  [Card](https://mui.com/material-ui/react-card/) і
  [responsive Grid](https://mui.com/system/react-grid/).

## Ризики

- Drawer view/edit доступний для рядків, наявних у поточному списку; deep link
  до відкритого Drawer не є частиною scope.
- Видалення елемента може мати backend conflict через залежні роботи; чинне
  повідомлення не можна замінювати локальним припущенням.
- Keyboard context action має бути відокремлена від grid cell editing/selection.
