import { createServer } from 'node:http';

import { configureStore } from '@reduxjs/toolkit';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { customSewingApi } from './custom-sewing.api';
import { mapCustomConfiguration } from '../../mappers/custom-sewing/custom-configuration.mapper';
import {
  customBasisFixture,
  customDetailFixture,
  customId,
  customVersionId,
} from '../../testing/custom-sewing/custom-response.fixture';

const createAdminApiStore = () =>
  configureStore({
    reducer: { [customSewingApi.reducerPath]: customSewingApi.reducer },
    middleware: (getDefault) => getDefault().concat(customSewingApi.middleware),
  });
const runtime = vi.hoisted(() => ({ port: 0 }));
vi.mock('@admin/shared/config', () => ({
  appConfig: {
    get apiBaseUrl() {
      return `http://127.0.0.1:${runtime.port}`;
    },
  },
}));
let detail = customDetailFixture();
let denied = false;
const writes: { path: string; body: Record<string, unknown> }[] = [];
const paths: string[] = [];
const server = createServer(async (request, response) => {
  const url = request.url ?? '';
  const path = url.split('?')[0]!;
  paths.push(url);
  response.setHeader('content-type', 'application/json');
  if (denied || path.includes('ffffffff-ffff-4fff-8fff-ffffffffffff')) {
    response.statusCode = 404;
    response.end(JSON.stringify({ title: 'Not found' }));
    return;
  }
  if (request.method !== 'GET') {
    let text = '';
    for await (const chunk of request) text += String(chunk);
    const body = JSON.parse(text) as Record<string, unknown>;
    writes.push({ path, body });
    if (path.endsWith('/calculations')) detail = { ...detail, preview: customBasisFixture() };
    else if (path.endsWith('/versions'))
      detail = {
        ...detail,
        revision: detail.revision + 1,
        currentVersion: {
          publicId: customVersionId,
          number: 1,
          parentVersionId: null,
          configuration: detail.configuration,
          basis: customBasisFixture(),
          actorId: 17,
          createdAt: detail.updatedAt,
        },
        preview: null,
      };
    else
      detail = {
        ...detail,
        revision: detail.revision + (request.method === 'PUT' ? 1 : 0),
        configuration: body['configuration'] as typeof detail.configuration,
      };
  }
  if (request.method === 'GET' && path.endsWith('/versions'))
    response.end(
      JSON.stringify({
        value: [
          {
            publicId: customVersionId,
            number: 1,
            parentVersionId: null,
            name: 'Куртка',
            actorId: 17,
            createdAt: detail.updatedAt,
          },
        ],
        pagedInfo: {
          pageNumber: Number(new URL(url, 'http://localhost').searchParams.get('page')),
          pageSize: 25,
          totalPages: 2,
          totalRecords: 26,
        },
      }),
    );
  else if (request.method === 'GET' && path.endsWith(customVersionId))
    response.end(JSON.stringify(detail.currentVersion));
  else response.end(JSON.stringify(detail));
});
beforeAll(async () => {
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  runtime.port = (server.address() as { port: number }).port;
});
afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});
beforeEach(() => {
  denied = false;
  detail = customDetailFixture();
  writes.length = 0;
  paths.length = 0;
});

describe('custom sewing HTTP boundary', () => {
  it('clears protected cached configuration after mutation access is lost', async () => {
    const store = createAdminApiStore();
    const subscription = store.dispatch(
      customSewingApi.endpoints.getCustomSewing.initiate(customId),
    );
    try {
      await subscription.unwrap();
      expect(
        customSewingApi.endpoints.getCustomSewing.select(customId)(store.getState()).data?.id,
      ).toBe(customId);
      denied = true;
      await expect(
        store
          .dispatch(
            customSewingApi.endpoints.saveCustomSewing.initiate({
              id: customId,
              revision: 1,
              requestId: customVersionId,
              configuration: mapCustomConfiguration(detail.configuration),
            }),
          )
          .unwrap(),
      ).rejects.toMatchObject({ status: 404 });
      await expect
        .poll(
          () => customSewingApi.endpoints.getCustomSewing.select(customId)(store.getState()).data,
        )
        .toBeUndefined();
    } finally {
      subscription.unsubscribe();
      store.dispatch(customSewingApi.util.resetApiState());
    }
  });
  it('uses explicit canonical draft/calculation/version bodies without browser totals', async () => {
    const store = createAdminApiStore();
    const requestId = '99999999-9999-4999-8999-999999999999';
    try {
      await store
        .dispatch(
          customSewingApi.endpoints.createCustomSewing.initiate({
            configuration: mapCustomConfiguration(detail.configuration),
            requestId,
          }),
        )
        .unwrap();
      expect(writes[0]!.body).toEqual({
        requestId,
        customerPublicId: null,
        quotePublicId: null,
        configuration: mapCustomConfiguration(detail.configuration),
      });
      expect(writes[0]!.body).not.toHaveProperty('retail');
      await store
        .dispatch(
          customSewingApi.endpoints.saveCustomSewing.initiate({
            id: customId,
            revision: 1,
            configuration: {
              ...mapCustomConfiguration(detail.configuration),
              description: 'Changed',
            },
            requestId,
          }),
        )
        .unwrap();
      await store
        .dispatch(
          customSewingApi.endpoints.calculateCustomSewing.initiate({
            id: customId,
            revision: 2,
            requestId,
          }),
        )
        .unwrap();
      expect(writes[2]!.body).toEqual({ requestId, expectedRevision: 2 });
      const saved = await store
        .dispatch(
          customSewingApi.endpoints.saveCustomSewingVersion.initiate({
            id: customId,
            revision: 2,
            requestId,
            basisToken: customVersionId,
          }),
        )
        .unwrap();
      expect(writes[3]!.body).toEqual({
        requestId,
        expectedRevision: 2,
        basisToken: customVersionId,
      });
      expect(saved.currentVersion?.basis.retail).toBe(120);
      const pinned = await store
        .dispatch(
          customSewingApi.endpoints.getCustomSewingVersion.initiate({
            id: customId,
            versionId: customVersionId,
          }),
        )
        .unwrap();
      expect(pinned.id).toBe(customVersionId);
      expect(pinned.basis.retail).toBe(120);
    } finally {
      store.dispatch(customSewingApi.util.resetApiState());
    }
  });
  it('pages saved versions and maps actual inaccessible root error', async () => {
    const store = createAdminApiStore();
    try {
      const page = await store
        .dispatch(
          customSewingApi.endpoints.getCustomSewingVersions.initiate({ id: customId, page: 2 }),
        )
        .unwrap();
      expect(page.page).toBe(2);
      expect(page.rows[0]!.id).toBe(customVersionId);
      expect(paths[0]).toContain('page=2');
      expect(paths[0]).toContain('pageSize=25');
      await expect(
        store
          .dispatch(
            customSewingApi.endpoints.getCustomSewing.initiate(
              'ffffffff-ffff-4fff-8fff-ffffffffffff',
            ),
          )
          .unwrap(),
      ).rejects.toMatchObject({ status: 404 });
    } finally {
      store.dispatch(customSewingApi.util.resetApiState());
    }
  });
});
