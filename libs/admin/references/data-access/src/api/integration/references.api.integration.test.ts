import { adminApi, createAdminApiStore } from '@admin/shared/api-client';
import { configureAppConfig } from '@admin/shared/config';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { fabricsApi } from '../fabrics/fabrics.api';
import { suppliersApi } from '../suppliers/suppliers.api';

const adminStore = createAdminApiStore();

afterEach(() => {
  adminStore.dispatch(adminApi.util.resetApiState());
  vi.unstubAllGlobals();
});

describe('referencesApi', () => {
  it('maps supplier DTOs through the canonical base query', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    const fetcher = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 1,
            name: 'Атлас',
            link: null,
            contactPerson: null,
            phoneNumber: null,
            notes: null,
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    vi.stubGlobal('fetch', fetcher);

    const suppliers = await adminStore
      .dispatch(suppliersApi.endpoints.listSuppliers.initiate())
      .unwrap();

    expect(suppliers).toEqual([
      {
        id: 1,
        name: 'Атлас',
        link: null,
        contactPerson: null,
        phoneNumber: null,
        notes: null,
      },
    ]);
    expect((fetcher.mock.calls[0]?.[0] as Request).url).toContain('/api/reference/suppliers');
  });

  it('normalizes backend validation errors for editor field errors', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify([{ identifier: 'Request.Name', errorMessage: 'Обов’язково' }]),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      ),
    );

    await expect(
      adminStore
        .dispatch(
          fabricsApi.endpoints.createFabric.initiate({
            id: 2,
            name: '',
            providerName: '',
            price: 1,
          }),
        )
        .unwrap(),
    ).rejects.toMatchObject({ status: 400, fieldErrors: { name: 'Обов’язково' } });
  });
});
