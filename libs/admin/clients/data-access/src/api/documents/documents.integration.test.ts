import { createServer } from 'node:http';

import { configureStore } from '@reduxjs/toolkit';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { issuerSettingsApi } from './issuer-settings.api';
import { downloadQuotePdfArtifact } from '../quotes/documents/download-quote-pdf-artifact';
import { quotesApi } from '../quotes/quotes.api';

const runtime = vi.hoisted(() => ({ port: 0 }));
vi.mock('@admin/shared/config', () => ({
  appConfig: {
    get apiBaseUrl() {
      return `http://127.0.0.1:${runtime.port}`;
    },
  },
}));

const quoteId = '11111111-1111-4111-8111-111111111111';
const versionId = '22222222-2222-4222-8222-222222222222';
const artifactId = '33333333-3333-4333-8333-333333333333';
const requestId = '44444444-4444-4444-8444-444444444444';
const at = '2026-10-29T12:00:00Z';
const requests: { method: string; path: string; body: unknown }[] = [];
let pdfValid = true;
const issuer = {
  legalName: 'Brevi',
  edrpou: '12345678',
  taxId: '123456',
  iban: 'UA123456',
  address: 'Kyiv',
  phone: '+380',
  email: 'a@b.ua',
  site: 'https://brevi.ua',
  bankName: null,
  mfo: null,
  logoAssetKey: 'brevi-wordmark',
} as const;
const template = {
  layoutKey: 'standard',
  title: 'КП',
  vatNotice: 'З ПДВ',
  openingText: 'Вітаємо',
  ctaTitle: 'Контакт',
  ctaText: 'Зв’яжіться',
  ctaContactTemplate: 'Телефон',
} as const;
const settings = {
  revision: 1,
  active: {
    revision: 1,
    isActive: true,
    issuerVersionId: versionId,
    templateVersionId: versionId,
    versionNumber: 1,
    issuer,
    template,
    createdAt: at,
  },
};
const artifact = {
  artifactId,
  status: 'succeeded',
  sha256: 'a'.repeat(64),
  length: 12,
  errorCode: null,
  createdAt: at,
  updatedAt: at,
  generatedAt: at,
};
const quote = {
  publicId: quoteId,
  recipientName: 'Client',
  revision: 2,
  state: 'ready',
  archived: false,
  number: '10/10/2026',
  ownerId: 17,
  createdAt: at,
  updatedAt: at,
  canEdit: true,
  version: {
    publicId: versionId,
    versionNumber: 1,
    action: 'created',
    recipientName: 'Client',
    currency: 'UAH',
    taxBasis: 'no_extra_vat',
    actorId: 17,
    createdAt: at,
    items: [],
  },
};
const server = createServer(async (req, res) => {
  const path = req.url ?? '';
  let raw = '';
  for await (const chunk of req) raw += String(chunk);
  requests.push({ method: req.method ?? '', path, body: raw ? JSON.parse(raw) : null });
  if (path.endsWith('/content')) {
    res.setHeader('content-type', pdfValid ? 'application/pdf' : 'text/plain');
    res.end(pdfValid ? '%PDF-1.7\n%%EOF' : 'not a pdf');
    return;
  }
  res.setHeader('content-type', 'application/json');
  res.end(
    JSON.stringify(
      path === '/api/crm/issuer-settings' || path.endsWith('/active')
        ? settings
        : path.endsWith('/versions')
          ? settings.active
          : path.endsWith('/ready')
            ? quote
            : artifact,
    ),
  );
});
const store = configureStore({
  reducer: { [quotesApi.reducerPath]: quotesApi.reducer },
  middleware: (getDefault) => getDefault().concat(quotesApi.middleware),
});

describe('FE-008 generated document operations', () => {
  beforeAll(async () => {
    await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
    const address = server.address();
    if (address && typeof address !== 'string') runtime.port = address.port;
  });
  afterAll(async () => {
    await new Promise<void>((done) => server.close(() => done()));
  });

  it('reads, creates and activates seller settings through the typed API', async () => {
    const current = await store
      .dispatch(issuerSettingsApi.endpoints.getIssuerSettings.initiate())
      .unwrap();
    expect(current.active?.issuer.legalName).toBe('Brevi');
    const created = await store
      .dispatch(
        issuerSettingsApi.endpoints.createIssuerSettingsVersion.initiate({
          requestId,
          issuer,
          template,
        }),
      )
      .unwrap();
    expect(created.issuerVersionId).toBe(versionId);
    await store
      .dispatch(
        issuerSettingsApi.endpoints.activateIssuerSettings.initiate({
          requestId,
          expectedRevision: 1,
          issuerVersionId: versionId,
          templateVersionId: versionId,
        }),
      )
      .unwrap();
    expect(
      requests.some(
        (request) =>
          request.method === 'PUT' &&
          request.path === '/api/crm/issuer-settings/active' &&
          (request.body as { expectedRevision: number }).expectedRevision === 1,
      ),
    ).toBe(true);
  });

  it('prepares the exact quote version and reads the stored PDF artifact', async () => {
    const ready = await store
      .dispatch(
        quotesApi.endpoints.prepareQuote.initiate({
          quoteId,
          body: { requestId, expectedRevision: 1, versionId },
        }),
      )
      .unwrap();
    expect(ready.number).toBe('10/10/2026');
    const rendered = await store
      .dispatch(quotesApi.endpoints.renderQuotePdf.initiate({ quoteId, body: { versionId } }))
      .unwrap();
    const status = await store
      .dispatch(quotesApi.endpoints.getQuotePdfArtifact.initiate({ quoteId, artifactId }))
      .unwrap();
    expect(rendered.artifactId).toBe(status.artifactId);
    expect(
      requests.some(
        (request) =>
          request.path.endsWith('/ready') &&
          (request.body as { expectedRevision: number }).expectedRevision === 1,
      ),
    ).toBe(true);
  });
  it('downloads authenticated PDF bytes and rejects a non-PDF response', async () => {
    const blob = await downloadQuotePdfArtifact(quoteId, artifactId);
    expect(blob.type).toBe('application/pdf');
    expect(await blob.text()).toMatch(/^%PDF-/);
    pdfValid = false;
    await expect(downloadQuotePdfArtifact(quoteId, artifactId)).rejects.toThrow('некоректний PDF');
    pdfValid = true;
  });
});
