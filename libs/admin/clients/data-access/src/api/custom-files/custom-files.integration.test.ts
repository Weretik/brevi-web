import { createServer } from 'node:http';

import { configureApiClient } from '@admin/shared/api-client';
import { configureStore } from '@reduxjs/toolkit';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { customFilesApi, getCustomFileContent } from './custom-files.api';
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
const fileId = '22222222-2222-4222-8222-222222222222';
const file = {
  publicId: fileId,
  draftId: customId,
  contentType: 'application/pdf',
  length: 8,
  sha256: 'A'.repeat(64),
  state: 'Uploaded',
  expiresAt: '2026-10-29T12:00:00Z',
  showInQuote: false,
  production: true,
  isFinalized: true,
};
let status = 200;
const requests: { url: string; body: string; type?: string; auth?: string }[] = [];
const server = createServer(async (request, response) => {
  let body = '';
  for await (const chunk of request) body += String(chunk);
  requests.push({
    url: request.url!,
    body,
    type: request.headers['content-type'],
    auth: request.headers.authorization,
  });
  response.statusCode = status;
  if (status !== 200) {
    response.end();
    return;
  }
  if (request.url?.includes('/content')) {
    response.setHeader('content-type', 'application/pdf');
    response.setHeader('Cache-Control', 'private, no-store');
    response.end('%PDF-1.7');
    return;
  }
  response.setHeader('content-type', 'application/json');
  if (request.method === 'POST') response.end(JSON.stringify({ ...file, isFinalized: false }));
  else if (request.method === 'PUT')
    response.end(JSON.stringify({ ...customDetailFixture(), revision: 2 }));
  else response.end(JSON.stringify([file]));
});
const store = () =>
  configureStore({
    reducer: { [customFilesApi.reducerPath]: customFilesApi.reducer },
    middleware: (getDefault) => getDefault().concat(customFilesApi.middleware),
  });
beforeAll(async () => {
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  runtime.port = (server.address() as { port: number }).port;
  configureApiClient({ authSession: { getAccessToken: () => 'fixture-token' } });
});
afterAll(async () => {
  configureApiClient({});
  await new Promise<void>((resolve) => server.close(() => resolve()));
});
beforeEach(() => {
  status = 200;
  requests.length = 0;
});

describe('private file authenticated transport', () => {
  it('uploads actual multipart bytes and keeps server identity', async () => {
    const api = store();
    try {
      const result = await api
        .dispatch(
          customFilesApi.endpoints.uploadCustomFile.initiate({
            id: customId,
            requestId: customVersionId,
            file: new File(['%PDF-1.7'], 'source.pdf', { type: 'application/pdf' }),
          }),
        )
        .unwrap();
      expect(result.id).toBe(fileId);
      expect(result.isFinalized).toBe(false);
      expect(requests[0]?.type).toMatch(/^multipart\/form-data; boundary=/);
      expect(requests[0]?.body).toContain('%PDF-1.7');
      expect(requests[0]?.body).toContain(customVersionId);
      expect(requests[0]?.auth).toBe('Bearer fixture-token');
    } finally {
      api.dispatch(customFilesApi.util.resetApiState());
    }
  });
  it('finalizes explicit flags/revision without incidental metadata', async () => {
    const api = store();
    try {
      const result = await api
        .dispatch(
          customFilesApi.endpoints.setCustomFiles.initiate({
            id: customId,
            revision: 1,
            requestId: customVersionId,
            files: [{ fileId, showInQuote: false, production: true }],
          }),
        )
        .unwrap();
      expect(result.revision).toBe(2);
      expect(JSON.parse(requests[0]!.body)).toEqual({
        requestId: customVersionId,
        expectedRevision: 1,
        files: [{ fileId, showInQuote: false, production: true }],
      });
    } finally {
      api.dispatch(customFilesApi.util.resetApiState());
    }
  });
  it('sends exact immutable version/quote scope and maps finalized flags', async () => {
    const api = store();
    try {
      const result = await api
        .dispatch(
          customFilesApi.endpoints.getCustomFiles.initiate({
            id: customId,
            versionId: customVersionId,
            quoteId: customId,
          }),
        )
        .unwrap();
      expect(result[0]?.production).toBe(true);
      expect(requests[0]?.url).toContain(`versionId=${customVersionId}`);
      expect(requests[0]?.url).toContain(`quoteId=${customId}`);
    } finally {
      api.dispatch(customFilesApi.util.resetApiState());
    }
  });
  it('downloads protected bytes outside Redux cache with exact historical scope', async () => {
    const blob = await getCustomFileContent({
      fileId,
      versionId: customVersionId,
      quoteId: customId,
    });
    expect(await blob.text()).toBe('%PDF-1.7');
    expect(blob.type).toBe('application/pdf');
    expect(requests[0]?.auth).toBe('Bearer fixture-token');
    expect(requests[0]?.url).toContain(`versionId=${customVersionId}`);
  });
  it.each([404, 409, 413, 415, 503])('preserves real transport status %s', async (code) => {
    status = code;
    const api = store();
    try {
      await expect(
        api
          .dispatch(
            customFilesApi.endpoints.uploadCustomFile.initiate({
              id: customId,
              requestId: customVersionId,
              file: new File(['x'], 'x.png', { type: 'image/png' }),
            }),
          )
          .unwrap(),
      ).rejects.toMatchObject({ status: code });
    } finally {
      api.dispatch(customFilesApi.util.resetApiState());
    }
  });
  it('propagates missing protected content without creating a blob', async () => {
    status = 404;
    await expect(getCustomFileContent({ fileId })).rejects.toMatchObject({ status: 404 });
  });
});
