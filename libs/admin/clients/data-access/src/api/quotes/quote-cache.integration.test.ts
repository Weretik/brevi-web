import { createServer } from 'node:http';

import { createAdminApiStore } from '@admin/shared/api-client';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { quotesApi } from './quotes.api';

const runtime = vi.hoisted(() => ({ port: 0 }));
vi.mock('@admin/shared/config', () => ({
  appConfig: {
    get apiBaseUrl() {
      return `http://127.0.0.1:${runtime.port}`;
    },
  },
}));
const idA = '11111111-1111-4111-8111-111111111111';
const idB = '22222222-2222-4222-8222-222222222222';
const at = '2026-10-27T12:00:00Z';
const hits = new Map<string, number>();
let lastBody: Record<string, unknown> = {};
let revision = 1;
const detail = (id: string) => ({
  publicId: id,
  recipientName: 'Synthetic',
  revision: id === idA ? revision : 1,
  versionNumber: id === idA ? revision : 1,
  state: 'draft',
  archived: false,
  number: null,
  ownerId: 17,
  createdAt: at,
  updatedAt: at,
  canEdit: true,
  version: {
    publicId: id,
    versionNumber: id === idA ? revision : 1,
    action: 'edited',
    recipientName: 'Synthetic',
    customerPublicId: null,
    contactPublicId: null,
    currency: 'UAH',
    taxBasis: 'no_extra_vat',
    actorId: 17,
    createdAt: at,
    items: [],
  },
});
const server = createServer(async (request, response) => {
  const path = (request.url ?? '').split('?')[0];
  const key = `${request.method}:${path}`;
  hits.set(key, (hits.get(key) ?? 0) + 1);
  response.setHeader('content-type', 'application/json');
  if (request.method === 'POST') {
    let body = '';
    for await (const chunk of request) body += String(chunk);
    lastBody = JSON.parse(body) as Record<string, unknown>;
    if (lastBody['expectedRevision'] !== revision) {
      response.statusCode = 409;
      response.end(JSON.stringify({ title: 'Conflict' }));
      return;
    }
    revision++;
  }
  response.end(
    JSON.stringify(
      path === '/api/crm/quotes'
        ? {
            value: [detail(idA), detail(idB)],
            pagedInfo: { pageNumber: 1, pageSize: 25, totalPages: 1, totalRecords: 2 },
          }
        : detail(path?.includes(idA) ? idA : idB),
    ),
  );
});
describe('quote HTTP/cache boundary (SC-Q01/04)', () => {
  beforeAll(async () => {
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (address && typeof address !== 'string') runtime.port = address.port;
  });
  afterAll(async () => {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  });
  it('sends the revision/request key and invalidates only the changed quote plus its list', async () => {
    const store = createAdminApiStore();
    const first = store.dispatch(quotesApi.endpoints.getQuote.initiate(idA));
    const second = store.dispatch(quotesApi.endpoints.getQuote.initiate(idB));
    const list = store.dispatch(quotesApi.endpoints.listQuotes.initiate({ page: 1, pageSize: 25 }));
    try {
      const [a, , page] = await Promise.all([first.unwrap(), second.unwrap(), list.unwrap()]);
      expect(page.total).toBe(2);
      await store
        .dispatch(
          quotesApi.endpoints.saveQuoteVersion.initiate({
            quoteId: idA,
            revision: 1,
            draft: a.draft,
            requestId: idB,
          }),
        )
        .unwrap();
      expect(lastBody).toEqual({ requestId: idB, expectedRevision: 1, content: { items: [] } });
      await vi.waitFor(() => expect(hits.get(`GET:/api/crm/quotes/${idA}`)).toBe(2));
      expect(hits.get(`GET:/api/crm/quotes/${idB}`)).toBe(1);
      const stale = store.dispatch(
        quotesApi.endpoints.saveQuoteVersion.initiate({
          quoteId: idA,
          revision: 1,
          draft: a.draft,
          requestId: idA,
        }),
      );
      await expect(stale.unwrap()).rejects.toMatchObject({ code: 'Conflict', status: 409 });
      expect(hits.get(`GET:/api/crm/quotes/${idB}`)).toBe(1);
    } finally {
      first.unsubscribe();
      second.unsubscribe();
      list.unsubscribe();
      store.dispatch(quotesApi.util.resetApiState());
    }
  });
});
