import type { QuoteTier } from './quote';

export type QuoteTierPrices = Readonly<Record<QuoteTier, number | null>>;

/** A fabric variant of a sewing model in the «Додати товар» panel. */
export interface QuoteCatalogVariant {
  readonly articleId: number;
  readonly sku: string;
  /** Fabric name. */
  readonly title: string;
  /** For the manager only: fabric price and supplier. */
  readonly fabricInfo: string | null;
  readonly prices: QuoteTierPrices | null;
  /** Why it cannot be added; null when it can. */
  readonly problem: string | null;
}

export interface QuoteCatalogProduct {
  readonly productId: number;
  readonly kind: 'Sewing' | 'Ppe';
  readonly code: string | null;
  readonly name: string;
  readonly season: string | null;
  readonly photoUrl: string | null;
  readonly description: string | null;
  readonly prices: QuoteTierPrices | null;
  readonly problem: string | null;
  readonly variants: readonly QuoteCatalogVariant[];
}

export interface QuoteCatalogPage {
  readonly items: readonly QuoteCatalogProduct[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
}

export interface QuoteRepriceChange {
  readonly optionId: number;
  readonly itemName: string;
  readonly optionTitle: string;
  readonly before: QuoteTierPrices;
  readonly after: QuoteTierPrices;
}

export interface QuoteRepriceProblem {
  readonly optionId: number;
  readonly itemName: string;
  readonly optionTitle: string;
  readonly reason: string;
}

/** «Перерахувати за актуальними цінами»: what changes and what the Catalog cannot price any more. */
export interface QuoteRepriceReport {
  readonly applied: boolean;
  readonly version: number;
  readonly changes: readonly QuoteRepriceChange[];
  readonly unavailable: readonly QuoteRepriceProblem[];
}
