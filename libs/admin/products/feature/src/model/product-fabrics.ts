import { normalizeOrder } from './product-order';

import type { ProductDraft } from '@admin/products/data-access';

type Fabrics = Extract<ProductDraft, { type: 'Sewing' }>['fabrics'];

export function groupPrimaryFabrics(items: Fabrics): Fabrics {
  return normalizeOrder([
    ...items.filter((item) => item.isPrimary),
    ...items.filter((item) => !item.isPrimary),
  ]);
}

export function setPrimaryFabric(items: Fabrics, index: number, checked: boolean): Fabrics {
  if (checked && items.filter((item) => item.isPrimary).length >= 2) return items;
  return groupPrimaryFabrics(
    items.map((item, position) => ({
      ...item,
      isPrimary: position === index ? items.length === 1 || checked : item.isPrimary,
    })),
  );
}

export function removeFabric(items: Fabrics, index: number): Fabrics {
  const remaining = items.filter((_, position) => position !== index);
  return groupPrimaryFabrics(
    remaining.map((item) => ({
      ...item,
      isPrimary: remaining.length === 1 || item.isPrimary,
    })),
  );
}
