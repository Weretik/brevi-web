import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SewingProductDetail } from './sewing-product-detail';

import type { ProductDetail } from '@admin/products/model';

describe('manufacturing metadata after price cutover', () => {
  it('keeps manufacturing metadata without displaying old sale-price bands', () => {
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
    expect(screen.queryByText('1–10: 100')).toBeNull();
    expect(screen.queryByText('Ціни за тканиною')).toBeNull();
    expect(screen.getByText(/Бавовна/)).toBeTruthy();
  });
});
