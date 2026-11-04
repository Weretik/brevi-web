import { quoteIntroModelsPerPage, quoteIntroSeasons } from '../models/quote-intro-draft';

import type { Quote, QuoteItem } from '../entities/quote';
import type { QuoteCatalogProduct, QuoteCatalogVariant } from '../entities/quote-catalog';
import type {
  QuoteIntroductionSetup,
  QuoteIntroLayout,
  QuoteIntroSeason,
  QuoteIntroTemplate,
} from '../entities/quote-introduction';
import type {
  QuoteIntroDraft,
  QuoteIntroPageDraft,
  QuoteIntroSlotDraft,
} from '../models/quote-intro-draft';

let nextKey = 0;
const slotKey = () => `slot-${++nextKey}`;

/** The main models of the seasons from the setup. */
export type QuoteIntroMainProducts = Readonly<Record<QuoteIntroSeason, QuoteCatalogProduct | null>>;

export const mainProductsOf = (setup: QuoteIntroductionSetup): QuoteIntroMainProducts => ({
  Summer: setup.summer.product,
  Winter: setup.winter.product,
});

export function emptyIntroSlot(problem: string | null = null): QuoteIntroSlotDraft {
  return {
    key: slotKey(),
    itemId: null,
    productId: null,
    articleId: null,
    name: '',
    photoUrl: null,
    fabricTitle: null,
    savedPrice: null,
    savedArticleId: null,
    problem,
  };
}

/** A model just picked from the Catalog; the fabric is chosen afterwards unless given. */
export function productIntroSlot(
  product: QuoteCatalogProduct,
  variant: QuoteCatalogVariant | null = null,
): QuoteIntroSlotDraft {
  return {
    ...emptyIntroSlot(),
    productId: product.productId,
    articleId: variant?.articleId ?? null,
    name: product.name,
    photoUrl: product.photoUrl,
    fabricTitle: variant?.title ?? null,
  };
}

const itemSlot = (item: QuoteItem): QuoteIntroSlotDraft => {
  const option = item.options[0];
  return {
    key: slotKey(),
    itemId: item.id,
    productId: item.productId,
    articleId: option?.articleId ?? null,
    name: item.name,
    photoUrl: item.photoUrl,
    fabricTitle: option?.title ?? null,
    savedPrice: option?.prices.large.amount ?? null,
    savedArticleId: option?.articleId ?? null,
    problem: null,
  };
};

function newPage(season: QuoteIntroSeason, main: QuoteCatalogProduct | null): QuoteIntroPageDraft {
  return {
    season,
    slots: [
      main ? productIntroSlot(main) : emptyIntroSlot(),
      ...Array.from({ length: quoteIntroModelsPerPage - 1 }, () => emptyIntroSlot()),
    ],
  };
}

/** A new introduction: «Загальне», the main models with no fabric yet, the first letter. */
export function emptyIntroDraft(setup: QuoteIntroductionSetup): QuoteIntroDraft {
  const main = mainProductsOf(setup);
  return {
    version: 0,
    internalName: '',
    customerId: null,
    recipientEmail: '',
    recipientName: '',
    companyName: '',
    managerNote: '',
    layout: 'General',
    letterName: setup.letters[0]?.name ?? '',
    pages: quoteIntroSeasons('General').map((season) => newPage(season, main[season])),
  };
}

/** A saved introduction: its items go page by page, 4 per page. */
export function introToDraft(quote: Quote): QuoteIntroDraft {
  const layout = quote.introduction?.layout ?? 'General';
  return {
    version: quote.version,
    internalName: quote.internalName,
    customerId: quote.customerId,
    recipientEmail: quote.introduction?.recipientEmail ?? '',
    recipientName: quote.recipientName ?? '',
    companyName: quote.companyName ?? '',
    managerNote: quote.managerNote ?? '',
    layout,
    letterName: quote.introduction?.letterName ?? '',
    pages: quoteIntroSeasons(layout).map((season, index) => {
      const items = quote.items.slice(
        index * quoteIntroModelsPerPage,
        (index + 1) * quoteIntroModelsPerPage,
      );
      const slots = items.map(itemSlot);
      while (slots.length < quoteIntroModelsPerPage) slots.push(emptyIntroSlot());
      return { season, slots };
    }),
  };
}

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
  return {
    ...draft,
    layout: template.layout,
    letterName: template.letterName ?? draft.letterName,
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
