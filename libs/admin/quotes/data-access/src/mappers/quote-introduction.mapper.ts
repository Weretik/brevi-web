import { mapQuoteCatalogProduct } from './quote.mapper';

import type {
  QuoteIntroDraft,
  QuoteIntroductionSetup,
  QuoteIntroLayout,
  QuoteIntroMainModel,
  QuoteIntroSeason,
  QuoteIntroTemplate,
} from '@admin/quotes/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const mainModel = (value: Schemas['QuoteIntroMainModelResponse']): QuoteIntroMainModel => ({
  code: value.code,
  product: value.product ? mapQuoteCatalogProduct(value.product) : null,
  problem: value.problem ?? null,
});

export const mapQuoteIntroductionSetup = (
  value: Schemas['QuoteIntroductionSetupResponse'],
): QuoteIntroductionSetup => ({
  summer: mainModel(value.summer),
  winter: mainModel(value.winter),
  letters: value.letters,
});

export const mapQuoteIntroTemplates = (
  value: Schemas['QuoteIntroTemplateResponse'][],
): QuoteIntroTemplate[] => value.map(mapQuoteIntroTemplate);

export const mapQuoteIntroTemplate = (
  value: Schemas['QuoteIntroTemplateResponse'],
): QuoteIntroTemplate => ({
  id: value.id,
  name: value.name,
  layout: value.layout as QuoteIntroLayout,
  letterName: value.letterName ?? null,
  pages: value.pages.map((page) => ({ ...page, season: page.season as QuoteIntroSeason })),
  author: value.author,
  createdAt: value.createdAt,
  canDelete: value.canDelete,
});

const text = (value: string): string | null => value.trim() || null;

const pages = (draft: QuoteIntroDraft): Schemas['QuoteIntroPageInput'][] =>
  draft.pages.map((page) => ({
    season: page.season,
    models: page.slots.map((slot) => ({
      itemId: slot.itemId,
      productId: slot.productId ?? 0,
      articleId: slot.articleId ?? 0,
    })),
  }));

/** Prices are never sent: the server takes them from the Catalog or keeps the saved ones. */
export function toSaveQuoteIntroductionInput(
  draft: QuoteIntroDraft,
): Schemas['SaveQuoteIntroductionInput'] {
  return {
    version: draft.version,
    internalName: draft.internalName.trim(),
    customerId: draft.customerId,
    recipientEmail: text(draft.recipientEmail),
    recipientName: text(draft.recipientName),
    companyName: text(draft.companyName),
    managerNote: text(draft.managerNote),
    layout: draft.layout,
    letterName: text(draft.letterName),
    letterSubject: draft.letterSubject === null ? null : text(draft.letterSubject),
    letterBody: draft.letterBody === null ? null : text(draft.letterBody),
    pages: pages(draft),
  };
}

export function toCreateQuoteIntroTemplateInput(
  name: string,
  draft: QuoteIntroDraft,
): Schemas['CreateQuoteIntroTemplateInput'] {
  return {
    name: name.trim(),
    layout: draft.layout,
    letterName: text(draft.letterName),
    pages: pages(draft),
  };
}
