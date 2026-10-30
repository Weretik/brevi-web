import { adminApi } from '@admin/shared/api-client';
import { describe, expect, it, vi } from 'vitest';

import { quoteDocumentAccessLoss } from './quote-document-access-loss';

describe('private quote document access loss', () => {
  it.each([403, 404])('purges cached private data after HTTP %i', async (status) => {
    const dispatch = vi.fn();
    await quoteDocumentAccessLoss(null, {
      dispatch,
      queryFulfilled: Promise.reject({
        error: { code: 'Forbidden', status, message: 'Access lost', fieldErrors: {} },
      }),
    });
    expect(dispatch).not.toHaveBeenCalled();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(dispatch).toHaveBeenCalledWith(adminApi.util.resetApiState());
  });

  it('retains cached data for a transient error', async () => {
    const dispatch = vi.fn();
    await quoteDocumentAccessLoss(null, {
      dispatch,
      queryFulfilled: Promise.reject({
        error: { code: 'Server', status: 500, message: 'Retry later', fieldErrors: {} },
      }),
    });
    expect(dispatch).not.toHaveBeenCalled();
  });
});
