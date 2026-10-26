import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { useProductPrices } from './use-product-prices';

import type { Product } from '@admin/products/model';

const queries = vi.hoisted(() => ({ sewing: vi.fn(), ppe: vi.fn() }));
vi.mock('@admin/products/data-access', () => ({
  useGetPublishedSewingProductsQuery: queries.sewing,
  useGetPpeProductPricesQuery: queries.ppe,
}));
afterEach(cleanup);
it('combines the two bounded price sources without overwriting the other Product type', () => {
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
  const sewing = { ...ppe, id: 7, type: 'Sewing' as const };
  queries.ppe.mockReturnValue({
    currentData: [{ productId: 42, isEnrolled: true, prices: { wholesale: 136 } }],
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  });
  queries.sewing.mockReturnValue({
    currentData: [{ productId: 7, articleCount: 1, articles: [{ prices: { wholesale: 264 } }] }],
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  });
  const { result } = renderHook(() => useProductPrices([ppe, sewing]));
  expect(queries.ppe).toHaveBeenCalledWith([42], { skip: false });
  expect(queries.sewing).toHaveBeenCalledWith([7], { skip: false });
  expect(result.current.products.map((x) => x.minimumWholesalePrice)).toEqual([136, 264]);
});
