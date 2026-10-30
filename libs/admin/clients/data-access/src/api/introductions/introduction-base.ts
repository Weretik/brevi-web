import { adminApi, isAdminApiError, toAdminApiError } from '@admin/shared/api-client';

export const introductionBaseApi = adminApi.enhanceEndpoints({
  addTagTypes: ['IntroductionTemplates', 'IntroductionMapping', 'Quote'],
});
export const introductionError = (error: unknown) =>
  toAdminApiError(error, {
    conflict: 'Добірку або її дані змінено. Оновіть і перевірте вибір.',
    notFound: 'Добірку не знайдено або доступ обмежено.',
    badRequest: 'Перевірте позиції, метадані тканини та доступність ціни.',
    fallback: 'Не вдалося виконати дію з добіркою.',
  });
export const introductionRoot = '/api/crm/quote-templates/introductions';
export const introductionUrl = (id: string) => `${introductionRoot}/${encodeURIComponent(id)}`;

/** A missing active mapping is a normal configuration blocker, not resource access loss. */
export async function introductionMappingAccessLoss(
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
    if (isAdminApiError(error) && error.status === 403) api.dispatch(adminApi.util.resetApiState());
  }
}
