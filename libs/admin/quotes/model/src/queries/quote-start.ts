/** What «Нове КП» starts: a КП «під запит» or a «КП для знайомства». */
export type QuoteStartKind = 'Request' | 'Introduction';

/** Who the new КП is for, chosen in the «Нове КП» panel and passed to the editor. */
export interface QuoteStartPrefill {
  readonly internalName: string;
  readonly companyName: string;
  readonly recipientName: string;
  /** The chosen client (its public id); null for a typed name. */
  readonly customerPublicId: string | null;
}

/** A KeepinCRM client offered in the client field. */
export interface QuoteClientSuggestion {
  /** Public id of the client in «Контрагенти → Клієнти». */
  readonly publicId: string;
  readonly name: string;
  readonly companyName: string | null;
  readonly contactName: string | null;
}

export const quoteStartPaths: Readonly<Record<QuoteStartKind, string>> = {
  Request: '/crm/quotes/new',
  Introduction: '/crm/quote-introductions/new',
};

const text = (value: unknown) => (typeof value === 'string' ? value : '');

/** Reads the prefill from router state; anything else gives null. */
export function readQuoteStartPrefill(state: unknown): QuoteStartPrefill | null {
  const prefill = (state as { prefill?: Record<string, unknown> } | null)?.prefill;
  if (!prefill || typeof prefill !== 'object') return null;
  return {
    internalName: text(prefill['internalName']),
    companyName: text(prefill['companyName']),
    recipientName: text(prefill['recipientName']),
    customerPublicId: text(prefill['customerPublicId']) || null,
  };
}

/** The prefill of a chosen KeepinCRM client, or of a typed name. */
export function quoteStartPrefillOf(
  name: string,
  client: QuoteClientSuggestion | null,
): QuoteStartPrefill {
  return {
    internalName: name.trim(),
    companyName: client?.companyName ?? (client ? client.name : ''),
    recipientName: client?.contactName ?? '',
    customerPublicId: client?.publicId ?? null,
  };
}
