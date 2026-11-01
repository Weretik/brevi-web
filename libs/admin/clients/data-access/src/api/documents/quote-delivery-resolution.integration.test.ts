import { createServer } from 'node:http';

import { configureStore } from '@reduxjs/toolkit';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { quoteDeliveryResolutionApi as api } from './quote-delivery-resolution.api';

const runtime = vi.hoisted(() => ({ port: 0 }));
vi.mock('@admin/shared/config', () => ({
  appConfig: {
    get apiBaseUrl() {
      return 'http://127.0.0.1:' + runtime.port;
    },
  },
}));
const id = '11111111-1111-1111-1111-111111111111';
const other = '22222222-2222-2222-2222-222222222222';
const at = '2026-11-01T12:00:00Z';
const command = {
  quoteId: id,
  deliveryId: id,
  requestId: other,
  expectedAttempt: 1,
  outcome: 'sent' as const,
  evidenceNote: 'Перевірено точний лист',
};
let mode = 'ok';
let captured: unknown;
let capturedPath = '';
const server = createServer(async (request, response) => {
  capturedPath = request.url ?? '';
  let body = '';
  for await (const chunk of request) body += String(chunk);
  captured = JSON.parse(body);
  response.setHeader('content-type', 'application/json');
  if (mode === 'conflict' || mode === 'denied') {
    response.statusCode = mode === 'conflict' ? 409 : 403;
    response.end('{}');
    return;
  }
  response.end(
    JSON.stringify({
      deliveryId: mode === 'foreign' ? other : id,
      quoteId: id,
      versionId: id,
      artifactId: id,
      emailTemplateVersionId: id,
      recipientAddress: 'sandbox@example.test',
      status: 'succeeded',
      attempt: 1,
      createdAt: at,
      updatedAt: at,
      confirmedAt: at,
      canResolveManually: false,
      manualResolution:
        mode === 'missing'
          ? null
          : {
              outcome: 'sent',
              actorId: 18,
              attempt: mode === 'attempt' ? 2 : 1,
              evidenceNote: command.evidenceNote,
              createdAt: at,
            },
    }),
  );
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
  captured = null;
});
const storeForTest = () =>
  configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (get) => get().concat(api.middleware),
  });
describe('manual outcome HTTP boundary', () => {
  it('sends the canonical explicit command without forged actor/time/provider data', async () => {
    const store = storeForTest();
    try {
      const result = await store
        .dispatch(api.endpoints.resolveQuoteDelivery.initiate(command))
        .unwrap();
      expect(capturedPath).toBe('/api/crm/quotes/' + id + '/deliveries/' + id + '/resolution');
      expect(captured).toEqual({
        requestId: other,
        expectedAttempt: 1,
        outcome: 'sent',
        evidenceNote: command.evidenceNote,
      });
      expect(result.manualResolution?.actorId).toBe(18);
      expect(result.canResolveManually).toBe(false);
    } finally {
      store.dispatch(api.util.resetApiState());
    }
  });
  it.each(['foreign', 'missing', 'attempt'])(
    'rejects an unproven or mismatched response: %s',
    async (value) => {
      mode = value;
      const store = storeForTest();
      try {
        await expect(
          store.dispatch(api.endpoints.resolveQuoteDelivery.initiate(command)).unwrap(),
        ).rejects.toBeDefined();
      } finally {
        store.dispatch(api.util.resetApiState());
      }
    },
  );
  it.each([
    ['conflict', 409],
    ['denied', 403],
  ] as const)('preserves actionable status %s', async (value, status) => {
    mode = value;
    const store = storeForTest();
    try {
      await expect(
        store.dispatch(api.endpoints.resolveQuoteDelivery.initiate(command)).unwrap(),
      ).rejects.toMatchObject({ status });
    } finally {
      store.dispatch(api.util.resetApiState());
    }
  });
});
