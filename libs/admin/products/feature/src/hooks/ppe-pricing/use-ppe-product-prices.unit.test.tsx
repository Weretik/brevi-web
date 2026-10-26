import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { usePpeProductPrices } from './use-ppe-product-prices';

import type { Product } from '@admin/products/model';

const query = vi.hoisted(() => vi.fn());
vi.mock('@admin/products/data-access', () => ({ useGetPpeProductPricesQuery: query }));
afterEach(cleanup);
const ppe: Product = {
  id: 42,
  type: 'Ppe',
  name: 'ЗІЗ',
  slug: 'ppe',
  categoryIds: [],
  minimumWholesalePrice: 999,
  createdAtUtc: '',
  updatedAtUtc: null,
};
describe('PPE Product batch projection', () => {
  it('requests PPE IDs once and leaves Sewing on its own projection', () => {
    const sewing = { ...ppe, id: 7, type: 'Sewing' as const };
    query.mockReturnValue({ currentData: [], isFetching: false, isError: false, refetch: vi.fn() });
    const { result } = renderHook(() => usePpeProductPrices([ppe, sewing]));
    expect(query).toHaveBeenCalledWith([42], { skip: false });
    expect(result.current.products[1]).toBe(sewing);
    expect(result.current.products[0]?.ppePriceStatus).toBe('blocked');
  });
  it('does not use old page data during a new scope read', () => {
    query.mockReturnValue({
      data: [{ productId: 42, isEnrolled: false }],
      currentData: undefined,
      isFetching: true,
      isError: false,
      refetch: vi.fn(),
    });
    const { result } = renderHook(() => usePpeProductPrices([ppe]));
    expect(result.current.products[0]).toMatchObject({
      minimumWholesalePrice: 0,
      ppePriceStatus: 'loading',
    });
  });
});
