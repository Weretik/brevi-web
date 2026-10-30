import { createServer } from 'node:http';

import { configureStore } from '@reduxjs/toolkit';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { introductionActionsApi } from './introduction-actions.api';
import { introductionTemplatesApi } from './introduction-templates.api';
import {
  introductionDetailFixture,
  introductionPreparedFixture,
  introductionId,
  introductionVersionId,
} from '../../mappers/introductions/introduction.fixture';

const runtime = vi.hoisted(() => ({ port: 0 }));
vi.mock('@admin/shared/config', () => ({
  appConfig: {
    get apiBaseUrl() {
      return `http://127.0.0.1:${runtime.port}`;
    },
  },
}));
const api = introductionTemplatesApi;
const storeForTest = () =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (get) => get().concat(api.middleware),
  });
let status = 200;
const writes: Record<string, unknown>[] = [];
const urls: string[] = [];
const server = createServer(async (request, response) => {
  urls.push(request.url ?? '');
  response.setHeader('content-type', 'application/json');
  response.statusCode = status;
  if (status !== 200) {
    response.end(
      JSON.stringify(
        status === 400
          ? [{ identifier: 'slots.100', errorMessage: 'fabric_metadata_missing' }]
          : { title: 'Conflict' },
      ),
    );
    return;
  }
  if (request.method !== 'GET') {
    let text = '';
    for await (const chunk of request) text += String(chunk);
    writes.push(JSON.parse(text) as Record<string, unknown>);
  }
  const path = (request.url ?? '').split('?')[0]!;
  response.end(
    JSON.stringify(
      path.endsWith('/check')
        ? introductionPreparedFixture()
        : path.endsWith('/featured-mapping')
          ? { versionId: introductionVersionId, summerProductId: 10, winterProductId: 30 }
          : introductionDetailFixture(),
    ),
  );
});
beforeAll(async () => {
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  runtime.port = (server.address() as { port: number }).port;
});
afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});
beforeEach(() => {
  status = 200;
  writes.length = 0;
  urls.length = 0;
});
describe('introduction canonical HTTP', () => {
  it('keeps missing configuration stable without resetting cache or retrying', async () => {
    const store = storeForTest();
    status = 404;
    try {
      const result = await store.dispatch(
        introductionActionsApi.endpoints.getIntroductionFeaturedMapping.initiate(),
      );
      expect(result.isError).toBe(true);
      await new Promise((resolve) => setTimeout(resolve, 30));
      expect(urls).toHaveLength(1);
      expect(Object.keys(store.getState()[api.reducerPath].queries)).toHaveLength(1);
    } finally {
      store.dispatch(api.util.resetApiState());
    }
  });
  it('preserves server slot blocker fields on failed validation', async () => {
    const store = storeForTest();
    status = 400;
    try {
      const result = await store.dispatch(
        api.endpoints.checkIntroductionTemplate.initiate(
          { id: introductionId },
          { subscribe: false },
        ),
      );
      expect(result.error).toMatchObject({
        status: 400,
        fieldErrors: { 'slots.100': 'fabric_metadata_missing' },
      });
    } finally {
      store.dispatch(api.util.resetApiState());
    }
  });

  it('keeps requestId and selection-only payload stable on explicit retry', async () => {
    const store = storeForTest();
    try {
      const body = {
        requestId: introductionVersionId,
        name: 'Знайомство',
        format: 'summer' as const,
        emailTemplateVersionId: introductionVersionId,
        selections: Array.from({ length: 4 }, (_, i) => ({
          slotUid: (100 + i) as 100 | 101 | 102 | 103,
          productId: 10 + i,
          articleId: 20 + i,
        })),
      };
      await store.dispatch(api.endpoints.createIntroductionTemplate.initiate(body)).unwrap();
      await store.dispatch(api.endpoints.createIntroductionTemplate.initiate(body)).unwrap();
      expect(writes).toHaveLength(2);
      expect(writes[0]).toEqual(writes[1]);
      expect(writes[0]).toEqual({ ...body, format: undefined, layout: 'summer' });
      expect(writes[0]).not.toHaveProperty('largeWholesale');
    } finally {
      store.dispatch(api.util.resetApiState());
    }
  });
  it('performs fresh GET check with exact immutable version and maps featured identities', async () => {
    const store = storeForTest();
    try {
      const result = await store
        .dispatch(
          api.endpoints.checkIntroductionTemplate.initiate(
            { id: introductionId, versionId: introductionVersionId },
            { forceRefetch: true, subscribe: false },
          ),
        )
        .unwrap();
      expect(result.format).toBe('summer');
      expect(urls[0]).toContain(`/check?versionId=${introductionVersionId}`);
      const mapping = await store
        .dispatch(introductionActionsApi.endpoints.getIntroductionFeaturedMapping.initiate())
        .unwrap();
      expect(mapping.summerProductId).toBe(10);
    } finally {
      store.dispatch(api.util.resetApiState());
    }
  });
  it('does not turn failed source validation into an approved preview', async () => {
    const store = storeForTest();
    status = 409;
    try {
      const result = await store.dispatch(
        api.endpoints.checkIntroductionTemplate.initiate(
          { id: introductionId },
          { subscribe: false },
        ),
      );
      expect(result.isError).toBe(true);
      expect(result.data).toBeUndefined();
      expect((result.error as { status: number }).status).toBe(409);
    } finally {
      store.dispatch(api.util.resetApiState());
    }
  });
});
