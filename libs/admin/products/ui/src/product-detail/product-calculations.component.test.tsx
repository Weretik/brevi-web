import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PpeProductDetail } from './ppe-product-detail';
import { SewingProductDetail } from './sewing-product-detail';

import type { ProductDetail } from '@admin/products/model';

describe('server calculated product detail', () => {
  it('keeps fractional sewing output and shows all price bands', () => {
    const sewing: NonNullable<ProductDetail['sewing']> = {
      metersPerProduct: 2,
      piecesPerShift: 25.6,
      fabrics: [{ fabricId: 1, name: 'Бавовна', price: 10, isPrimary: true, sortOrder: 0 }],
      accessories: [{ garmentAccessoryId: 2, name: 'Ґудзик', price: 1, quantity: 4, sortOrder: 0 }],
      operations: [{ id: 3, name: 'Шиття', minutes: 5 }],
      prices: {
        byFabric: [{ fabricId: 1, price1To10: 100, price11To39: 90, price40Plus: 80 }],
        ranges: {
          price1To10: { minPrice: 100, minFabricId: 1, maxPrice: 100, maxFabricId: 1 },
          price11To39: { minPrice: 90, minFabricId: 1, maxPrice: 90, maxFabricId: 1 },
          price40Plus: { minPrice: 80, minFabricId: 1, maxPrice: 80, maxFabricId: 1 },
        },
      },
    };
    render(<SewingProductDetail sewing={sewing} />);
    expect(screen.getByText('Продуктивність: 25.6')).toBeTruthy();
    expect(screen.getByText('1–10: 100')).toBeTruthy();
    expect(screen.getByText('11–39: 90')).toBeTruthy();
    expect(screen.getByText('40+: 80')).toBeTruthy();
    expect(screen.getByText(/мін\. 100/)).toBeTruthy();
  });

  it('shows mixed PPE percent sources and server prices', () => {
    const ppe: NonNullable<ProductDetail['ppe']> = {
      supplier: { id: 1, name: 'Постачальник' },
      basePrice: 100,
      retailPercent: {
        source: 'Reference',
        reference: { id: 2, name: 'Націнка', key: 'markup', value: 8, unit: '%' },
      },
      wholesalePercent: { source: 'Custom', customPercent: 5 },
      retailPrice: 108,
      wholesalePrice: 105,
    };
    render(<PpeProductDetail ppe={ppe} />);
    expect(screen.getByText('Роздрібний відсоток: довідник «Націнка» 8%')).toBeTruthy();
    expect(screen.getByText('Оптовий відсоток: власний 5%')).toBeTruthy();
    expect(screen.getByText('Роздрібна ціна: 108')).toBeTruthy();
    expect(screen.getByText('Оптова ціна: 105')).toBeTruthy();
  });
});
