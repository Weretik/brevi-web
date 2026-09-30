import { describe, expect, it, vi } from 'vitest';

import {
  createGarmentPartOperation,
  deleteGarmentPartOperation,
  listGarmentPartOperations,
  updateGarmentPartOperation,
} from './garment-part-operations.api';

describe('garment part operations transport', () => {
  it('rejects malformed responses at the API boundary', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => [{ id: 1, name: 'Шов', min: 2 }] });
    await expect(listGarmentPartOperations(undefined, fetcher)).rejects.toThrow(
      'Некоректна робота.',
    );
  });

  it('uses contract paths and bodies for writes', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true });
    await createGarmentPartOperation(
      { id: 3, garmentPartName: 'Рукав', name: 'Шов', min: 1.5 },
      fetcher,
    );
    await updateGarmentPartOperation(3, { garmentPartName: 'Рукав', name: 'Шов', min: 2 }, fetcher);
    await deleteGarmentPartOperation(3, fetcher);
    expect(fetcher).toHaveBeenNthCalledWith(
      1,
      '/api/reference/garment-part-operations',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ id: 3, garmentPartName: 'Рукав', name: 'Шов', min: 1.5 }),
      }),
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      2,
      '/api/reference/garment-part-operations/3',
      expect.objectContaining({ method: 'PUT' }),
    );
    expect(fetcher).toHaveBeenNthCalledWith(
      3,
      '/api/reference/garment-part-operations/3',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});
