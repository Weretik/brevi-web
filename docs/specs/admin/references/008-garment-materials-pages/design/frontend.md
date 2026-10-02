# Тканина та фурнітура — проєктування frontend

## Наявний контекст

- Route: `apps/admin-react/src/app/router/app-router.tsx` має лише
  `/references/garment-accessory`.
- Вкладки: `garment-accessories-page.tsx`; локальний numeric tab не відновлюється
  через URL. Content-компоненти володіють списком, selection, dialog state і delete.
- Таблиці: `components/garment-accessories/garment-accessories-grid.tsx` і
  `components/fabrics/fabrics-grid.tsx` мають action columns і частковий localeText.
- Форми: `garment-accessory-dialog.tsx`, `fabric-dialog.tsx` та editor hooks
  змішують view/create/edit у MUI Dialog; validation уже окреме в `model/`.
- Дані: `libs/admin/references/data-access/src/garment-accessories/` і
  `src/fabrics/`; зараз є list/create/update/delete, але немає GET by ID.
- Lookup постачальників уже читається через reference data-access.
- Tests/targets: `admin-references-feature`, `admin-references-data-access`,
  `admin-react`, `admin-react-e2e`; focused tests для обох вкладок існують.

## Відповідальності

| Область   | Відповідальність і шляхи                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| Стан/дані | List rows живлять view/edit Drawer; write semantics, validation і supplier lookup повторно використані.            |
| React Web | List content оркеструє active editor; domain Drawer з'єднують hooks із details/form, shared shell — MUI lifecycle. |
| Навігація | List tab належить URL query; Drawer не змінює базовий route або selection.                                         |
| UI        | Обидва grids використовують один локальний MUI Menu pattern; без власного Menu/Popover primitive.                  |
| Locale    | Залежність від `products/003.../TS-001`; локальні grids не дублюють повний locale object.                          |
| Перевірка | Unit validation, data-access integration, page/component interactions, один E2E journey на кожну вкладку.          |

## Початковий аудит

| Файл/область                   | Наявні ролі                              | Рішення                                                                           | Цільові шляхи                                                                                       |
| ------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `garment-accessories-page.tsx` | title, local tabs, panels                | Зберегти page composition; tab синхронізувати з URL                               | цей файл і route tests                                                                              |
| `*-content.tsx`                | fetch, selection, dialogs, notifications | Прибрати active dialog; навігація передає row ID                                  | чинні content files                                                                                 |
| `*-grid.tsx`                   | columns, actions, grid                   | Прибрати actions col; спільний menu pattern лише за реальним повтором             | `components/reference-row-actions/reference-row-context-menu.tsx` у feature або два малі компоненти |
| `*-dialog.tsx`                 | view/create/edit UI                      | Замінити page editor/detail; editor hook зберегти й адаптувати до route lifecycle | запропоновані `pages/*-detail-page.tsx`, `*-editor-page.tsx`, `components/*/*-form.tsx`             |
| data-access API                | list і writes                            | Додати generated GET-by-ID після EN-001, runtime mapping повторно використати     | чинні domain folders                                                                                |

## Поточні межі Drawer реалізації

- `components/reference-editor/reference-editor-drawer.tsx` володіє спільним MUI shell,
  доступним header, responsive paper, form submit guard і footer actions.
- `garment-accessory-drawer.tsx` і `fabric-drawer.tsx` є domain containers:
  з'єднують editor hook, shared shell і перемикання details/form.
- `garment-accessory-details.tsx` і `fabric-details.tsx` володіють лише
  read-only presentation відповідного домену.
- `garment-accessory-form.tsx` і `fabric-form.tsx` володіють editable MUI fields,
  field errors і supplier loading/error presentation, але не API state.
- `use-garment-accessory-editor.ts` і `use-fabric-editor.ts` володіють draft,
  validation, supplier lifecycle та create/update writes.
- Contents/pages володіють list, selection, notifications, delete confirmation
  й active editor descriptor; grids — columns і shared row context menu binding.
- Direct detail routes не додаються: явне UX-рішення 2026-10-01 використовує
  list-backed Drawer, тому GET-by-ID не потрібний у поточному scope.

## Референси й рішення

- Local: `detail-section-cards.png`, `edit-product-layout.png`,
  `create-order-basic-billing.png`; повний перелік у
  `docs/specs/admin/table-visual-guidance.md`.
- Official: [MUI context Menu](https://mui.com/material-ui/react-menu/#context-menu),
  [Data Grid row slot](https://mui.com/x/react-data-grid/components/#row),
  [Data Grid locale](https://mui.com/x/react-data-grid/localization/),
  [Card](https://mui.com/material-ui/react-card/),
  [responsive Grid](https://mui.com/system/react-grid/).
- Read by ID є обов'язковим для надійного direct URL. Пошук рядка лише в
  завантаженому list не є контрактом detail.

## Ризики

- Drawer view/edit доступний для рядків активного списку; deep link до відкритого
  Drawer не входить у scope.
- URL ranking має не сприймати `accessories`/`fabrics` як numeric ID.
- Supplier name є чинним write contract; SDD не вигадує supplier ID.
