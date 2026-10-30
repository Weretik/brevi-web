import { createServer } from 'node:http';

import { configureStore } from '@reduxjs/toolkit';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { customSuggestionsApi } from './custom-suggestions.api';

const runtime = vi.hoisted(() => ({ port: 0 }));
vi.mock('@admin/shared/config', () => ({
  appConfig: {
    get apiBaseUrl() {
      return `http://127.0.0.1:${runtime.port}`;
    },
  },
}));
let status = 200;
let path = '';
let method = '';
const server = createServer((request, response) => {
  path = request.url ?? '';
  method = request.method ?? '';
  response.statusCode = status;
  response.setHeader('content-type', 'application/json');
  response.end(
    JSON.stringify(
      status === 200
        ? {
            productType: 'Куртка',
            season: 'winter',
            sampleSize: 0,
            norms: [],
            sourceLimitReached: false,
          }
        : { title: 'Unavailable' },
    ),
  );
});
beforeAll(async () => {
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('No test server port');
  runtime.port = address.port;
});
afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});
beforeEach(() => {
  status = 200;
  path = '';
  method = '';
});
const args = { productType: 'Куртка' as const, season: 'winter' as const };
describe('canonical suggestions HTTP query', () => {
  it('uses only the canonical read operation and exact profile query', async () => {
    const store = configureStore({
      reducer: { [customSuggestionsApi.reducerPath]: customSuggestionsApi.reducer },
      middleware: (getDefault) => getDefault().concat(customSuggestionsApi.middleware),
    });
    const query = store.dispatch(
      customSuggestionsApi.endpoints.getCustomSuggestions.initiate(args),
    );
    try {
      expect((await query.unwrap()).norms).toEqual([]);
      const url = new URL(path, 'http://localhost');
      expect(url.pathname).toBe('/api/crm/custom-sewing/suggestions');
      expect(Object.fromEntries(url.searchParams)).toEqual(args);
      expect(method).toBe('GET');
    } finally {
      query.unsubscribe();
      store.dispatch(customSuggestionsApi.util.resetApiState());
    }
  });
  it.each([403, 404, 503])(
    'maps response status %s without pretending an empty result',
    async (code) => {
      status = code;
      const store = configureStore({
        reducer: { [customSuggestionsApi.reducerPath]: customSuggestionsApi.reducer },
        middleware: (getDefault) => getDefault().concat(customSuggestionsApi.middleware),
      });
      const query = store.dispatch(
        customSuggestionsApi.endpoints.getCustomSuggestions.initiate(args),
      );
      try {
        await expect(query.unwrap()).rejects.toMatchObject({ status: code });
      } finally {
        query.unsubscribe();
        store.dispatch(customSuggestionsApi.util.resetApiState());
      }
    },
  );
});
