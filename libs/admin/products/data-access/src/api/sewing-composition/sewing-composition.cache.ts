export function sewingCompositionTag(productId: number) {
  return { type: 'Product' as const, id: `SEWING-${productId}` };
}
