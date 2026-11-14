/**
 * Saving a price input (fabric, accessory, operation, pricing parameter or PPE rule) republishes product prices on
 * the backend (CAT-012), so every cached product query, the «Товари» prices included, is refreshed.
 */
export const productPricesTag = 'Product' as const;
