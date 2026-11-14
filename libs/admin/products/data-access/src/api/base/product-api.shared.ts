import type { ProductQuery } from '@admin/products/model';

export const productErrorMessages = {
  unauthorized: 'Немає доступу до товарів.',
  notFound: 'Товар не знайдено.',
  conflict: 'Конфлікт даних. Оновіть товар і повторіть дію.',
  fallback: 'Не вдалося виконати запит. Спробуйте ще раз.',
};

export function serializeProductQuery(query: ProductQuery): string {
  const params = new URLSearchParams();
  for (const [name, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') params.set(name, String(value));
  }
  return params.toString();
}
