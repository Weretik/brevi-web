import { adminApi, createAdminApiStore } from '@admin/shared/api-client';
import { configureAppConfig } from '@admin/shared/config';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { sewingCompositionApi } from './sewing-composition.api';
import { compositionResponseFixture as composition } from '../../test-fixtures/sewing-composition/composition-response.fixture';

import type { SewingCompositionDraft } from '@admin/products/model';

const store = createAdminApiStore();
afterEach(() => {
  store.dispatch(adminApi.util.resetApiState());
  vi.unstubAllGlobals();
});

describe('Article composition transport', () => {
  it('saves only Article-specific rows and the original concurrency token', async () => {
    configureAppConfig({ production: true, api: { baseUrl: 'http://localhost' } });
    const fetcher = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify(composition), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    vi.stubGlobal('fetch', fetcher);
    const draft: SewingCompositionDraft = {
      productId: 101,
      articleId: 246,
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
          required: true,
          sortOrder: 0,
          reviewed: true,
        },
      ],
      articleMaterials: [
        {
          clientId: 'own',
          kind: 'Fabric',
          referenceId: 59,
          costCode: null,
          quantity: 3.6,
          unit: 'Metre',
          required: true,
          sortOrder: 0,
          reviewed: true,
        },
      ],
      operations: [],
    };
    await store
      .dispatch(sewingCompositionApi.endpoints.replaceSewingArticleComposition.initiate(draft))
      .unwrap();
    const request = fetcher.mock.calls[0]?.[0] as Request;
    expect(request.url).toMatch(/\/api\/v1\/products\/101\/articles\/246\/composition$/);
    const body = await request.clone().json();
    expect(body.expectedVersion).toBe(3);
    expect(body.materials).toHaveLength(1);
    expect(body.materials[0]).not.toHaveProperty('clientId');
    expect(body.materials[0].referenceId).toBe(59);
    expect(body).not.toHaveProperty('operations');
  });
});
