import { createServer } from 'node:http';

import { configureStore } from '@reduxjs/toolkit';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { quoteEmailTemplateApi as api } from './email-template.api';

const runtime = vi.hoisted(() => ({ port: 0 }));
vi.mock('@admin/shared/config', () => ({
  appConfig: {
    get apiBaseUrl() {
      return `http://127.0.0.1:${runtime.port}`;
    },
  },
}));
const id = '11111111-1111-1111-1111-111111111111';
const other = '22222222-2222-2222-2222-222222222222';
const at = '2026-11-01T12:00:00Z';
const template = (versionId = id, number = 1) => ({
  versionId,
  number,
  name: 'Лист',
  subject: 'КП {quoteNumber}',
  body: 'Вітаємо {recipientName}. {managerName}',
  createdAt: at,
});
let mode = 'ok';
let active = id;
let revision = 2;
let created = false;
const calls: { method: string; url: string; body: Record<string, unknown> | null }[] = [];
const server = createServer(async (request, response) => {
  const url = request.url ?? '';
  let raw = '';
  for await (const chunk of request) raw += String(chunk);
  const body = raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  calls.push({ method: request.method ?? '', url, body });
  response.setHeader('content-type', 'application/json');
  if (mode.startsWith('denied')) {
    response.statusCode = Number(mode.slice(6));
    response.end('{}');
    return;
  }
  if (mode === 'conflict' && request.method === 'PUT') {
    response.statusCode = 409;
    response.end('{}');
    return;
  }
  if (url.startsWith('/api/crm/email-templates?')) {
    const page = Number(new URL(url, 'http://fixture').searchParams.get('page'));
    const pageSize = Number(new URL(url, 'http://fixture').searchParams.get('pageSize'));
    const rows = [template(), ...(created ? [template(other, 2)] : [])].map((row) => ({
      versionId: row.versionId,
      number: row.number,
      name: row.name,
      subject: row.subject,
      createdAt: row.createdAt,
    }));
    response.end(
      JSON.stringify({
        value: rows,
        pagedInfo: {
          pageNumber: mode === 'wrong-page' ? page + 1 : page,
          pageSize,
          totalPages: 1,
          totalRecords: rows.length,
        },
      }),
    );
    return;
  }
  if (url === '/api/crm/email-templates/versions' && request.method === 'POST') {
    created = true;
    response.end(
      JSON.stringify({
        ...template(other, 2),
        name: body?.['name'],
        subject: body?.['subject'],
        body: body?.['body'],
      }),
    );
    return;
  }
  if (url === '/api/crm/email-templates/active') {
    if (request.method === 'PUT') {
      active = String(body?.['versionId']);
      revision += 1;
    }
    response.end(JSON.stringify({ revision, active: template(active, active === id ? 1 : 2) }));
    return;
  }
  if (url === `/api/crm/email-templates/${id}` || url === `/api/crm/email-templates/${other}`) {
    response.end(
      JSON.stringify(
        template(mode === 'foreign' ? other : url.split('/').at(-1), url.endsWith(other) ? 2 : 1),
      ),
    );
    return;
  }
  response.statusCode = 404;
  response.end('{}');
});
const storeForTest = () =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (get) => get().concat(api.middleware),
  });
beforeAll(async () => {
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  runtime.port = (server.address() as { port: number }).port;
});
afterAll(async () => {
  await new Promise<void>((done) => server.close(() => done()));
});
beforeEach(() => {
  mode = 'ok';
  active = id;
  revision = 2;
  created = false;
  calls.length = 0;
});

