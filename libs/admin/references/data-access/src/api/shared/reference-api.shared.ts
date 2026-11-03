export const referenceErrorMessages = {
  unauthorized: 'Немає доступу до довідників.',
  notFound: 'Запис не знайдено. Оновіть список.',
  conflict: 'Запис конфліктує з поточними даними. Оновіть список.',
  fallback: 'Не вдалося виконати запит. Спробуйте ще раз.',
};

/**
 * Saving a price input (fabric, accessory, operation, pricing parameter or PPE rule) republishes product prices on
 * the backend (CAT-012), so every cached product query, the «Товари» prices included, is refreshed.
 */
export const productPricesTag = 'Product' as const;
