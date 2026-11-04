import type { QuoteIntroduction } from './quote-introduction';

export type QuoteKind = 'Request' | 'Introduction';
export type QuoteStatus = 'Draft' | 'Sent';
export type QuoteItemKind = 'Sewing' | 'Ppe' | 'OneOffPpe' | 'CustomSewing';
/** `Service` is a «послуга» of a Catalog model (by its code); `Fabric` an extra shared fabric such as a lining. */
export type QuoteItemLineKind = 'Accessory' | 'Operation' | 'Service' | 'Fabric';

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
  /** Metres of the first fabric; null for a Catalog variant and a PPE. */
  readonly fabricMeters: number | null;
  /** The fabrics of a «Виріб з нуля» variant or of a model row in another fabric; empty otherwise. */
  readonly fabrics: readonly QuoteOptionFabric[];
}

/** One fabric of a variant with its metres in one product. */
export interface QuoteOptionFabric {
  readonly fabricId: number;
  readonly name: string;
  readonly meters: number;
}

/** An accessory or operation of a «Виріб з нуля»; name and unit are copied when it was priced. */
export interface QuoteItemLine {
  readonly kind: QuoteItemLineKind;
  readonly referenceId: number;
  readonly name: string;
  readonly unit: string;
  readonly quantity: number;
  /** Minutes of an operation without a fixed norm. */
  readonly manualMinutes: number | null;
  /** The other-cost code of a service; its `referenceId` is 0. */
  readonly costCode: string | null;
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
  /** Accessories and operations of a «Виріб з нуля»; empty for other items. */
  readonly lines: readonly QuoteItemLine[];
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
  /** Set while the КП is in «Архів»: it opens read-only until restored. */
  readonly archivedAt: string | null;
  readonly archivedByName: string | null;
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
  readonly archivedAt: string | null;
}

export interface QuotePage {
  readonly items: readonly QuoteSummary[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
}

export interface QuoteListQuery {
  /** True lists only «Архів», false only КП in work. */
  readonly archived: boolean;
  readonly search: string;
  readonly responsibleUserId: number | null;
  readonly page: number;
  readonly pageSize: number;
}

export type QuoteEventKind =
  | 'Created'
  | 'Saved'
  | 'Sent'
  | 'Repriced'
  | 'ResponsibleChanged'
  | 'Archived'
  | 'Restored'
  | 'Copied'
  | 'Imported';

/** A line of «Історія змін». */
export interface QuoteEvent {
  readonly id: number;
  readonly kind: QuoteEventKind;
  readonly at: string;
  readonly actor: QuotePerson;
  readonly details: string | null;
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
