import type { QuoteItemLineKind } from './quote';
import type { QuoteTierPrices } from './quote-catalog';

/** Reference data of a line of a «Виріб з нуля»; `name` is null when the row is gone. */
export interface QuoteCustomSewingLineInfo {
  readonly kind: QuoteItemLineKind;
  readonly referenceId: number;
  readonly name: string | null;
  readonly unit: string | null;
  /** Accessory, fabric or service price per unit, or operation norm in minutes. */
  readonly unitValue: number | null;
  readonly isActive: boolean;
  readonly costCode: string | null;
}

/** The price of one fabric of a «Виріб з нуля» by the Catalog formula, or why there is none. */
export interface QuoteCustomSewingFabricPrice {
  readonly fabricId: number;
  readonly meters: number;
  readonly name: string | null;
  readonly details: string | null;
  readonly pricePerMeter: number | null;
  readonly minutes: number | null;
  /** Minutes × cost of a minute, UAH. */
  readonly laborCost: number | null;
  readonly fullCost: number | null;
  readonly prices: QuoteTierPrices | null;
  readonly problems: readonly string[];
}

export interface QuoteCustomSewingPrice {
  readonly lines: readonly QuoteCustomSewingLineInfo[];
  readonly fabrics: readonly QuoteCustomSewingFabricPrice[];
}

export interface QuoteCustomSewingPriceRequest {
  readonly fabrics: readonly { readonly fabricId: number; readonly meters: number }[];
  readonly lines: readonly {
    readonly kind: QuoteItemLineKind;
    readonly referenceId: number;
    readonly quantity: number;
    readonly manualMinutes: number | null;
    readonly costCode: string | null;
  }[];
}

/** «Змінити склад»: the Catalog composition of a sewing model to start from. */
export interface QuoteModelComposition {
  readonly productId: number;
  /** The fabric of each variant with its metres. */
  readonly fabrics: readonly {
    readonly articleId: number;
    readonly fabricId: number;
    readonly name: string | null;
    readonly meters: number;
    readonly isActive: boolean;
  }[];
  /** Shared accessories, extra fabrics and services, then operations. */
  readonly lines: readonly {
    readonly kind: QuoteItemLineKind;
    readonly referenceId: number;
    readonly costCode: string | null;
    readonly name: string | null;
    readonly unit: string;
    readonly quantity: number;
    readonly manualMinutes: number | null;
  }[];
}
