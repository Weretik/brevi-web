import { isAxiosError } from 'axios';

export const getLoginErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) {
      return 'Невірний email або пароль. Після 5 невдалих спроб вхід блокується на 15 хвилин.';
    }

    if (error.response?.status === 429) {
      return 'Забагато спроб входу. Спробуйте ще раз за хвилину.';
    }

    if (!error.response) {
      return 'Сервер недоступний. Перевірте зʼєднання та спробуйте ще раз.';
    }
  }

  return 'Не вдалося увійти. Спробуйте ще раз.';
};
