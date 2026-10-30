import { createHash } from 'node:crypto';
import { createServer } from 'node:http';

import { configureStore } from '@reduxjs/toolkit';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { downloadProductionPackage } from './download-production-package';
import { quoteEmailTemplateApi } from './email-template.api';
import { productionPackageApi } from './production-package.api';
import { quoteDeliveryApi } from './quote-delivery.api';

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
const at = '2026-10-30T12:00:00Z';
const zip = Buffer.from([80, 75, 3, 4, 1, 2, 3, 4]);
const sha256 = createHash('sha256').update(zip).digest('hex');
let mode = 'ok';
const writes: Record<string, unknown>[] = [];
const delivery = () => ({
  deliveryId: id,
  quoteId: mode === 'foreign' ? other : id,
  versionId: id,
  artifactId: id,
  emailTemplateVersionId: id,
  recipientAddress: 'sandbox@example.test',
  status: 'queued',
  attempt: 0,
  createdAt: at,
  updatedAt: at,
});
const server = createServer(async (request, response) => {
  if (mode === 'denied' || mode === 'missing') {
    response.writeHead(mode === 'missing' ? 404 : 403, { 'content-type': 'application/json' });
    response.end('{}');
    return;
  }
  const path = request.url ?? '';
  if (path.endsWith('/content')) {
    response.setHeader('content-type', 'application/zip');
    response.end(mode === 'badzip' ? Buffer.from([80, 75, 3, 4, 9, 9, 9, 9]) : zip);
    return;
  }
  response.setHeader('content-type', 'application/json');
  if (request.method === 'POST') {
    let body = '';
    for await (const chunk of request) body += String(chunk);
    writes.push(JSON.parse(body) as Record<string, unknown>);
  }
  if (path.endsWith('/deliveries') && request.method === 'POST') {
    response.statusCode = 202;
    response.end(JSON.stringify(delivery()));
    return;
  }
  if (path.includes('/deliveries?')) {
    response.end(
      JSON.stringify({
        value: [delivery()],
        pagedInfo: { pageNumber: 1, pageSize: 25, totalPages: 1, totalRecords: 1 },
      }),
    );
    return;
  }
  if (path.endsWith('/active')) {
    response.end(
      JSON.stringify({
        revision: 2,
        active: {
          versionId: id,
          number: 1,
          name: 'Лист',
          subject: 'КП',
          body: 'Текст',
          createdAt: at,
        },
      }),
    );
    return;
  }
  response.end(
    JSON.stringify({
      packageId: id,
      quoteId: id,
      versionId: id,
      schemaVersion: 1,
      contentType: 'application/zip',
      sha256,
      length: zip.length,
      createdAt: at,
    }),
  );
});
const storeForTest = () =>
  configureStore({
    reducer: { [quoteDeliveryApi.reducerPath]: quoteDeliveryApi.reducer },
    middleware: (get) => get().concat(quoteDeliveryApi.middleware),
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
  writes.length = 0;
});
describe('P6 pinned HTTP boundary', () => {
  it('uses generated enqueue fields and maps202 without marking sent', async () => {
    const store = storeForTest();
    const result = await store
      .dispatch(
        quoteDeliveryApi.endpoints.enqueueQuoteDelivery.initiate({
          quoteId: id,
          versionId: id,
          revision: 2,
          requestId: other,
          pdfId: id,
          templateId: id,
          recipient: 'sandbox@example.test',
          manager: 'Manager',
        }),
      )
      .unwrap();
    expect(result.state).toBe('queued');
    expect(writes[0]).toEqual({
      requestId: other,
      versionId: id,
      expectedRevision: 2,
      artifactId: id,
      emailTemplateVersionId: id,
      recipientAddress: 'sandbox@example.test',
      managerName: 'Manager',
    });
    expect(writes[0]).not.toHaveProperty('subject');
    store.dispatch(quoteDeliveryApi.util.resetApiState());
  });
  it('validates paged history scope and active email version', async () => {
    const store = storeForTest();
    expect(
      (
        await store
          .dispatch(quoteEmailTemplateApi.endpoints.getActiveQuoteEmailTemplate.initiate())
          .unwrap()
      )?.id,
    ).toBe(id);
    expect(
      (
        await store
          .dispatch(
            quoteDeliveryApi.endpoints.getQuoteDeliveries.initiate({ quoteId: id, page: 1 }),
          )
          .unwrap()
      ).rows[0]?.versionId,
    ).toBe(id);
    mode = 'foreign';
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      await expect(
        store
          .dispatch(
            quoteDeliveryApi.endpoints.getQuoteDeliveries.initiate(
              { quoteId: id, page: 1 },
              { forceRefetch: true },
            ),
          )
          .unwrap(),
      ).rejects.toBeDefined();
    } finally {
      log.mockRestore();
      store.dispatch(quoteDeliveryApi.util.resetApiState());
    }
  });
  it('exports selected IDs and validates saved ZIP checksum before download', async () => {
    const store = storeForTest();
    const artifact = await store
      .dispatch(
        productionPackageApi.endpoints.exportQuoteProduction.initiate({
          quoteId: id,
          versionId: id,
          requestId: other,
          selectedVariantIds: [other],
        }),
      )
      .unwrap();
    expect(writes[0]).toEqual({ requestId: other, versionId: id, variantIds: [other] });
    expect((await downloadProductionPackage(artifact)).size).toBe(zip.length);
    mode = 'badzip';
    await expect(downloadProductionPackage(artifact)).rejects.toThrow('Контрольна сума');
    store.dispatch(quoteDeliveryApi.util.resetApiState());
  });
  it.each([
    ['history', 403],
    ['history', 404],
    ['enqueue', 403],
    ['enqueue', 404],
    ['export', 403],
    ['export', 404],
  ] as const)(
    'preserves %s HTTP %i rejection before clearing private cache',
    async (operation, status) => {
      const store = storeForTest();
      mode = status === 404 ? 'missing' : 'denied';
      const request =
        operation === 'history'
          ? store.dispatch(
              quoteDeliveryApi.endpoints.getQuoteDeliveries.initiate({ quoteId: id, page: 1 }),
            )
          : operation === 'enqueue'
            ? store.dispatch(
                quoteDeliveryApi.endpoints.enqueueQuoteDelivery.initiate({
                  quoteId: id,
                  versionId: id,
                  revision: 2,
                  requestId: other,
                  pdfId: id,
                  templateId: id,
                  recipient: 'sandbox@example.test',
                  manager: 'Manager',
                }),
              )
            : store.dispatch(
                productionPackageApi.endpoints.exportQuoteProduction.initiate({
                  quoteId: id,
                  versionId: id,
                  requestId: other,
                  selectedVariantIds: [other],
                }),
              );
      await expect(request.unwrap()).rejects.toMatchObject({ status });
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(Object.keys(store.getState()[quoteDeliveryApi.reducerPath].queries)).toHaveLength(0);
    },
  );
});
