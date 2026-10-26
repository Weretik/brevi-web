import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { usePublishedProductPrices } from './use-published-product-prices';

import type { Product } from '@admin/products/model';

const query = vi.hoisted(() => vi.fn());
vi.mock('@admin/products/data-access', () => ({ useGetPublishedSewingProductsQuery: query }));
afterEach(cleanup);
const sewing: Product = {
  id: 42,
  type: 'Sewing',
  name: 'Куртка',
  slug: 'jacket',
  categoryIds: [],
  minimumWholesalePrice: 999,
  createdAtUtc: '',
  updatedAtUtc: null,
};

describe('Product published-price projection', () => {
  it('requests only Sewing IDs together and preserves PPE rows', () => {
    const ppe = { ...sewing, id: 7, type: 'Ppe' as const };
    query.mockReturnValue({ currentData: [], isFetching: false, isError: false, refetch: vi.fn() });
    const { result } = renderHook(() =>
      usePublishedProductPrices([sewing, ppe, { ...sewing, id: 1 }]),
    );
    expect(query).toHaveBeenCalledWith([1, 42], { skip: false });
    expect(result.current.products[0]?.sewingPriceStatus).toBe('unpublished');
    expect(result.current.products[1]).toBe(ppe);
  });
  it('shows a recoverable projection failure without falling back to the legacy amount', () => {
    const refetch = vi.fn();
    query.mockReturnValue({
      currentData: undefined,
      isFetching: false,
      isError: true,
      error: new Error('technical detail'),
      refetch,
    });
    const { result } = renderHook(() => usePublishedProductPrices([sewing]));
    expect(result.current.products[0]?.minimumWholesalePrice).toBe(0);
    expect(result.current.pricingError).toBe('Не вдалося завантажити опубліковані ціни.');
    result.current.reloadPrices();
    expect(refetch).toHaveBeenCalledOnce();
  });
});
