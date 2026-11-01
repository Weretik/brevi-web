# Admin design system «Цех»

This is the visual standard for Brevi Admin (`apps/admin-react`). The product owner chose it on 2026-10-31 from the [concept canvas](https://claude.ai/artifact/TngCUEwEgSToLaXK3oaaSJ) (concept 2 «Цех»). Every **new** Admin feature follows this page. Existing pages are not restyled without a separate request; they only receive what the theme gives them automatically. Language, states, and accessibility are in the [Admin UI rules](admin-ui.md); folders are in the [code organization rules](admin-code-organization.md). The public site has its own standard, [«Строчка»](../site/design-system.md).

The character is a **work console for the office and the sewing shop**: light graphite grounds, white surfaces with thin borders, an always-dark sidebar, dense data, numbers in a monospace face, and Brevi orange as the only accent. No decoration: every element shows data or starts an action.

## Where the tokens live

All tokens are code; this page describes them, the code is the source of truth.

| File                                                         | Owns                                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `apps/admin-react/src/app/theme/palette.ts`                  | `breviBrand`, light and dark palettes, including `palette.navigation`     |
| `apps/admin-react/src/app/theme/typography.ts`               | IBM Plex Sans, `monoFontFamily`, the type scale                           |
| `apps/admin-react/src/app/theme/motion.ts`                   | Durations and easing; mapped onto `theme.transitions` in `brevi-theme.ts` |
| `apps/admin-react/src/app/theme/components.ts`               | MUI component overrides (radii, borders, states, reduced motion)          |
| `apps/admin-react/src/app/theme/brevi-theme.ts`              | Assembles the theme, `shape.borderRadius: 8`, Ukrainian locales           |
| `libs/admin/core/shell/src/navigation/navigation-palette.ts` | The `NavigationPalette` type and its MUI palette augmentation             |
| `apps/admin-react/index.html`                                | Font loading (Google Fonts, Cyrillic) and `noindex`                       |

Feature code uses theme paths (`primary.main`, `primary.dark`, `text.secondary`, `divider`, `background.paper`, `success.light`, `theme.transitions.create(...)`) and never hex values, font stacks, or durations. A new token goes into the theme first and onto this page second.

## Color

Brand: **orange `#FD9600`** and **graphite**. Orange is a fill, never body text.

| Role                                       | Theme path             | Light     | Dark      |
| ------------------------------------------ | ---------------------- | --------- | --------- |
| Page ground                                | `background.default`   | `#EEEEEB` | `#09090B` |
| Surface (cards, tables, menus, dialogs)    | `background.paper`     | `#FFFFFF` | `#17171B` |
| Text                                       | `text.primary`         | `#1F1F1F` | `#F0F0F0` |
| Secondary text, column titles              | `text.secondary`       | `#5F5F5A` | `#A6A6AE` |
| Borders, row lines                         | `divider`              | `#E3E3DF` | `#26262C` |
| Hover row, quiet panel                     | `action.hover`         | `#F4F4F1` | `#1F1F24` |
| Accent fill (primary button, active item)  | `primary.main`         | `#FD9600` | `#FD9600` |
| Text and icons on the accent fill          | `primary.contrastText` | `#1D1D1D` | `#1D1D1D` |
| Accent soft surface (selected, highlights) | `primary.light`        | `#FFF3E0` | `#2B2113` |
| Orange text and links                      | `primary.dark`         | `#9A5A00` | `#FFB547` |
| Inverse surface (tooltips, selected chip)  | `secondary.main`       | `#1F1F1F` | `#F0F0F0` |

Sidebar (`palette.navigation`, the same in both themes except the surface):

| Role                       | Key                | Light     | Dark      |
| -------------------------- | ------------------ | --------- | --------- |
| Surface                    | `background`       | `#1E1E1E` | `#0F0F12` |
| Text                       | `text`             | `#F0F0F0` | `#F0F0F0` |
| Section headings, inactive | `textMuted`        | `#B5B5AE` | `#B5B5AE` |
| Hover                      | `hover`            | `#2A2A28` | `#1C1C21` |
| Lines                      | `divider`          | `#2E2E2C` | `#202024` |
| Active item                | `activeBackground` | `#FD9600` | `#FD9600` |
| Text on the active item    | `activeText`       | `#1D1D1D` | `#1D1D1D` |

Statuses use `success`, `warning`, `error`, and `info`: `.main` is the text and icon color, `.light` is the soft pill or alert background.

| Status    | Light `.main` / `.light` | Dark `.main` / `.light` | Example meaning                 |
| --------- | ------------------------ | ----------------------- | ------------------------------- |
| `success` | `#1F7A3A` / `#E5F3E8`    | `#6CD08A` / `#132619`   | Погоджено, Оплачено, Готово     |
| `warning` | `#8A5A00` / `#FFF0D1`    | `#FFC864` / `#2A2110`   | Чекає відповіді, мало на складі |
| `error`   | `#B42318` / `#FDE9E7`    | `#FF8A80` / `#2E1513`   | Відмова, прострочено            |
| `info`    | `#175CD3` / `#E6EEFC`    | `#8DB4FF` / `#141F33`   | Надіслано, у роботі             |

Rules:

- `#FD9600` on white is about 2:1, so orange text always uses `primary.dark`. Text on an orange fill is graphite (`primary.contrastText`), never white.
- One orange action per area. Orange marks the main action, the active menu item, progress bars, and one highlighted value; it is not decoration.
- Status colors mark state only. A status always has a text label, never color alone.
- In this palette `primary.light` and `primary.dark` are roles (soft surface and orange text), not shades. In the dark theme `primary.dark` is lighter than `main`.

## Typography

[IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) (400–700) for the interface and [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (400–600) for data, both with Cyrillic, loaded in `apps/admin-react/index.html`.

| Use                                     | Variant               | Size / weight                              |
| --------------------------------------- | --------------------- | ------------------------------------------ |
| Page title (one per page)               | `h1`                  | 28 px / 700 (dense pages: 22 px with `h4`) |
| Section in a page                       | `h5`                  | 18 px / 700                                |
| Card title                              | `h6`                  | 13 px / 700, uppercase, 0.06em tracking    |
| Body                                    | `body1`               | 14 px / 400                                |
| Table cells, secondary lines            | `body2`               | 13 px / 400                                |
| Buttons, menu items                     | `button`, `subtitle2` | 14 px / 700 and 13 px / 600, sentence case |
| Column titles, metric labels, overlines | `overline`            | 11 px / 600, uppercase                     |
| Metadata                                | `caption`             | 12 px                                      |

Document numbers (`КП-1048`, `ЗМ-311`), sums, quantities, percentages, and dates use the mono face through the CSS variable `var(--admin-font-mono)` (set from `monoFontFamily` in `MuiCssBaseline`) with `fontVariantNumeric: 'tabular-nums'`, and numbers are right-aligned in tables. Buttons are never uppercase.

## Shape, spacing, and density

- 8 px grid. Page padding: 16 px on phones, 24 px on tablets, 28 px on desktop; gap between cards 16 px.
- Radii: 6 px for controls (buttons, inputs, icon buttons, chips, menu items), 8 px for cards, papers, tables, and menus, 10 px for dialogs, 999 px only for status pills.
- Elevation is a 1 px `divider` border. Shadows only on floating layers: menus, the sidebar flyout, dialogs.
- Density is high: table rows 40–44 px, card padding 16 px, controls 40 px high (32 px small). Minimum touch target 40 px.

## Motion

| Token        | Value                            | Used for                                    |
| ------------ | -------------------------------- | ------------------------------------------- |
| `fast`       | 150 ms                           | Hover, press, color changes                 |
| `base`       | 250 ms                           | Menus, tooltips, entering elements          |
| `slow`       | 350 ms                           | Sidebar width, theme switch, layout changes |
| `easing.out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Default                                     |

- Animate only `opacity`, `transform`, colors, and, for the sidebar, `width` and `margin-left`.
- Press feedback: buttons scale to 0.98, icon buttons to 0.94 (theme overrides).
- `prefers-reduced-motion: reduce` turns animation off globally (`MuiCssBaseline`). Do not bypass it.

## Shell

Implemented in `libs/admin/core/shell`; pages render inside its `Outlet` and never draw their own header or menu.

- **Sidebar (desktop `lg` and up):** permanent, always graphite (`palette.navigation`). Width 272 px expanded, 80 px collapsed. Order: logo, «Головна» (`/`), section headings «Робота» and «Дані», groups with an icon, label, and chevron, then «Згорнути меню» at the bottom.
- **Groups:** a 42 px row; clicking expands the item list under a thin line. The group that contains the current page opens by itself. Items are 36 px with a dot; the current item is filled orange with graphite text and has `aria-current="page"`. Items without a ready page stay visible, muted, with «Ще не доступно», and are not links.
- **Collapsed sidebar:** only icons stay; labels fade out. Hovering, clicking, or pressing Enter on a group icon opens a flyout to the right with the group name and its items; Tab moves into the links, Escape or clicking away closes it. «Головна» and the toggle show a tooltip. The group with the current page is highlighted with an orange icon. The choice is remembered in the browser (`brevi-admin:navigation-collapsed`).
- **Phones and tablets:** the menu button in the top bar opens the same sidebar as a temporary drawer; it never collapses. Choosing a page closes it and returns focus to the menu button.
- **Top bar:** sticky, 64 px, translucent `background.default` with blur and a bottom border. Left: menu button (below `lg`) and breadcrumbs «Група › Сторінка» from the navigation (`aria-current="location"` on the last part; on phones only the page). Right, in this order: the search field (260–340 px with `Ctrl K`; an icon button below `md`), notifications, the theme menu, and the profile avatar. Icon buttons are outlined 40 px; the avatar is 40 px on `primary.light` with `primary.dark` icon.
- **Theme:** light by default; «Світла», «Темна», «Системна» in the theme menu; the choice is stored under `theme` (compatible with the old Angular Admin).
- **Top bar actions without a backend yet:** search opens a short note «Пошук скоро з'явиться», notifications show «Нових сповіщень немає», and the profile menu shows «Профіль скоро з'явиться». «Вийти» in the profile menu works now (`useAdminShellLogout`; hidden when the app gives no logout). When a backend appears, replace the note with the real feature in the same place: search results in the popover, an orange dot on notifications for unread items, the user's initials in the avatar.

## Page patterns

Use these for new pages. Prefer MUI components and the theme overrides; do not restyle them locally.

- **Page header:** one `h1` (or `h4` with `component="h1"` on dense pages), a `body2` secondary line (count, update time), and actions on the right: secondary actions `outlined`, one `contained` primary action (orange, graphite text) with a text label.
- **Metric strip:** one bordered paper split into 4–6 equal cells by vertical `divider` lines. Each cell: `overline` label, a 22 px mono value, and an optional short colored note (`success.main` for growth, `error.main` for attention). It wraps to 3 and then 2 columns.
- **Data card:** `Card` (outlined, 8 px) with a header row: `h6` title on the left, filter chips or a `primary.dark` text link on the right. Tables sit inside it and scroll horizontally inside the card.
- **Filter chips:** 28 px chips, 6 px radius; the selected chip is the inverse surface (`secondary.main`). Counts go into the label («Чекають 8»).
- **Tables:** MUI X Data Grid with the theme override: uppercase 11 px column titles in `text.secondary`, `divider` row lines, `action.hover` on hover, orange focus outline. Document numbers and numbers in mono; numbers right-aligned; statuses as pills.
- **Status pill:** 24 px, 999 px radius, a 6 px dot, `.light` background and `.main` text, always with a label.
- **Stage board (kanban):** columns on `action.hover` with a colored dot, the stage name, and a count; cards on `background.paper` with a mono number and due date (overdue in `error.main`), title, client and quantity, a 4 px orange progress bar, and a percentage. Columns scroll horizontally on narrow screens. Use it for flows with stages (sewing orders, deals).
- **Side cards:** a right column of 320–340 px on wide screens (cash balance, workload lists with thin bars); below `lg` it moves under the main content.
- **States:** every server-data area shows loading, empty, error with «Повторити», and forbidden states per the [Admin UI rules](admin-ui.md). Empty and error messages are short and in Ukrainian.
- **Dialogs and alerts:** dialogs 10 px radius with a 700-weight title; alerts use the tone `.light` surface, `text.primary` text, and a tone icon. Destructive confirmations use a contained `error` button.

## Checklist for a new feature

1. Colors, fonts, radii, and durations come only from the theme.
2. One orange primary action per area; orange text uses `primary.dark`.
3. Numbers, sums, document numbers, and dates are mono and tabular; numbers right-aligned.
4. Statuses are pills with text.
5. Loading, empty, error, and forbidden states exist.
6. Checked in light and dark themes, at phone, tablet, and desktop widths, with the sidebar expanded and collapsed.
7. New routes are added to `apps/admin-react/src/app/router/legacy-menu.ts` so they appear in the sidebar and breadcrumbs.

## Do and don't

- Do keep pages dense and scannable: labels small, values large.
- Do use the sidebar and breadcrumbs for navigation instead of in-page back links where possible.
- Don't add gradients, glass effects (except the top bar blur), colored left borders on cards, heavy shadows on flat content, or emoji as icons.
- Don't use white text on orange, orange body text, or color as the only signal.
- Don't introduce another typeface or local design tokens in a feature.
