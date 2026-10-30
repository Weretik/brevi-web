import { adminApi, isAdminApiError } from '@admin/shared/api-client';

export async function customAccessLoss(
  _argument: unknown,
  api: {
    dispatch: (action: ReturnType<typeof adminApi.util.resetApiState>) => unknown;
    queryFulfilled: Promise<unknown>;
  },
) {
  try {
    await api.queryFulfilled;
  } catch (failure) {
    const error =
      failure && typeof failure === 'object' && 'error' in failure ? failure.error : null;
    if (isAdminApiError(error) && (error.status === 403 || error.status === 404))
      api.dispatch(adminApi.util.resetApiState());
  }
}
