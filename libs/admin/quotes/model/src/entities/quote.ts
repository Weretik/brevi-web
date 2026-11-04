import type { QuoteIntroduction } from './quote-introduction';

export type QuoteKind = 'Request' | 'Introduction';
export type QuoteStatus = 'Draft' | 'Sent';
export type QuoteItemKind = 'Sewing' | 'Ppe' | 'OneOffPpe';

/** The three quantity tiers of every price row: до 9, 10–40 and від 41 шт. */
export type QuoteTier = 'retail' | 'wholesale' | 'large';

export interface QuotePerson {
  readonly userId: number;
  readonly name: string;
}

export interface QuotePrice {
  /** What the client sees: the manual price, else the Catalog one. */
  readonly amount: number | null;
  /** The Catalog price taken into the КП. */
  readonly source: number | null;
  readonly isManual: boolean;
  readonly shown: boolean;
}

export interface QuoteOption {
  readonly id: number;
  readonly articleId: number | null;
  readonly fabricId: number | null;
  readonly title: string;
  readonly details: string | null;
  readonly isRecommended: boolean;
  readonly prices: Readonly<Record<QuoteTier, QuotePrice>>;
  readonly manualReason: string | null;
  readonly manualByName: string | null;
  readonly manualAt: string | null;
  readonly pricesTakenAt: string | null;
}

export interface QuoteItem {
  readonly id: number;
  readonly kind: QuoteItemKind;
  readonly productId: number | null;
  readonly code: string | null;
  readonly name: string;
  readonly subtitle: string | null;
  readonly description: string | null;
  readonly siteUrl: string | null;
  readonly photoUrl: string | null;
  readonly season: string | null;
  readonly supplierUrl: string | null;
  readonly options: readonly QuoteOption[];
}

export interface Quote {
  readonly id: number;
  readonly number: string;
  readonly kind: QuoteKind;
  readonly status: QuoteStatus;
  readonly internalName: string;
  readonly customerId: number | null;
  readonly recipientName: string | null;
  readonly companyName: string | null;
  readonly clientComment: string | null;
  readonly managerNote: string | null;
  readonly author: QuotePerson;
  readonly responsible: QuotePerson;
  readonly createdAt: string;
  readonly updatedAt: string;
  /** Last time Gmail accepted the КП; null for a draft. */
  readonly lastSentAt: string | null;
  readonly version: number;
  readonly items: readonly QuoteItem[];
  /** Only a «КП для знайомства» has it; its items go page by page, 4 per page. */
  readonly introduction: QuoteIntroduction | null;
}

export interface QuoteSummary {
  readonly id: number;
  readonly number: string;
  readonly kind: QuoteKind;
  readonly status: QuoteStatus;
  readonly internalName: string;
  readonly companyName: string | null;
  readonly responsible: QuotePerson;
  readonly itemsCount: number;
  readonly updatedAt: string;
  readonly lastSentAt: string | null;
}

export interface QuotePage {
  readonly items: readonly QuoteSummary[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
}

export interface QuoteListQuery {
  readonly search: string;
  readonly responsibleUserId: number | null;
  readonly page: number;
  readonly pageSize: number;
}

/** The signed-in staff member: a Manager works with own КП; Director and Admin see all. */
export interface QuoteActor {
  readonly userId: number | null;
  readonly canSeeAll: boolean;
}

export interface QuoteStaff {
  readonly userId: number;
  readonly name: string;
  readonly email: string | null;
}
