import type { ProductQuery } from '@admin/products/model';

export const productErrorMessages = {
  unauthorized: 'Немає доступу до товарів.',
  notFound: 'Товар не знайдено.',
  conflict: 'Конфлікт даних. Оновіть товар і повторіть дію.',
  fallback: 'Не вдалося виконати запит. Спробуйте ще раз.',
};

/** The filled filters of the product list; an empty search is not sent. */
export function productQueryParams(query: ProductQuery): ProductQuery {
  return Object.fromEntries(
    Object.entries(query).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  );
}
