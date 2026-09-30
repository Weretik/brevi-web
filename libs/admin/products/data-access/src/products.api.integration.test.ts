import { describe, expect, it, vi } from 'vitest';

import { deleteProduct, getProduct, listProducts, replaceProduct } from './products.api';
import { ProductApiError } from './products.http';

import type { ProductDraft } from './products.model';

const row = {
  id: 1,
  name: 'Куртка',
  slug: 'jacket',
  type: 'Sewing',
  categoryIds: [2],
  mainPhoto: null,
  createdAtUtc: '2026-09-01T00:00:00Z',
  updatedAtUtc: null,
  minimumWholesalePrice: 0,
};

describe('product reads', () => {
  it('uses server paging and sends filters', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          value: [row],
          pagedInfo: { pageNumber: 2, pageSize: 10, totalPages: 5, totalRecords: 42 },
        }),
        { status: 200 },
      ),
    );
    const result = await listProducts(
      { page: 2, pageSize: 10, search: 'Куртка', type: 'Sewing' },
      undefined,
      fetcher,
    );
    expect(result.pagedInfo.totalRecords).toBe(42);
    expect(result.value[0].name).toBe('Куртка');
    expect(fetcher.mock.calls[0][0]).toContain('search=%D0%9A%D1%83%D1%80%D1%82%D0%BA%D0%B0');
  });

  it('accepts an empty page', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          value: [],
          pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 0, totalRecords: 0 },
        }),
        { status: 200 },
      ),
    );
    expect((await listProducts({}, undefined, fetcher)).value).toEqual([]);
  });

  it('rejects invalid data before it reaches UI', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          value: [{ ...row, id: '1' }],
          pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 1, totalRecords: 1 },
        }),
        { status: 200 },
      ),
    );
    await expect(listProducts({}, undefined, fetcher)).rejects.toThrow(
      'Некоректна відповідь товарів',
    );
  });

  it('rejects malformed nested detail before opening the editor', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          ...row,
          ruName: 'Куртка',
          descriptionUk: 'Опис',
          descriptionRu: 'Описание',
          categories: [],
          photos: [{ mediaFileId: 3 }],
          informationBlocks: [],
          characteristicTables: [],
          sewing: { metersPerProduct: 2, fabrics: [], accessories: [], operations: [] },
        }),
        { status: 200 },
      ),
    );
    await expect(getProduct(1, undefined, fetcher)).rejects.toThrow('Некоректні деталі товару');
  });

  it('preserves not-found status', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 404 }));
    await expect(getProduct(42, undefined, fetcher)).rejects.toMatchObject({ status: 404 });
  });

  it('cancels without converting AbortError into a retryable error', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new DOMException('Aborted', 'AbortError'));
    await expect(listProducts({}, undefined, fetcher)).rejects.toMatchObject({
      name: 'AbortError',
    });
  });

  it('exposes API error message', () => {
    expect(new ProductApiError(409).message).toContain('Конфлікт');
  });

  it('uses a safe conflict message from the API', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ message: 'Назва вже існує.' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    await expect(getProduct(1, undefined, fetcher)).rejects.toMatchObject({
      status: 409,
      message: 'Назва вже існує.',
    });
  });

  it('joins conflict messages from the validation array', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        new Response(
          JSON.stringify([{ errorMessage: 'Назва вже існує.' }, { errorMessage: 'Оберіть іншу.' }]),
          { status: 409 },
        ),
      );
    await expect(getProduct(1, undefined, fetcher)).rejects.toMatchObject({
      status: 409,
      message: 'Назва вже існує. Оберіть іншу.',
    });
  });

  it('does not treat a delete conflict as success', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 409 }));
    await expect(deleteProduct(1, fetcher)).rejects.toMatchObject({ status: 409 });
  });

  it('sends a complete replace body and preserves validation errors', async () => {
    const draft: ProductDraft = {
      name: 'Рукавиці',
      ruName: 'Перчатки',
      type: 'Ppe',
      descriptionUk: 'Опис',
      descriptionRu: 'Описание',
      categoryIds: [],
      photos: [],
      informationBlocks: [],
      characteristicTables: [],
      supplierId: 2,
      basePrice: 10,
      retailPercent: { source: 'Custom', customPercent: 5 },
      wholesalePercent: { source: 'Custom', customPercent: 3 },
    };
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        new Response(
          JSON.stringify([{ identifier: 'Request.Name', errorMessage: 'Невірна назва' }]),
          { status: 400 },
        ),
      );
    await expect(replaceProduct(1, draft, fetcher)).rejects.toMatchObject({
      status: 400,
      fieldErrors: { name: 'Невірна назва' },
    });
    expect(JSON.parse(String(fetcher.mock.calls[0][1]?.body))).toMatchObject({
      name: 'Рукавиці',
      supplierId: 2,
      photos: [],
      characteristicTables: [],
    });
  });
});
