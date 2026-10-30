import { createServer } from 'node:http';

import { configureStore } from '@reduxjs/toolkit';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { customTemplatesApi } from './custom-templates.api';
import { mapTemplateSelections } from '../../mappers/custom-templates/template.mapper';
import {
  customDetailFixture,
  customId,
  customVersionId,
} from '../../testing/custom-sewing/custom-response.fixture';

const runtime = vi.hoisted(() => ({ port: 0 }));
vi.mock('@admin/shared/config', () => ({
  appConfig: {
    get apiBaseUrl() {
      return `http://127.0.0.1:${runtime.port}`;
    },
  },
}));
const storeForTest = () =>
  configureStore({
    reducer: { [customTemplatesApi.reducerPath]: customTemplatesApi.reducer },
    middleware: (getDefault) => getDefault().concat(customTemplatesApi.middleware),
  });
let status = 200;
const writes: { path: string; body: Record<string, unknown> }[] = [];
const urls: string[] = [];
const dto = () => ({
  publicId: customId,
  ownerId: 17,
  revision: 3,
  archived: false,
  kind: 'customConfiguration',
  versionId: customVersionId,
  versionNumber: 2,
  introduction: 'Вступ',
  selections: { ...customDetailFixture().configuration, applications: [] },
  updatedAt: '2026-10-28T10:00:00Z',
  canEdit: true,
});
const server = createServer(async (request, response) => {
  const path = (request.url ?? '').split('?')[0]!;
  urls.push(request.url ?? '');
  response.setHeader('content-type', 'application/json');
  response.statusCode = status;
  if (status !== 200) {
    response.end(JSON.stringify({ title: 'Denied or conflict' }));
    return;
  }
  if (request.method !== 'GET') {
    let text = '';
    for await (const chunk of request) text += String(chunk);
    writes.push({ path, body: JSON.parse(text) as Record<string, unknown> });
  }
  if (path.endsWith('/apply'))
    response.end(
      JSON.stringify({
        draft: customDetailFixture({ publicId: '33333333-3333-4333-8333-333333333333' }),
        templateVersionId: customVersionId,
        introduction: 'Вступ',
      }),
    );
  else if (request.method === 'GET' && path === '/api/crm/quote-templates')
    response.end(
      JSON.stringify({
        value: [{ ...dto(), name: 'Куртка', productType: 'Куртка', season: 'winter' }],
        pagedInfo: { pageNumber: 2, totalPages: 3 },
      }),
    );
  else response.end(JSON.stringify(dto()));
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
describe('template canonical HTTP operations', () => {
  it('uses pagination/archive query and an exact immutable version query', async () => {
    const store = storeForTest();
    try {
      const page = await store
        .dispatch(
          customTemplatesApi.endpoints.getCustomTemplates.initiate({
            page: 2,
            includeArchived: true,
          }),
        )
        .unwrap();
      await store
        .dispatch(
          customTemplatesApi.endpoints.getCustomTemplate.initiate({
            id: customId,
            versionId: customVersionId,
          }),
        )
        .unwrap();
      expect(page.rows[0]?.id).toBe(customId);
      expect(urls[0]).toContain('page=2');
      expect(urls[0]).toContain('includeArchived=true');
      expect(urls[1]).toContain(`versionId=${customVersionId}`);
    } finally {
      store.dispatch(customTemplatesApi.util.resetApiState());
    }
  });
  it('writes selections only and applies explicit version to a new unpriced draft', async () => {
    const store = storeForTest();
    const selections = mapTemplateSelections(dto().selections);
    try {
      await store
        .dispatch(
          customTemplatesApi.endpoints.createCustomTemplate.initiate({
            requestId: customVersionId,
            introduction: 'Вступ',
            selections,
          }),
        )
        .unwrap();
      expect(writes[0]?.body).toEqual({
        requestId: customVersionId,
        introduction: 'Вступ',
        kind: 'customConfiguration',
        selections,
      });
      await store
        .dispatch(
          customTemplatesApi.endpoints.reviseCustomTemplate.initiate({
            id: customId,
            revision: 3,
            requestId: customVersionId,
            introduction: 'Новий вступ',
            selections,
          }),
        )
        .unwrap();
      expect(writes[1]?.body).toMatchObject({ expectedRevision: 3, introduction: 'Новий вступ' });
      expect(writes[1]?.body).not.toHaveProperty('revision');
      const result = await store
        .dispatch(
          customTemplatesApi.endpoints.applyCustomTemplate.initiate({
            id: customId,
            revision: 3,
            requestId: customVersionId,
            versionId: customVersionId,
            customerId: null,
            quoteId: null,
          }),
        )
        .unwrap();
      expect(writes[2]?.body).toEqual({
        requestId: customVersionId,
        expectedRevision: 3,
        versionId: customVersionId,
        customerPublicId: null,
        quotePublicId: null,
      });
      expect(result.draft.id).not.toBe(customId);
      expect(result.draft.preview).toBeNull();
      expect(result.versionId).toBe(customVersionId);
    } finally {
      store.dispatch(customTemplatesApi.util.resetApiState());
    }
  });
  it.each([403, 404])('clears protected detail cache after denied archive %s', async (code) => {
    const store = storeForTest();
    const query = { id: customId };
    try {
      await store.dispatch(customTemplatesApi.endpoints.getCustomTemplate.initiate(query)).unwrap();
      status = code;
      await expect(
        store
          .dispatch(
            customTemplatesApi.endpoints.archiveCustomTemplate.initiate({
              id: customId,
              revision: 3,
              requestId: customVersionId,
              archived: true,
            }),
          )
          .unwrap(),
      ).rejects.toMatchObject({ status: code });
      await expect
        .poll(
          () => customTemplatesApi.endpoints.getCustomTemplate.select(query)(store.getState()).data,
        )
        .toBeUndefined();
    } finally {
      store.dispatch(customTemplatesApi.util.resetApiState());
    }
  });
});
