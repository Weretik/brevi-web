import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useProduct } from './use-product';

import type { ProductDetail } from '@admin/products/model';

const mocks = vi.hoisted(() => ({ useGetProductQuery: vi.fn() }));
vi.mock('@admin/products/data-access', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@admin/products/data-access')>()),
  useGetProductQuery: mocks.useGetProductQuery,
}));

describe('useProduct', () => {
  it('uses the RTK Query result for the current product ID', () => {
    mocks.useGetProductQuery.mockImplementation((id: number) => ({
      data: { id } as ProductDetail,
      error: undefined,
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    }));
    const { result, rerender } = renderHook(({ id }) => useProduct(id), {
      initialProps: { id: 1 },
    });
    expect(result.current.product?.id).toBe(1);

    rerender({ id: 2 });

    expect(result.current.product?.id).toBe(2);
    expect(mocks.useGetProductQuery).toHaveBeenLastCalledWith(2, { skip: false });
  });
});
