import { priceInputText } from './quote-price-text';
import { quoteItemSubtitles } from '../models/quote-draft';

import type { Quote, QuoteItem, QuoteOption, QuoteTier } from '../entities/quote';
import type { QuoteCatalogProduct, QuoteCatalogVariant } from '../entities/quote-catalog';
import type {
  QuoteDraft,
  QuoteItemDraft,
  QuoteOptionDraft,
  QuotePriceDraft,
} from '../models/quote-draft';

let sequence = 0;
const nextKey = (prefix: string) => `${prefix}-${++sequence}`;

const tiers = <T>(make: (tier: QuoteTier) => T): Readonly<Record<QuoteTier, T>> => ({
  retail: make('retail'),
  wholesale: make('wholesale'),
  large: make('large'),
});

export function emptyQuoteDraft(): QuoteDraft {
  return {
    version: 0,
    internalName: '',
    customerId: null,
    recipientName: '',
    companyName: '',
    clientComment: '',
    managerNote: '',
    items: [],
  };
}

function optionDraft(option: QuoteOption): QuoteOptionDraft {
  return {
    key: nextKey('option'),
    id: option.id,
    articleId: option.articleId,
    fabricId: option.fabricId,
    title: option.title,
    details: option.details,
    fabricInfo: null,
    isRecommended: option.isRecommended,
    prices: tiers((tier) => {
      const price = option.prices[tier];
      return {
        source: price.source,
        manual: price.isManual ? priceInputText(price.amount) : '',
        shown: price.shown,
      };
    }),
    manualReason: option.manualReason ?? '',
    manualBy: option.manualByName,
    fabrics: option.fabrics,
  };
}

function itemDraft(item: QuoteItem): QuoteItemDraft {
  return {
    key: nextKey('item'),
    id: item.id,
    kind: item.kind,
    productId: item.productId,
    code: item.code,
    name: item.name,
    subtitle: item.subtitle,
    description: item.description ?? '',
    siteUrl: item.siteUrl,
    photoUrl: item.photoUrl,
    season: item.season,
    supplierUrl: item.supplierUrl ?? '',
    options: item.options.map(optionDraft),
    lines: item.lines,
  };
}

/** The editor state of a saved КП. */
export function quoteToDraft(quote: Quote): QuoteDraft {
  return {
    version: quote.version,
    internalName: quote.internalName,
    customerId: quote.customerId,
    recipientName: quote.recipientName ?? '',
    companyName: quote.companyName ?? '',
    clientComment: quote.clientComment ?? '',
    managerNote: quote.managerNote ?? '',
    items: quote.items.map(itemDraft),
  };
}

const catalogPrice = (source: number | null): QuotePriceDraft => ({
  source,
  manual: '',
  shown: true,
});

/** A new fabric row of a sewing model; its prices come from the Catalog on save. */
export function variantOptionDraft(
  variant: QuoteCatalogVariant,
  isRecommended = false,
): QuoteOptionDraft {
  return {
    key: nextKey('option'),
    id: null,
    articleId: variant.articleId,
    fabricId: variant.fabricId,
    title: variant.title,
    details: null,
    fabricInfo: variant.fabricInfo,
    isRecommended,
    prices: tiers((tier) => catalogPrice(variant.prices?.[tier] ?? null)),
    manualReason: '',
    manualBy: null,
    fabrics: [],
  };
}

/** A new item from the «Додати товар» panel: a model with the chosen fabrics, or a PPE. */
export function catalogItemDraft(
  product: QuoteCatalogProduct,
  variants: readonly QuoteCatalogVariant[] = [],
): QuoteItemDraft {
  const options =
    product.kind === 'Sewing'
      ? variants.map((variant, index) =>
          variantOptionDraft(variant, index === 0 && variants.length > 1),
        )
      : [
          {
            key: nextKey('option'),
            id: null,
            articleId: null,
            fabricId: null,
            title: 'Ціна',
            details: null,
            fabricInfo: null,
            isRecommended: false,
            prices: tiers((tier) => catalogPrice(product.prices?.[tier] ?? null)),
            manualReason: '',
            manualBy: null,
            fabrics: [],
          },
        ];
  return {
    key: nextKey('item'),
    id: null,
    kind: product.kind,
    productId: product.productId,
    code: product.code,
    name: product.name,
    subtitle: quoteItemSubtitles[product.kind],
    description: product.description ?? '',
    siteUrl: null,
    photoUrl: product.photoUrl,
    season: product.season,
    supplierUrl: '',
    options,
    lines: [],
  };
}

/** «Додати разовий ЗІЗ»: a position that is not in the Catalog, with manual prices. */
export function oneOffItemDraft(): QuoteItemDraft {
  return {
    key: nextKey('item'),
    id: null,
    kind: 'OneOffPpe',
    productId: null,
    code: null,
    name: '',
    subtitle: quoteItemSubtitles.OneOffPpe,
    description: '',
    siteUrl: null,
    photoUrl: null,
    season: null,
    supplierUrl: '',
    options: [
      {
        key: nextKey('option'),
        id: null,
        articleId: null,
        fabricId: null,
        title: 'Ціна',
        details: null,
        fabricInfo: null,
        isRecommended: false,
        prices: tiers(() => ({ source: null, manual: '', shown: true })),
        manualReason: '',
        manualBy: null,
        fabrics: [],
      },
    ],
    lines: [],
  };
}
