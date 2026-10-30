import { adminApi, isAdminApiError } from '@admin/shared/api-client';

import type { QuoteDetail } from '@admin/clients/model';

export async function quoteAccessLoss(
  _argument: unknown,
  api: {
    dispatch: (action: ReturnType<typeof adminApi.util.resetApiState>) => unknown;
    queryFulfilled: Promise<{ data: QuoteDetail }>;
  },
) {
  try {
    const { data } = await api.queryFulfilled;
    if (!data.canEdit) api.dispatch(adminApi.util.resetApiState());
  } catch (failure) {
    const error =
      failure && typeof failure === 'object' && 'error' in failure ? failure.error : null;
    if (isAdminApiError(error) && (error.status === 403 || error.status === 404))
      api.dispatch(adminApi.util.resetApiState());
  }
}
