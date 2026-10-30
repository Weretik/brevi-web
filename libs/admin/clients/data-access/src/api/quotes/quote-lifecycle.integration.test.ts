import { createServer } from 'node:http';

import { configureStore } from '@reduxjs/toolkit';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { quotesApi } from './quotes.api';

const createAdminApiStore = () =>
  configureStore({
    reducer: { [quotesApi.reducerPath]: quotesApi.reducer },
    middleware: (getDefault) => getDefault().concat(quotesApi.middleware),
  });

const runtime = vi.hoisted(() => ({ port: 0 }));
vi.mock('@admin/shared/config', () => ({
  appConfig: {
    get apiBaseUrl() {
      return `http://127.0.0.1:${runtime.port}`;
    },
  },
}));
const quote = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const version = '33333333-3333-4333-8333-333333333333';
const requestId = '44444444-4444-4444-8444-444444444444';
const at = '2026-10-28T12:00:00Z';
const hits = new Map<string, number>();
let lastBody: Record<string, unknown> = {};
let transferStatus = 200;
const snapshot = {
  publicId: version,
  versionNumber: 1,
  action: 'created',
  recipientName: 'Synthetic',
  currency: 'UAH',
  taxBasis: 'no_extra_vat',
  actorId: 17,
  createdAt: at,
  items: [],
};
const detail = (id = quote) => ({
  publicId: id,
  recipientName: 'Synthetic',
  revision: 1,
  state: 'draft',
  archived: false,
  number: null,
  ownerId: 17,
  createdAt: at,
  updatedAt: at,
  canEdit: true,
  version: snapshot,
});
const page = (value: unknown[]) => ({
  value,
  pagedInfo: { pageNumber: 1, pageSize: 25, totalPages: 1, totalRecords: value.length },
});
const server = createServer(async (req, res) => {
  const path = (req.url ?? '').split('?')[0];
  hits.set(path, (hits.get(path) ?? 0) + 1);
  res.setHeader('content-type', 'application/json');
  if (req.method === 'POST' || req.method === 'PUT') {
    let raw = '';
    for await (const chunk of req) raw += String(chunk);
    lastBody = JSON.parse(raw) as Record<string, unknown>;
    if (path.endsWith('/transfer') && transferStatus !== 200) {
      res.statusCode = transferStatus;
      res.end(JSON.stringify({ title: transferStatus === 409 ? 'Conflict' : 'Not Found' }));
      return;
    }
    if (path.endsWith('/copy'))
      res.end(JSON.stringify({ ...detail(other), sourceQuoteId: quote, sourceVersionId: version }));
    else if (path.endsWith('/transfer'))
      res.end(JSON.stringify({ ...detail(), ownerId: 18, revision: 2, canEdit: false }));
    else
      res.end(
        JSON.stringify({ ...detail(), revision: 2, archived: lastBody['archived'] === true }),
      );
    return;
  }
  const body =
    path === '/api/crm/quotes'
      ? page([detail(), detail(other)])
      : path === '/api/crm/quote-assignees'
        ? page([{ userId: 18, displayName: 'Synthetic Manager' }])
        : path.endsWith('/versions')
          ? page([
              {
                publicId: version,
                versionNumber: 1,
                action: 'created',
                actorId: 17,
                createdAt: at,
                parentVersionId: null,
              },
            ])
          : path.endsWith('/events')
            ? page([
                {
                  publicId: version,
                  revision: 1,
                  versionNumber: 1,
                  action: 'created',
                  actorId: 17,
                  ownerId: 17,
                  previousOwnerId: null,
                  reason: null,
                  createdAt: at,
                },
              ])
            : path.endsWith('/' + version)
              ? snapshot
              : detail(path.endsWith(other) ? other : quote);
  res.end(JSON.stringify(body));
});
describe('P3 quote HTTP and access cache (SC-Q02/04/05)', () => {
  beforeAll(async () => {
    await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
    const address = server.address();
    if (address && typeof address !== 'string') runtime.port = address.port;
  });
  afterAll(async () => {
    await new Promise<void>((done, reject) =>
      server.close((error) => (error ? reject(error) : done())),
    );
  });
  beforeEach(() => {
    hits.clear();
    transferStatus = 200;
    lastBody = {};
  });
  it('maps paged typed history, immutable detail and eligible assignee search', async () => {
    const store = createAdminApiStore();
    try {
      const versions = await store
        .dispatch(
          quotesApi.endpoints.getQuoteVersions.initiate({ quoteId: quote, page: 1, pageSize: 25 }),
        )
        .unwrap();
      const historical = await store
        .dispatch(
          quotesApi.endpoints.getQuoteVersion.initiate({ quoteId: quote, versionId: version }),
        )
        .unwrap();
      const events = await store
        .dispatch(
          quotesApi.endpoints.getQuoteEvents.initiate({ quoteId: quote, page: 1, pageSize: 25 }),
        )
        .unwrap();
      const assignees = await store
        .dispatch(
          quotesApi.endpoints.getQuoteAssignees.initiate({
            search: 'Synthetic',
            page: 1,
            pageSize: 25,
          }),
        )
        .unwrap();
      expect(versions.rows[0].parentVersionId).toBeNull();
      expect(historical.publicId).toBe(version);
      expect(events.rows[0].action).toBe('created');
      expect(assignees.rows[0]).toEqual({ userId: 18, displayName: 'Synthetic Manager' });
    } finally {
      store.dispatch(quotesApi.util.resetApiState());
    }
  });
  it('copies the selected version without posting browser prices or original state', async () => {
    const store = createAdminApiStore();
    try {
      const result = await store
        .dispatch(
          quotesApi.endpoints.copyQuote.initiate({
            action: 'copy',
            quoteId: quote,
            revision: 1,
            versionId: version,
            requestId,
          }),
        )
        .unwrap();
      expect(lastBody).toEqual({ expectedRevision: 1, versionId: version, requestId });
      expect(result.publicId).toBe(other);
      expect(result.sourceQuoteId).toBe(quote);
    } finally {
      store.dispatch(quotesApi.util.resetApiState());
    }
  });
  it('invalidates the changed quote, history and list while retaining another quote cache', async () => {
    const store = createAdminApiStore();
    const a = store.dispatch(quotesApi.endpoints.getQuote.initiate(quote));
    const b = store.dispatch(quotesApi.endpoints.getQuote.initiate(other));
    const history = store.dispatch(
      quotesApi.endpoints.getQuoteVersions.initiate({ quoteId: quote, page: 1, pageSize: 25 }),
    );
    try {
      await Promise.all([a.unwrap(), b.unwrap(), history.unwrap()]);
      await store
        .dispatch(
          quotesApi.endpoints.archiveQuote.initiate({
            action: 'archive',
            quoteId: quote,
            revision: 1,
            archived: true,
            reason: 'Done',
            requestId,
          }),
        )
        .unwrap();
      await vi.waitFor(() => expect(hits.get('/api/crm/quotes/' + quote + '/versions')).toBe(2));
      expect(hits.get('/api/crm/quotes/' + other)).toBe(1);
      expect(lastBody).toEqual({ requestId, expectedRevision: 1, archived: true, reason: 'Done' });
    } finally {
      a.unsubscribe();
      b.unsubscribe();
      history.unsubscribe();
      store.dispatch(quotesApi.util.resetApiState());
    }
  });
  it.each([200, 404])(
    'purges inaccessible protected cache after transfer result %s',
    async (status) => {
      const store = createAdminApiStore();
      const root = store.dispatch(quotesApi.endpoints.getQuote.initiate(quote));
      try {
        await root.unwrap();
        await store
          .dispatch(
            quotesApi.endpoints.getQuoteVersion.initiate({ quoteId: quote, versionId: version }),
          )
          .unwrap();
        transferStatus = status;
        await store
          .dispatch(
            quotesApi.endpoints.transferQuote.initiate({
              action: 'transfer',
              quoteId: quote,
              revision: 1,
              ownerId: 18,
              reason: 'Transfer',
              requestId,
            }),
          )
          .unwrap()
          .catch(() => undefined);
        await vi.waitFor(() =>
          expect(quotesApi.endpoints.getQuote.select(quote)(store.getState()).data).toBeUndefined(),
        );
        expect(
          quotesApi.endpoints.getQuoteVersion.select({ quoteId: quote, versionId: version })(
            store.getState(),
          ).data,
        ).toBeUndefined();
      } finally {
        root.unsubscribe();
        store.dispatch(quotesApi.util.resetApiState());
      }
    },
  );
  it('does not purge an accessible snapshot on a definite 409 conflict', async () => {
    const store = createAdminApiStore();
    const root = store.dispatch(quotesApi.endpoints.getQuote.initiate(quote));
    try {
      await root.unwrap();
      transferStatus = 409;
      await expect(
        store
          .dispatch(
            quotesApi.endpoints.transferQuote.initiate({
              action: 'transfer',
              quoteId: quote,
              revision: 1,
              ownerId: 18,
              reason: 'Transfer',
              requestId,
            }),
          )
          .unwrap(),
      ).rejects.toMatchObject({ status: 409 });
      expect(quotesApi.endpoints.getQuote.select(quote)(store.getState()).data?.publicId).toBe(
        quote,
      );
    } finally {
      root.unsubscribe();
      store.dispatch(quotesApi.util.resetApiState());
    }
  });
});
