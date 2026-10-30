import { toAdminApiError } from '@admin/shared/api-client';

export const customApiError = (value: unknown) =>
  toAdminApiError(value, {
    conflict:
      'Конфігурацію чи джерело цін змінено або розрахунок прострочений. Введення збережене.',
    notFound: 'Конфігурацію не знайдено або доступ обмежено.',
    fallback: 'Дію не завершено. Повторіть запит; введення збережене.',
  });
