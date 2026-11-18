import {
  QuoteIntroMainProducts,
  emptyIntroSlot,
  newPage,
  productIntroSlot,
} from './quote-intro-draft-mapper';
import { quoteIntroSeasons } from '../../forms/introduction/quote-intro-draft';

import type { QuoteCatalogProduct, QuoteCatalogVariant } from '../../entities/items/quote-catalog';
import type {
  QuoteIntroLayout,
  QuoteIntroTemplate,
} from '../../entities/settings/quote-introduction';
import type {
  QuoteIntroDraft,
  QuoteIntroSlotDraft,
} from '../../forms/introduction/quote-intro-draft';

/** Another layout keeps the pages of the seasons that stay and starts the new ones from the main model. */
export function setIntroLayout(
  draft: QuoteIntroDraft,
  layout: QuoteIntroLayout,
  main: QuoteIntroMainProducts,
): QuoteIntroDraft {
  return {
    ...draft,
    layout,
    pages: quoteIntroSeasons(layout).map(
      (season) =>
        draft.pages.find((page) => page.season === season) ?? newPage(season, main[season]),
    ),
  };
}

export function updateIntroSlot(
  draft: QuoteIntroDraft,
  slotKeyToChange: string,
  change: (slot: QuoteIntroSlotDraft) => QuoteIntroSlotDraft,
): QuoteIntroDraft {
  return {
    ...draft,
    pages: draft.pages.map((page) => ({
      ...page,
      slots: page.slots.map((slot) => (slot.key === slotKeyToChange ? change(slot) : slot)),
    })),
  };
}

/** A different model for a slot drops the saved item: the new one takes the Catalog price. */
export function chooseIntroModel(
  slot: QuoteIntroSlotDraft,
  product: QuoteCatalogProduct,
  variant: QuoteCatalogVariant | null,
): QuoteIntroSlotDraft {
  if (slot.productId === product.productId) return chooseIntroFabric(slot, variant);
  return { ...productIntroSlot(product, variant), key: slot.key };
}

export function chooseIntroFabric(
  slot: QuoteIntroSlotDraft,
  variant: QuoteCatalogVariant | null,
): QuoteIntroSlotDraft {
  return { ...slot, articleId: variant?.articleId ?? null, fabricTitle: variant?.title ?? null };
}

const usable = (variant: QuoteCatalogVariant | undefined): variant is QuoteCatalogVariant =>
  variant !== undefined && variant.problem === null;

/**
 * «Готові шаблони»: the template's layout, letter and models with current Catalog data. A model or fabric the
 * Catalog no longer offers leaves its slot empty with the reason.
 */
export function applyIntroTemplate(
  draft: QuoteIntroDraft,
  template: QuoteIntroTemplate,
  products: ReadonlyMap<number, QuoteCatalogProduct>,
): QuoteIntroDraft {
  const letterName = template.letterName ?? draft.letterName;
  const sameLetter = letterName === draft.letterName;
  return {
    ...draft,
    layout: template.layout,
    letterName,
    letterSubject: sameLetter ? draft.letterSubject : null,
    letterBody: sameLetter ? draft.letterBody : null,
    pages: template.pages.map((page) => ({
      season: page.season,
      slots: page.models.map((model) => {
        const product = products.get(model.productId);
        if (!product || product.problem)
          return emptyIntroSlot(`«${model.productName}» більше немає в каталозі.`);
        const variant = product.variants.find((x) => x.articleId === model.articleId);
        return usable(variant)
          ? productIntroSlot(product, variant)
          : {
              ...productIntroSlot(product),
              problem: `Тканина «${model.fabricTitle}» недоступна: оберіть іншу.`,
            };
      }),
    })),
  };
}

/** All product ids of the draft, for loading their fabrics from the Catalog. */
export function introProductIds(draft: QuoteIntroDraft): number[] {
  return [
    ...new Set(
      draft.pages.flatMap((page) =>
        page.slots.map((slot) => slot.productId).filter((id): id is number => id !== null),
      ),
    ),
  ];
}

/** The від 41 шт. price of a slot: the saved one for the saved fabric, else the Catalog one. */
export function introSlotPrice(
  slot: QuoteIntroSlotDraft,
  product: QuoteCatalogProduct | undefined,
): number | null {
  if (slot.itemId !== null && slot.articleId !== null && slot.articleId === slot.savedArticleId)
    return slot.savedPrice;
  return product?.variants.find((x) => x.articleId === slot.articleId)?.prices?.large ?? null;
}
