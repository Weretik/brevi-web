export class GarmentAccessoryApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly fieldErrors: Record<string, string>,
  ) {
    super(
      status === 401 || status === 403
        ? 'Немає доступу до фурнітури.'
        : status === 404
          ? 'Фурнітуру не знайдено. Оновіть список.'
          : status === 409
            ? 'Запис конфліктує з поточними даними. Оновіть список.'
            : status === 400
              ? 'Перевірте введені дані.'
              : 'Не вдалося виконати запит. Спробуйте ще раз.',
    );
  }
}

export async function readGarmentAccessoryError(
  response: Response,
): Promise<GarmentAccessoryApiError> {
  const fieldErrors: Record<string, string> = {};
  if (response.status === 400) {
    const payload: unknown = await response.json().catch(() => null);
    if (Array.isArray(payload)) {
      for (const item of payload) {
        if (item && typeof item === 'object') {
          const error = item as Record<string, unknown>;
          if (
            typeof error['identifier'] === 'string' &&
            typeof error['errorMessage'] === 'string'
          ) {
            const field = error['identifier'].replace(/^Request\./, '');
            fieldErrors[field.charAt(0).toLowerCase() + field.slice(1)] = error['errorMessage'];
          }
        }
      }
    }
  }
  return new GarmentAccessoryApiError(response.status, fieldErrors);
}
