import { describe, expect, it, vi } from 'vitest';

import { createSupplier, listSuppliers, SupplierApiError } from './suppliers.api';

describe('supplier HTTP boundary', () => {
  it('maps validation errors to form fields without retrying a write', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify([{ identifier: 'Request.Name', errorMessage: 'Назва вже існує.' }]),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        ),
      ) as typeof fetch;

    await expect(
      createSupplier(
        { id: 1, name: 'Атлас', link: '', contactPerson: '', phoneNumber: '', notes: '' },
        fetcher,
      ),
    ).rejects.toMatchObject({ status: 400, fieldErrors: { name: 'Назва вже існує.' } });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('turns a network failure into a user-facing error', async () => {
    const fetcher = vi.fn().mockRejectedValue(new TypeError('Failed to fetch')) as typeof fetch;
    await expect(listSuppliers(undefined, fetcher)).rejects.toBeInstanceOf(SupplierApiError);
  });
});
