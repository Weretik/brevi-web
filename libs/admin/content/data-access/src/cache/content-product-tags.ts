export const contentProductsTag = { type: 'ContentProduct' as const, id: 'LIST' };
export const contentProductTag = (productId: number) => ({
  type: 'ContentProduct' as const,
  id: productId,
});
