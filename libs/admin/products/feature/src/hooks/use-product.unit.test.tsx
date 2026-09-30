import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useProduct } from './use-product';

import type { ProductDetail } from '@admin/products/data-access';

const mocks = vi.hoisted(() => ({ getProduct: vi.fn() }));
vi.mock('@admin/products/data-access', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@admin/products/data-access')>()),
  getProduct: mocks.getProduct,
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((complete) => {
    resolve = complete;
  });
  return { promise, resolve };
}

describe('useProduct', () => {
  it('ignores a stale detail response after the ID changes', async () => {
    const first = deferred<ProductDetail>();
    const second = deferred<ProductDetail>();
    mocks.getProduct
      .mockReset()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    const { result, rerender } = renderHook(({ id }) => useProduct(id), {
      initialProps: { id: 1 },
    });
    rerender({ id: 2 });
    await act(async () => {
      first.resolve({ id: 1 } as ProductDetail);
      await first.promise;
    });
    expect(result.current.product).toBeNull();
    await act(async () => {
      second.resolve({ id: 2 } as ProductDetail);
      await second.promise;
    });
    await waitFor(() => expect(result.current.product?.id).toBe(2));
  });
});
