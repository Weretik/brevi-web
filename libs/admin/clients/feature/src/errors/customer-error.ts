import { isAdminApiError } from '@admin/shared/api-client';

export function customerError(error: unknown): string {
  if (isAdminApiError(error)) {
    if (error.code === 'Conflict')
      return 'Дані змінилися або запит конфліктує. Оновіть запис і порівняйте зміни перед повтором.';
    if (error.code === 'Forbidden') return 'У вас немає доступу до цієї дії.';
    if (error.code === 'NotFound') return 'Клієнта не знайдено або доступ обмежено.';
    if (error.code === 'Unauthorized') return 'Увійдіть у систему повторно.';
    if (error.code === 'Validation') return 'Перевірте введені дані та канали зв’язку.';
  }
  return 'Не вдалося виконати дію. Спробуйте ще раз.';
}
