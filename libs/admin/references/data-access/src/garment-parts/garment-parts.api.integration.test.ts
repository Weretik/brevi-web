import { describe, expect, it, vi } from 'vitest';

import { createGarmentPart, listGarmentParts, updateGarmentPart } from './garment-parts.api';

describe('garment parts HTTP boundary', () => {
  it('returns an empty list for the backend empty collection response', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 404 })) as typeof fetch;
    await expect(listGarmentParts(undefined, fetcher)).resolves.toEqual([]);
  });

  it('maps validation errors and never retries a write', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify([{ identifier: 'Request.Name', errorMessage: 'Назва вже існує.' }]),
          { status: 400 },
        ),
      ) as typeof fetch;
    await expect(createGarmentPart({ id: 1, name: 'Рукав' }, fetcher)).rejects.toMatchObject({
      status: 400,
      fieldErrors: { name: 'Назва вже існує.' },
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('uses the contract endpoint for update', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 200 })) as typeof fetch;
    await updateGarmentPart(7, { name: 'Комір' }, fetcher);
    expect(fetcher).toHaveBeenCalledWith(
      '/api/reference/garment-parts/7',
      expect.objectContaining({ method: 'PUT' }),
    );
  });
});