describe('versioned email registry pinned HTTP boundary', () => {
  it('uses the canonical paged list, version detail and active settings operations', async () => {
    const store = storeForTest();
    try {
      const page = await store
        .dispatch(api.endpoints.getQuoteEmailTemplates.initiate({ page: 1 }))
        .unwrap();
      expect(page.rows[0]?.id).toBe(id);
      expect(page.pageSize).toBe(25);
      expect(
        (await store.dispatch(api.endpoints.getQuoteEmailTemplate.initiate({ id })).unwrap()).body,
      ).toContain('{recipientName}');
      expect(
        (await store.dispatch(api.endpoints.getQuoteEmailTemplateSettings.initiate()).unwrap())
          .revision,
      ).toBe(2);
      expect(calls.map((call) => call.url)).toContain(`/api/crm/email-templates/${id}`);
    } finally {
      store.dispatch(api.util.resetApiState());
    }
  });

  it('sends immutable create/activation intents and refreshes list, settings and send-panel active state', async () => {
    const store = storeForTest();
    try {
      await store.dispatch(api.endpoints.getQuoteEmailTemplates.initiate({ page: 1 })).unwrap();
      await store.dispatch(api.endpoints.getQuoteEmailTemplateSettings.initiate()).unwrap();
      await store.dispatch(api.endpoints.getActiveQuoteEmailTemplate.initiate()).unwrap();
      const create = {
        requestId: other,
        name: 'Новий лист',
        subject: 'Нове КП {quoteNumber}',
        body: 'Новий текст {managerName}',
      };
      expect(
        (await store.dispatch(api.endpoints.createQuoteEmailTemplate.initiate(create)).unwrap()).id,
      ).toBe(other);
      expect(calls.find((call) => call.method === 'POST')).toEqual({
        method: 'POST',
        url: '/api/crm/email-templates/versions',
        body: create,
      });
      await vi.waitFor(() =>
        expect(
          api.endpoints.getQuoteEmailTemplates.select({ page: 1 })(store.getState()).data?.rows,
        ).toHaveLength(2),
      );
      const activate = { requestId: id, expectedRevision: 2, versionId: other };
      expect(
        (await store.dispatch(api.endpoints.activateQuoteEmailTemplate.initiate(activate)).unwrap())
          .active?.id,
      ).toBe(other);
      expect(calls.find((call) => call.method === 'PUT')?.body).toEqual(activate);
      await vi.waitFor(() => {
        expect(api.endpoints.getActiveQuoteEmailTemplate.select()(store.getState()).data?.id).toBe(
          other,
        );
        expect(
          api.endpoints.getQuoteEmailTemplateSettings.select()(store.getState()).data?.revision,
        ).toBe(3);
      });
    } finally {
      store.dispatch(api.util.resetApiState());
    }
  });

  it.each(['foreign', 'wrong-page'])('rejects a mismatched %s response', async (failure) => {
    const store = storeForTest();
    mode = failure;
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      const action =
        failure === 'foreign'
          ? store.dispatch(api.endpoints.getQuoteEmailTemplate.initiate({ id }))
          : store.dispatch(api.endpoints.getQuoteEmailTemplates.initiate({ page: 1 }));
      await expect(action.unwrap()).rejects.toBeDefined();
    } finally {
      log.mockRestore();
      store.dispatch(api.util.resetApiState());
    }
  });

  it.each([401, 403, 404])(
    'preserves HTTP %i rejection before clearing private registry cache',
    async (status) => {
      const store = storeForTest();
      try {
        await store.dispatch(api.endpoints.getQuoteEmailTemplateSettings.initiate()).unwrap();
        mode = `denied${status}`;
        await expect(
          store.dispatch(api.endpoints.getQuoteEmailTemplate.initiate({ id })).unwrap(),
        ).rejects.toMatchObject({ status });
        await vi.waitFor(() =>
          expect(
            api.endpoints.getQuoteEmailTemplateSettings.select()(store.getState()).data,
          ).toBeUndefined(),
        );
      } finally {
        store.dispatch(api.util.resetApiState());
      }
    },
  );

  it('preserves active data and revision conflict without silently activating a different version', async () => {
    const store = storeForTest();
    try {
      await store.dispatch(api.endpoints.getQuoteEmailTemplateSettings.initiate()).unwrap();
      mode = 'conflict';
      const body = { requestId: other, expectedRevision: 1, versionId: other };
      await expect(
        store.dispatch(api.endpoints.activateQuoteEmailTemplate.initiate(body)).unwrap(),
      ).rejects.toMatchObject({ status: 409 });
      expect(
        api.endpoints.getQuoteEmailTemplateSettings.select()(store.getState()).data?.active?.id,
      ).toBe(id);
      expect(calls.filter((call) => call.method === 'PUT')).toHaveLength(1);
      expect(calls.at(-1)?.body).toEqual(body);
    } finally {
      store.dispatch(api.util.resetApiState());
    }
  });
});
