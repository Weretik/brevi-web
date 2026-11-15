import { toApiError } from '@admin/shared/api-client';

export const getLoginErrorMessage = (error: unknown): string => {
  const { code, status } = toApiError(error);
  if (status === 401) {
    return 'Невірний email або пароль. Після 5 невдалих спроб вхід блокується на 15 хвилин.';
  }

  if (status === 429) {
    return 'Забагато спроб входу. Спробуйте ще раз за хвилину.';
  }

  if (code === 'Network' || code === 'Timeout') {
    return 'Сервер недоступний. Перевірте зʼєднання та спробуйте ще раз.';
  }

  return 'Не вдалося увійти. Спробуйте ще раз.';
};
