# Site design system «Строчка»

These are the visual rules for `apps/site`. The source is design «Строчка» (variant 1), which the client chose on 2026-10-30. It is described in [ideas/storefront-nextjs](../../ideas/storefront-nextjs/README.md) and on the [design canvas](https://claude.ai/artifact/8j58cwfD6SB2wCDPmudWGU), page «Новий дизайн».

- **Tokens** will live in `apps/site/src/app/global.css`.
- **Primitives** in `libs/site/shared/ui` follow shadcn/ui (`new-york`) on Radix UI with Tailwind CSS v4, and are added with `npx shadcn@latest add`.

## Principles

- **Answer "what and how much" first.** The first screen shows: "we sew ourselves", the minimum batch, three price tiers, and "VAT included".
- **The main action is a call or a request.** There is no checkout or online payment.
- **Light, technical, calm.** Less orange than the current site. No big banners, video, or autoplay animation.
- **The stitch motif is the only decoration.** It appears as dashed orange seams between blocks and as numbered callouts on product photos.
- **Real text instead of images of text.** Prices, sizes, size charts, and specs are always text.

## Tokens

| Token                            | Value                 | Use                                                                            |
| -------------------------------- | --------------------- | ------------------------------------------------------------------------------ |
| `background`                     | `#FFFFFF`             | page                                                                           |
| `foreground`                     | `#262626`             | text, headings                                                                 |
| `muted`                          | `#F6F6F4`             | quiet panels, inputs, table headers                                            |
| `muted-foreground`               | `#5E5E58`             | secondary text                                                                 |
| `border`                         | `#ECECE9`             | lines inside cards                                                             |
| `border-strong`                  | `#E2E2DE`             | header and field borders                                                       |
| `primary` / `primary-foreground` | `#262626` / `#FFFFFF` | main buttons (graphite), phone button                                          |
| `brand`                          | `#FD9600`             | stitch line, callout rings, phone icon, best-price highlight. Never body text. |
| `brand-soft`                     | `#F6C27A`             | the second, softer stitch line                                                 |
| `brand-text`                     | `#9A5A00`             | orange text on white (labels such as «01 — ШИЄМО САМІ», links in accents)      |
| `brand-surface`                  | `#FFF5E6`             | background of the highlighted 40+ price cell                                   |
| `ring`                           | `#FD9600` at 45%      | focus                                                                          |

`#FD9600` on white fails WCAG AA for text, so orange text always uses `brand-text`. Text on an orange fill is graphite (`foreground`), never white. There is no dark theme in the first version, because the client asked for a light site.

## Type, shape, icons

- **Fonts:** Manrope (400–800) for the interface, and IBM Plex Mono (400–600) for numbers, SKUs, prices, quantities, and step labels. Both load through `next/font` with the Cyrillic subset.
- **Sizes on desktop:** H1 50 px at weight 800 with letter spacing −0.025em, H2 30 px at weight 800, body 16 px, secondary text 13–14 px. On a phone, H1 is 32–36 px.
- **Radii:** 8 px for fields and buttons, 14 px for cards and panels.
- **Icons:** lucide with stroke width 1.75. No brand icons from CDNs; social icons are local SVGs.
- **Motion:** only as a response to the user: menus open, «До заявки» briefly turns into «Додано», and the request counter changes. Everything respects `prefers-reduced-motion`.

## Signature elements

| Element         | Rule                                                                                                                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stitch divider  | a `2px dashed` line in `brand`, 48 px or full width, before a step label in IBM Plex Mono («01 — ШИЄМО САМІ»). Decorative: `aria-hidden`.                                                    |
| Photo callouts  | numbered circles (26 px, graphite fill, white digit, white and orange rings) placed on the product photo, with a legend in text next to it. Without the legend the numbers carry no meaning. |
| Price tiers     | a three-cell grid «1–9 · 10–39 · 40+». The 40+ cell uses `brand-surface` and the label «найкраща ціна». Prices are in IBM Plex Mono, «з ПДВ».                                                |
| Fact strip      | three cells with a border (`від 5 шт`, `3 ціни`, `з ПДВ`): the value in mono 20 px and the caption 13 px below it.                                                                           |
| Request counter | the «Заявка» button in the header with a mono badge on `muted`.                                                                                                                              |

## Header

1. **Top line:** «Власне швейне виробництво · Полтава», working hours, UA/RU.
2. **Main line:**
   - Logo (the dark version on a light background).
   - Navigation: «Каталог», «Пошиття з логотипом», «Ціни для опту», «Галузі», «Про виробництво», «Контакти».
   - Search, «Заявка (n)», and the phone button (graphite with an orange icon).
   - The header stays visible on scroll.
3. **Catalog:** a mega menu with every section and subsection from BreviERP. Real `<a href>` links only.
4. **Phone:** the menu in a side `Sheet`, search on its own row, and the phone and request as icons. The phone link is `tel:`.

## Product photos

- Product on a white background, in one square format and one scale for the whole catalog. The client prepares them.
- Use `next/image`, and give the main product photo `priority`.
- Alt text names the product and the view («Куртка ДИКСОН — вигляд ззаду»). File names are in Latin letters, without spaces.
- Without a photo, show a neutral `muted` panel with the category icon.

## Accessibility

- A skip link to `#content` and a visible focus ring.
- Labels on icon buttons, and `aria-current` on the active language and the current menu item.
- Form fields have visible labels, and errors are written in text next to the field.
- The calculator and the size inputs work from the keyboard, and the total updates in an `aria-live="polite"` region.
- Contrast is at least 4.5:1 for text: check every new colour pair against the tokens above.
