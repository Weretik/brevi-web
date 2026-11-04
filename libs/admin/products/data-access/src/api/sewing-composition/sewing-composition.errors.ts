import { toAdminApiError } from '@admin/shared/api-client';

const messages = {
  unauthorized: 'Немає доступу до складу виробу.',
  notFound: 'Товар, тканину або довідник не знайдено.',
  conflict: 'Дані змінилися або конфліктують. Оновіть сторінку й спробуйте ще раз.',
  fallback: 'Не вдалося зберегти склад виробу.',
};

export function sewingCompositionError(response: Parameters<typeof toAdminApiError>[0]) {
  return toAdminApiError(response, messages);
}
