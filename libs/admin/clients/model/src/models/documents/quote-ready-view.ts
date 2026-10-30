import type { QuoteDetail } from '../../entities/quotes/quote-detail';

export type IssuerAvailability = 'loading' | 'active' | 'missing' | 'error';

export type QuoteReadyBlocker =
  | 'archived'
  | 'already-issued'
  | 'unsaved-changes'
  | 'settings-loading'
  | 'settings-missing'
  | 'settings-error'
  | null;

export function quoteReadyBlocker(
  quote: QuoteDetail,
  issuer: IssuerAvailability,
  hasUnsavedChanges: boolean,
): QuoteReadyBlocker {
  if (quote.archived) return 'archived';
  if (quote.state !== 'draft') return 'already-issued';
  if (hasUnsavedChanges) return 'unsaved-changes';
  if (issuer === 'loading') return 'settings-loading';
  if (issuer === 'missing') return 'settings-missing';
  if (issuer === 'error') return 'settings-error';
  return null;
}
