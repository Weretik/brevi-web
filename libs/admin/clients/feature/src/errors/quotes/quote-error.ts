import { isAdminApiError } from '@admin/shared/api-client';

export function quoteError(error: unknown): string {
  if (isAdminApiError(error)) {
    if (error.code === 'Forbidden') return 'У вас немає доступу до цієї дії.';
    if (error.code === 'Unauthorized') return 'Увійдіть у систему повторно.';
    if (error.code === 'NotFound') return 'КП або клієнта не знайдено чи доступ обмежено.';
    if (error.code === 'Conflict')
      return 'КП або джерело ціни змінилися чи розрахунок прострочений. Введення збережене. Оновіть дані або явно оновіть розрахунок.';
    if (error.code === 'Validation' || error.status === 400)
      return 'Перевірте одержувача, позиції та причини ручних цін.';
  }
  return 'Не вдалося виконати дію з КП. Повторіть запит; введення збережене.';
}
