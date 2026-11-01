import { describe, expect, it } from 'vitest';

import { mapQuoteDelivery } from './quote-delivery.mapper';

const id = '11111111-1111-1111-1111-111111111111';
const at = '2026-11-01T12:00:00Z';
const row = {
  deliveryId: id,
  quoteId: id,
  versionId: id,
  artifactId: id,
  emailTemplateVersionId: id,
  recipientAddress: 'sandbox@example.test',
  status: 'unknown',
  attempt: 1,
  createdAt: at,
  updatedAt: at,
};
const resolution = {
  outcome: 'sent',
  actorId: 18,
  attempt: 1,
  evidenceNote: 'Перевірено точний лист',
  createdAt: at,
};
describe('manual delivery provenance boundary', () => {
  it('accepts historical rows without exposing manual controls', () => {
    expect(mapQuoteDelivery(row)).toMatchObject({
      canResolveManually: false,
      manualResolution: null,
    });
  });
  it('maps explicit server eligibility and immutable manual evidence', () => {
    expect(mapQuoteDelivery({ ...row, canResolveManually: true }).canResolveManually).toBe(true);
    expect(
      mapQuoteDelivery({
        ...row,
        status: 'succeeded',
        confirmedAt: at,
        errorCode: 'delivery_manually_confirmed_sent',
        manualResolution: resolution,
      }).manualResolution,
    ).toEqual(resolution);
  });
  it.each([
    { canResolveManually: 'true' },
    { status: 'queued', canResolveManually: true },
    { status: 'succeeded', confirmedAt: at, canResolveManually: true },
    { errorCode: 'delivery_manually_confirmed_sent' },
    { manualResolution: resolution },
    { status: 'succeeded', confirmedAt: at, manualResolution: { ...resolution, actorId: 0 } },
    { status: 'succeeded', confirmedAt: at, manualResolution: { ...resolution, attempt: 2 } },
    { status: 'succeeded', confirmedAt: at, manualResolution: { ...resolution, evidenceNote: '' } },
    { status: 'failed', manualResolution: resolution },
  ])('rejects inconsistent or fabricated evidence %j', (changes) => {
    expect(() => mapQuoteDelivery({ ...row, ...changes })).toThrow();
  });
});
