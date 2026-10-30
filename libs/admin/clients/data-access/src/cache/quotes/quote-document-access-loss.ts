import { adminApi, isAdminApiError } from '@admin/shared/api-client';

/** Preserve the rejected query outcome before clearing its private cached state. */
export async function quoteDocumentAccessLoss(
  _argument: unknown,
  api: {
    dispatch: (action: ReturnType<typeof adminApi.util.resetApiState>) => unknown;
    queryFulfilled: Promise<{ data: unknown }>;
  },
) {
  try {
    await api.queryFulfilled;
  } catch (failure) {
    const error =
      failure && typeof failure === 'object' && 'error' in failure ? failure.error : null;
    if (isAdminApiError(error) && (error.status === 403 || error.status === 404))
      // RTK query unwrap reads settled state; a synchronous reset would turn403/404 into undefined.
      setTimeout(() => api.dispatch(adminApi.util.resetApiState()), 0);
  }
}
