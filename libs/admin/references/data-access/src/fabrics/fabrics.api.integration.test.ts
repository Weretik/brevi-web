import { describe, expect, it, vi } from 'vitest';

import { createFabric, listFabrics } from './fabrics.api';

describe('fabric HTTP boundary', () => {
  it('treats collection 404 as an empty list', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 404 })) as typeof fetch;
    await expect(listFabrics(undefined, fetcher)).resolves.toEqual([]);
  });

  it('maps field errors and sends a write once', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify([
            { identifier: 'Request.ProviderName', errorMessage: 'Постачальника не знайдено.' },
          ]),
          { status: 400 },
        ),
      ) as typeof fetch;
    await expect(
      createFabric({ id: 4, name: 'Льон', providerName: 'Атлас', price: 25 }, fetcher),
    ).rejects.toMatchObject({
      status: 400,
      fieldErrors: { providerName: 'Постачальника не знайдено.' },
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
