import type { QuoteItemLineKind } from '../entities/quote';

/** A fabric in the «Виріб з нуля» panel; `meters` is the typed text. */
export interface QuoteCustomFabricDraft {
  readonly key: string;
  readonly fabricId: number;
  readonly name: string;
  readonly meters: string;
}

/** An accessory, operation, service or extra fabric in the panel; `quantity` and `minutes` are typed text. */
export interface QuoteCustomLineDraft {
  readonly key: string;
  readonly kind: QuoteItemLineKind;
  readonly referenceId: number;
  readonly name: string;
  readonly unit: string;
  readonly quantity: string;
  /** Minutes of an operation without a fixed norm; empty otherwise. */
  readonly minutes: string;
  /** The operation has no fixed norm, so minutes are required. */
  readonly needsMinutes: boolean;
  /** The other-cost code of a service; null otherwise. */
  readonly costCode: string | null;
}

/** The «Виріб з нуля» panel: what the manager composes before it goes into the КП. */
export interface QuoteCustomSewingDraft {
  readonly name: string;
  readonly description: string;
  readonly fabrics: readonly QuoteCustomFabricDraft[];
  readonly lines: readonly QuoteCustomLineDraft[];
}

export const quoteCustomLineKindLabels: Readonly<Record<QuoteItemLineKind, string>> = {
  Accessory: 'Фурнітура',
  Operation: 'Операції',
  Fabric: 'Додаткові тканини',
  Service: 'Послуги',
};
