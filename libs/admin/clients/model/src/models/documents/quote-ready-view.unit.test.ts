import { describe, expect, it } from 'vitest';

import { quoteReadyBlocker } from './quote-ready-view';

import type { QuoteDetail } from '../../entities/quotes/quote-detail';


const quote = {
  state: 'draft',
  archived: false,
} as QuoteDetail;

describe('quote ready presentation gate', () => {
  it('allows asking the server to prepare only a saved current draft with active settings', () => {
    expect(quoteReadyBlocker(quote, 'active', false)).toBeNull();
    expect(quoteReadyBlocker(quote, 'active', true)).toBe('unsaved-changes');
    expect(quoteReadyBlocker({ ...quote, archived: true }, 'active', false)).toBe('archived');
    expect(quoteReadyBlocker({ ...quote, state: 'ready' }, 'active', false)).toBe('already-issued');
  });

  it('does not treat unknown or inactive issuer settings as ready', () => {
    expect(quoteReadyBlocker(quote, 'loading', false)).toBe('settings-loading');
    expect(quoteReadyBlocker(quote, 'missing', false)).toBe('settings-missing');
    expect(quoteReadyBlocker(quote, 'error', false)).toBe('settings-error');
  });
});
