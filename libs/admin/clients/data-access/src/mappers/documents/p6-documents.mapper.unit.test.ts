import { describe, expect, it } from 'vitest';

import { mapActiveEmailTemplate } from './email-template.mapper';
import { mapProductionPackage } from './production-package.mapper';
import { mapQuoteDelivery } from './quote-delivery.mapper';

const id = '11111111-1111-1111-1111-111111111111';
const at = '2026-10-30T12:00:00Z';
const delivery = {
  deliveryId: id,
  quoteId: id,
  versionId: id,
  artifactId: id,
  emailTemplateVersionId: id,
  recipientAddress: 'sandbox@example.test',
  status: 'queued',
  attempt: 0,
  createdAt: at,
  updatedAt: at,
};
const artifact = {
  packageId: id,
  quoteId: id,
  versionId: id,
  schemaVersion: 1,
  contentType: 'application/zip',
  sha256: 'A'.repeat(64),
  length: 200,
  createdAt: at,
};
describe('P6 document boundary', () => {
  it('keeps queued and unknown distinct from confirmed provider success', () => {
    expect(mapQuoteDelivery(delivery).state).toBe('queued');
    expect(mapQuoteDelivery({ ...delivery, status: 'unknown', attempt: 1 }).confirmedAt).toBeNull();
    expect(
      mapQuoteDelivery({ ...delivery, status: 'succeeded', attempt: 1, confirmedAt: at })
        .confirmedAt,
    ).toBe(at);
  });
  it('rejects invented statuses, malformed identities and false success', () => {
    for (const changes of [
      { status: 'sent' },
      { quoteId: 'bad' },
      { status: 'succeeded' },
      { attempt: -1 },
    ])
      expect(() => mapQuoteDelivery({ ...delivery, ...changes })).toThrow();
  });
  it('accepts only bounded versioned ZIP metadata', () => {
    expect(mapProductionPackage(artifact).bytes).toBe(200);
    for (const changes of [
      { schemaVersion: 2 },
      { contentType: 'text/html' },
      { sha256: 'bad' },
      { length: 67108865 },
    ])
      expect(() => mapProductionPackage({ ...artifact, ...changes })).toThrow();
  });
  it('treats no active email template as a normal blocker', () => {
    expect(mapActiveEmailTemplate({ revision: 1, active: null })).toBeNull();
    expect(
      mapActiveEmailTemplate({
        revision: 2,
        active: {
          versionId: id,
          name: 'Лист',
          number: 1,
          subject: 'КП',
          body: 'Текст',
          createdAt: at,
        },
      })?.id,
    ).toBe(id);
  });
});
