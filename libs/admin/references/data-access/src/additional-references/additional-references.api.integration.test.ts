import { describe, expect, it, vi } from 'vitest';

import { listAdditionalReferences, updateAdditionalReference } from './additional-references.api';

describe('additional references HTTP boundary', () => {
  it('treats the backend empty collection response as empty', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 404 })) as typeof fetch;
    await expect(listAdditionalReferences(undefined, fetcher)).resolves.toEqual([]);
  });

  it('maps validation errors and sends a write only once', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify([{ identifier: 'Request.Name', errorMessage: 'Назва вже існує.' }]),
          { status: 400 },
        ),
      ) as typeof fetch;
    await expect(
      updateAdditionalReference(
        3,
        { name: 'Знижка', key: 'discount', value: 5, unit: '%', description: null },
        fetcher,
      ),
    ).rejects.toMatchObject({
      status: 400,
      fieldErrors: { name: 'Назва вже існує.' },
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
