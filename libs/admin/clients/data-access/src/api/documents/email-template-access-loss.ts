import { adminApi, isAdminApiError } from '@admin/shared/api-client';

/** Let unwrap observe the denial before clearing private registry and quote caches. */
export async function emailTemplateAccessLoss(
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
    if (isAdminApiError(error) && [401, 403, 404].includes(error.status))
      setTimeout(() => api.dispatch(adminApi.util.resetApiState()), 0);
  }
}
