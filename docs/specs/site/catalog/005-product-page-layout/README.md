# Catalog, stage 5: product page layout «Ціна поруч»

**Status:** implemented and verified locally 2026-11-12.
**Variant:** `nextjs`.
**Source:** owner request 2026-11-12 («сторінка товару перевантажена»), UX analysis with three concepts; the owner chose concept B «Ціна поруч».
**Feature card:** [site catalog](../../../../features/site/catalog.md).

## Problem

The short facts staff write for a model (often 7–9 paragraphs) stood between the name and the prices, so the prices and «Залишити заявку» were below the first screen on a laptop and 3–4 screens down on a phone. The same facts were repeated in the description and the characteristics, the section numbers «01 / 02 / 03» repeated the breadcrumbs, and the price table did not show that a larger order is cheaper.

## Decisions

- **Order card right under the name.** Next to the photo: tags (short facts without a label, such as «Чоловіча»), the model number, the name, one line «Підходить для професій: …» cut to three lines, other short notes, then the order card.
- **Order card:** «від» and the lowest price of the chosen fabric in large type; fabrics as cards with their composition; three price tiles 1–9 / 10–39 / від 40 with the 40+ tile highlighted; under the 10–39 and 40+ prices the saving per piece against 1–9 in whole hryvnias, in red: «Економія 485 грн/шт» (owner 2026-11-12: hryvnias, not percent, and no minus sign so it is not read as a surcharge; red). «Залишити заявку» (owner kept the wording) and the phone, the line «Менеджер передзвонить за 15 хвилин…», the three facts, and the size chart.
- **Tiers stay** «1–9 шт» together with «Від 5 виробів» (owner 2026-11-12).
- **Short facts go into the characteristics.** A fact with a bold label, or typed as «Назва : значення», becomes a row of the first table «Коротко про модель»; the characteristics show it next to the garment tables (two columns on a wide screen). The facts are no longer printed as paragraphs next to the photo.
- **Links to the blocks** under the first screen: Характеристики · Опис · Схожі моделі · Таблиця розмірів.
- **Description folded** to about six lines with «Читати повністю»; the full text stays in the HTML, and without JavaScript it is not folded.
- **No section numbers** on the product page; the order block keeps its label without a number.
- **Photo stays in view** (sticky) on a wide screen while the right column scrolls.
- **Phones:** a strip with «від … грн» and «Заявка» above the site bottom bar. It hides while the order card or the footer is on the screen.

## Scenarios

1. On a laptop the visitor sees the photo, the name, who the model is for, the lowest price, the fabrics, and the price tiles without scrolling.
2. Picking another fabric changes «від», the three prices, and the savings.
3. A 10–39 or 40+ price lower than the 1–9 price shows «Економія N грн/шт»; an equal price shows nothing.
4. On a phone, after scrolling past the order card, the strip with the price and «Заявка» is visible; it hides over the order card and the footer.
5. A product without prices shows «Дізнатися ціну» and no strip.

## Not in this stage

- A «тканина на фото» mark per fabric (needs a field in the Admin).
- The «Чому ця модель» block of concept C (needs new Admin fields).

## Structure check

No new library. The fact sorting is a pure function in `site-catalog-model` (`splitCatalogProductFacts`). In `site-catalog-ui`: the order card (`catalog-product-buy`, server) and its prices (client), the block links (server), the folded text and the phone price strip (two small client components). The page in `site-catalog-feature` composes them. One new colour token `sale` in the design system.
