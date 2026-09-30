import { apiUrl } from '@admin/util/api-url';

export class ProductApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly fieldErrors: Record<string, string> = {},
    message?: string,
  ) {
    super(
      message ??
        (status === 401 || status === 403
          ? 'Немає доступу до товарів.'
          : status === 404
            ? 'Товар не знайдено.'
            : status === 409
              ? 'Конфлікт даних. Оновіть товар і повторіть дію.'
              : status === 400
                ? 'Перевірте введені дані.'
                : 'Не вдалося виконати запит. Спробуйте ще раз.'),
    );
  }
}

async function errorFrom(response: Response): Promise<ProductApiError> {
  const fieldErrors: Record<string, string> = {};
  if (response.status === 400 || response.status === 409) {
    const payload: unknown = await response.json().catch(() => null);
    if (response.status === 409) {
      const items = Array.isArray(payload) ? payload : [payload];
      const messages = items
        .map((item): string | null => {
          if (typeof item === 'string') return item;
          if (!item || typeof item !== 'object') return null;
          if ('errorMessage' in item && typeof item.errorMessage === 'string')
            return item.errorMessage;
          if ('message' in item && typeof item.message === 'string') return item.message;
          return null;
        })
        .filter((item): item is string => Boolean(item));
      return new ProductApiError(409, {}, messages.join(' ').slice(0, 300) || undefined);
    }
    if (Array.isArray(payload)) {
      for (const item of payload) {
        if (item && typeof item === 'object') {
          const entry = item as Record<string, unknown>;
          if (
            typeof entry['identifier'] === 'string' &&
            typeof entry['errorMessage'] === 'string'
          ) {
            const name = entry['identifier'].replace(/^Request\./, '');
            fieldErrors[name.charAt(0).toLowerCase() + name.slice(1)] = entry['errorMessage'];
          }
        }
      }
    }
  }
  return new ProductApiError(response.status, fieldErrors);
}

export async function send(
  path: string,
  init: RequestInit,
  fetcher: typeof fetch,
): Promise<Response> {
  let response: Response;
  try {
    response = await fetcher(apiUrl(path), { credentials: 'same-origin', ...init });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ProductApiError(0);
  }
  if (!response.ok) throw await errorFrom(response);
  return response;
}

export async function readJson(response: Response): Promise<unknown> {
  return response.json().catch(() => {
    throw new Error('Некоректна відповідь сервера.');
  });
}
