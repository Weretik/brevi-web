import { describe, expect, it } from 'vitest';

import { createRequestIdKeeper } from './request-id';

describe('requestId per attempt', () => {
  it('keeps the id while the same values are retried', () => {
    const keeper = createRequestIdKeeper();
    const first = keeper.forPayload({ amount: 100, note: 'a' });
    expect(keeper.forPayload({ amount: 100, note: 'a' })).toBe(first);
  });

  it('makes a new id when the values change after a failed attempt', () => {
    const keeper = createRequestIdKeeper();
    const first = keeper.forPayload({ amount: 100 });
    const edited = keeper.forPayload({ amount: 120 });
    expect(edited).not.toBe(first);
    expect(keeper.forPayload({ amount: 120 })).toBe(edited);
  });

  it('makes a new id for the same values after renew', () => {
    const keeper = createRequestIdKeeper();
    const first = keeper.forPayload({ amount: 100 });
    keeper.renew();
    expect(keeper.forPayload({ amount: 100 })).not.toBe(first);
  });
});
