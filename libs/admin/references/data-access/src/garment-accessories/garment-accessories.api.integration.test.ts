import { describe, expect, it, vi } from 'vitest';

import { createGarmentAccessory, listGarmentAccessories } from './garment-accessories.api';
import { GarmentAccessoryApiError } from './garment-accessories.error';

describe('garment accessory HTTP boundary', () => {
  it('treats the backend collection 404 as an empty list', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 404 })) as typeof fetch;
    await expect(listGarmentAccessories(undefined, fetcher)).resolves.toEqual([]);
  });

  it('rejects malformed network rows', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify([{ id: 1, price: 'bad' }]), { status: 200 }),
      ) as typeof fetch;
    await expect(listGarmentAccessories(undefined, fetcher)).rejects.toThrow(
      'Некоректний запис фурнітури.',
    );
  });

  it('maps validation errors and does not retry a write', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify([{ identifier: 'Request.Price', errorMessage: 'Неправильна ціна.' }]),
          { status: 400 },
        ),
      ) as typeof fetch;
    await expect(
      createGarmentAccessory(
        { id: 1, name: 'Блискавка', supplierName: 'Тест', price: 12 },
        fetcher,
      ),
    ).rejects.toMatchObject({
      status: 400,
      fieldErrors: { price: 'Неправильна ціна.' },
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('reports a network failure without exposing transport text', async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValue(new TypeError('secret transport detail')) as typeof fetch;
    await expect(listGarmentAccessories(undefined, fetcher)).rejects.toBeInstanceOf(
      GarmentAccessoryApiError,
    );
  });
});
