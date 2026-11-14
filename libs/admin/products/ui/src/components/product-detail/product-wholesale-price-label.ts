import type { Product } from '@admin/products/model';

export function productWholesalePriceLabel(product: Product): string {
  if (product.type === 'Sewing') {
    if (product.sewingPriceStatus === 'loading') return 'Завантаження ціни…';
    if (product.sewingPriceStatus === 'error') return 'Ціна недоступна';
    if (product.sewingPriceStatus !== 'published') return 'Не опубліковано';
  } else {
    if (product.ppePriceStatus === 'loading') return 'Завантаження ціни…';
    if (product.ppePriceStatus === 'error') return 'Ціна недоступна';
    if (product.ppePriceStatus !== 'calculated') return 'Потрібна перевірка даних';
  }
  return product.minimumWholesalePrice.toLocaleString('uk-UA', { maximumFractionDigits: 2 });
}
