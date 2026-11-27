import {
  quoteIntroModelsPerPage,
  quoteIntroSeasons,
} from '../../forms/introduction/quote-intro-draft';

import type { QuoteCatalogProduct, QuoteCatalogVariant } from '../../entities/items/quote-catalog';
import type { Quote, QuoteItem } from '../../entities/quote/quote';
import type {
  QuoteIntroductionSetup,
  QuoteIntroSeason,
} from '../../entities/settings/quote-introduction';
import type {
  QuoteIntroDraft,
  QuoteIntroPageDraft,
  QuoteIntroSlotDraft,
} from '../../forms/introduction/quote-intro-draft';

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

export function newPage(
  season: QuoteIntroSeason,
  main: QuoteCatalogProduct | null,
): QuoteIntroPageDraft {
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
    customerPublicId: null,
    recipientEmail: '',
    recipientName: '',
    companyName: '',
    managerNote: '',
    layout: 'General',
    letterName: setup.letters[0]?.name ?? '',
    letterSubject: null,
    letterBody: null,
    pages: quoteIntroSeasons('General').map((season) => newPage(season, main[season])),
  };
}

/** A saved introduction: its items go page by page, 4 per page. */
export function introToDraft(quote: Quote): QuoteIntroDraft {
  const layout = quote.introduction?.layout ?? 'General';
  return {
    version: quote.version,
    internalName: quote.internalName,
    customerPublicId: quote.customerPublicId,
    recipientEmail: quote.introduction?.recipientEmail ?? '',
    recipientName: quote.recipientName ?? '',
    companyName: quote.companyName ?? '',
    managerNote: quote.managerNote ?? '',
    layout,
    letterName: quote.introduction?.letterName ?? '',
    letterSubject: quote.introduction?.letterSubject ?? null,
    letterBody: quote.introduction?.letterBody ?? null,
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
