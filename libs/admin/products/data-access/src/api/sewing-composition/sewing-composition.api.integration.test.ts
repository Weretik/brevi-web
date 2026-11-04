import { adminApi, createAdminApiStore } from '@admin/shared/api-client';
import { configureAppConfig } from '@admin/shared/config';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { sewingCompositionApi } from './sewing-composition.api';
import {
  compositionResponseFixture as composition,
  sharedMaterial,
} from '../../test-fixtures/sewing-composition/composition-response.fixture';

import type { SewingCompositionDraft } from '@admin/products/model';

const store = createAdminApiStore();
afterEach(() => {
  store.dispatch(adminApi.util.resetApiState());
  vi.unstubAllGlobals();
});

describe('Shared model composition transport', () => {
  it('saves the shared materials and operations with the original concurrency token', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    const fetcher = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({ ...composition, articleId: null, materials: [sharedMaterial] }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      ),
    );
    vi.stubGlobal('fetch', fetcher);
    const draft: SewingCompositionDraft = {
      productId: 101,
      modelCode: 'MOD-025',
      version: 3,
      modelMaterials: [
        {
          clientId: 'common',
          kind: 'Accessory',
          referenceId: 10,
          costCode: null,
          quantity: 2,
          unit: 'Piece',
          sortOrder: 0,
          comment: '',
        },
      ],
      operations: [
        {
          clientId: 'op',
          operationId: 7,
          quantity: 2,
          manualMinutes: null,
          sortOrder: 0,
          comment: '',
        },
      ],
    };
    await store
      .dispatch(sewingCompositionApi.endpoints.replaceSewingComposition.initiate(draft))
      .unwrap();
    const request = fetcher.mock.calls[0]?.[0] as Request;
    expect(request.method).toBe('PUT');
    expect(request.url).toMatch(/\/api\/v1\/products\/101\/composition$/);
    const body = await request.clone().json();
    expect(body.expectedVersion).toBe(3);
    expect(body.modelCode).toBe('MOD-025');
    expect(body.materials).toHaveLength(1);
    expect(body.materials[0]).not.toHaveProperty('clientId');
    expect(body.materials[0].comment).toBeNull();
    expect(body.operations[0].operationId).toBe(7);
  });
});
