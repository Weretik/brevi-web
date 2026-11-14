import type { QuoteIntroLayout, QuoteIntroSeason } from '../../entities/quote-introduction';

/** One model on a page: the main model (first) or one of the three chosen ones. */
export interface QuoteIntroSlotDraft {
  readonly key: string;
  /** The saved item, so its price stays; null for a new choice. */
  readonly itemId: number | null;
  readonly productId: number | null;
  /** The fabric variant; null until chosen. */
  readonly articleId: number | null;
  readonly name: string;
  readonly photoUrl: string | null;
  readonly fabricTitle: string | null;
  /** The saved від 41 шт. price and the fabric it belongs to. */
  readonly savedPrice: number | null;
  readonly savedArticleId: number | null;
  /** Why the slot was left empty, e.g. a template model is no longer in the Catalog. */
  readonly problem: string | null;
}

export interface QuoteIntroPageDraft {
  readonly season: QuoteIntroSeason;
  readonly slots: readonly QuoteIntroSlotDraft[];
}

export interface QuoteIntroDraft {
  readonly version: number;
  readonly internalName: string;
  readonly customerId: number | null;
  readonly recipientEmail: string;
  readonly recipientName: string;
  readonly companyName: string;
  readonly managerNote: string;
  readonly layout: QuoteIntroLayout;
  readonly letterName: string;
  /** The chosen letter's subject changed for this КП; null keeps the variant's (round 2, item 14). */
  readonly letterSubject: string | null;
  /** The chosen letter's text changed for this КП; null keeps the variant's. */
  readonly letterBody: string | null;
  readonly pages: readonly QuoteIntroPageDraft[];
}

export const quoteIntroModelsPerPage = 4;
export const quoteIntroEmailMax = 320;
export const quoteIntroTemplateNameMax = 100;

export const quoteIntroLayouts: readonly {
  value: QuoteIntroLayout;
  label: string;
  description: string;
}[] = [
  {
    value: 'General',
    label: 'Загальне для знайомства',
    description: '2 сторінки: літній і зимовий асортимент, 8 моделей.',
  },
  {
    value: 'Summer',
    label: 'Літній спецодяг',
    description: '1 сторінка: «Імпульс» і 3 літні моделі.',
  },
  {
    value: 'Winter',
    label: 'Зимовий спецодяг',
    description: '1 сторінка: «Прайм» і 3 зимові моделі.',
  },
];

export const quoteIntroSeasonLabels: Readonly<Record<QuoteIntroSeason, string>> = {
  Summer: 'Літній спецодяг',
  Winter: 'Зимовий спецодяг',
};

/** The Catalog season name of the models of a page. */
export const quoteIntroCatalogSeasons: Readonly<Record<QuoteIntroSeason, string>> = {
  Summer: 'Літо',
  Winter: 'Зима',
};

export function quoteIntroSeasons(layout: QuoteIntroLayout): QuoteIntroSeason[] {
  return layout === 'General' ? ['Summer', 'Winter'] : [layout];
}
