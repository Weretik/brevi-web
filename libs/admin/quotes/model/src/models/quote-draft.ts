import type { QuoteItemKind, QuoteItemLine, QuoteTier } from '../entities/quote';

/** One editable price box; `manual` is the typed text, empty for the Catalog price. */
export interface QuotePriceDraft {
  readonly source: number | null;
  readonly manual: string;
  readonly shown: boolean;
}

export interface QuoteOptionDraft {
  /** Stable key for React lists. */
  readonly key: string;
  readonly id: number | null;
  readonly articleId: number | null;
  readonly title: string;
  readonly details: string | null;
  readonly fabricInfo: string | null;
  readonly isRecommended: boolean;
  readonly prices: Readonly<Record<QuoteTier, QuotePriceDraft>>;
  readonly manualReason: string;
  /** Who set the saved manual price and when, for the hint under the row. */
  readonly manualBy: string | null;
  /** The fabric and its metres of a «Виріб з нуля» row; null for other items. */
  readonly fabricId: number | null;
  readonly fabricMeters: number | null;
}

export interface QuoteItemDraft {
  readonly key: string;
  readonly id: number | null;
  readonly kind: QuoteItemKind;
  readonly productId: number | null;
  readonly code: string | null;
  readonly name: string;
  readonly subtitle: string | null;
  readonly description: string;
  readonly siteUrl: string | null;
  readonly photoUrl: string | null;
  readonly season: string | null;
  readonly supplierUrl: string;
  readonly options: readonly QuoteOptionDraft[];
  /** Accessories and operations of a «Виріб з нуля», changed only in its composition panel. */
  readonly lines: readonly QuoteItemLine[];
}

export interface QuoteDraft {
  readonly version: number;
  readonly internalName: string;
  readonly customerId: number | null;
  readonly recipientName: string;
  readonly companyName: string;
  readonly clientComment: string;
  readonly managerNote: string;
  readonly items: readonly QuoteItemDraft[];
}

export const quoteTiers: readonly QuoteTier[] = ['retail', 'wholesale', 'large'];

export const quoteTierLabels: Readonly<Record<QuoteTier, string>> = {
  retail: 'до 9 шт.',
  wholesale: '10–40 шт.',
  large: 'від 41 шт.',
};

export const quoteItemSubtitles: Readonly<Record<QuoteItemKind, string>> = {
  Sewing: 'Швейна продукція · готові варіанти тканини',
  Ppe: 'ЗІЗ · готовий товар',
  OneOffPpe: 'ЗІЗ · разова позиція',
  CustomSewing: 'Швейна продукція · виріб з нуля',
};

/** The subtitle of a Catalog model whose composition was changed in the КП. */
export const quoteChangedModelSubtitle = 'Швейна продукція · змінений склад моделі';

/** Items whose prices come from the Catalog formula and are never typed. */
export const isSewingKind = (kind: QuoteItemKind): boolean =>
  kind === 'Sewing' || kind === 'CustomSewing';
