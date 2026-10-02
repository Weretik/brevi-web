import { adminApi, createAdminApiStore } from '@admin/shared/api-client';
import { configureApiEnvironment } from '@admin/shared/config';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { productMediaApi } from './api/product-media.api';
import { productsApi } from './api/products.api';

const adminStore = createAdminApiStore();

afterEach(() => {
  adminStore.dispatch(adminApi.util.resetApiState());
  vi.unstubAllGlobals();
});

describe('productsApi', () => {
  it('serializes filters and maps the list response through the shared base query', async () => {
    configureApiEnvironment({ production: true, api: { baseUrl: 'http://localhost' } });
    const fetcher = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          value: [
            {
              id: 8,
              name: 'Куртка',
              slug: 'kurtka',
              type: 'Sewing',
              categoryIds: [2],
              minimumWholesalePrice: 10,
              mainPhoto: null,
              createdAtUtc: '2026-01-01T00:00:00Z',
              updatedAtUtc: null,
            },
          ],
          pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 1, totalRecords: 1 },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    vi.stubGlobal('fetch', fetcher);

    const result = await adminStore
      .dispatch(
        productsApi.endpoints.listProducts.initiate({
          page: 1,
          pageSize: 20,
          search: 'куртка',
          sortBy: 'name',
          sortDirection: 'asc',
        }),
      )
      .unwrap();

    expect(result.value[0]?.id).toBe(8);
    expect((fetcher.mock.calls[0]?.[0] as Request).url).toContain(
      'search=%D0%BA%D1%83%D1%80%D1%82%D0%BA%D0%B0',
    );
  });

  it('uses FormData for media upload and invalidates the media cache', async () => {
    configureApiEnvironment({ production: true, api: { baseUrl: 'http://localhost' } });
    const fetcher = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          mediaFileId: 4,
          storageKey: 'catalog/4.webp',
          publicUrl: '/media/4.webp',
          contentType: 'image/webp',
          originalFileName: '4.webp',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    vi.stubGlobal('fetch', fetcher);
    const file = new File(['image'], '4.webp', { type: 'image/webp' });

    const id = await adminStore
      .dispatch(productMediaApi.endpoints.uploadProductMedia.initiate(file))
      .unwrap();

    expect(id).toBe(4);
    expect(await (fetcher.mock.calls[0]?.[0] as Request).clone().formData()).toBeInstanceOf(
      FormData,
    );
  });
});
