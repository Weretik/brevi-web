import { describe, expect, it } from 'vitest';

import { mapCustomFile, mapCustomFiles } from './custom-file.mapper';

const draftId = '11111111-1111-4111-8111-111111111111';
const dto = () => ({
  publicId: '22222222-2222-4222-8222-222222222222',
  draftId,
  contentType: 'image/png',
  length: 20,
  sha256: 'A'.repeat(64),
  state: 'Uploaded',
  expiresAt: '2026-10-29T12:00:00Z',
  showInQuote: false,
  production: true,
  isFinalized: true,
});

describe('private file runtime boundary', () => {
  it('keeps independent flags and server file identity', () => {
    expect(mapCustomFiles([dto()], draftId)[0]).toMatchObject({
      id: dto().publicId,
      showInQuote: false,
      production: true,
    });
  });
  it('rejects metadata from a different root', () => {
    expect(() =>
      mapCustomFiles([{ ...dto(), draftId: '33333333-3333-4333-8333-333333333333' }], draftId),
    ).toThrow();
  });
  it('rejects duplicate or unfinalized selections', () => {
    expect(() => mapCustomFiles([dto(), dto()], draftId)).toThrow();
    expect(() => mapCustomFiles([{ ...dto(), isFinalized: false }], draftId)).toThrow();
  });
  it.each([
    { length: 20971521 },
    { sha256: 'bad' },
    { contentType: 'text/html' },
    { state: 'Ready' },
    { publicId: 'blob:local' },
  ])('rejects malformed metadata %j', (change) => {
    expect(() => mapCustomFile({ ...dto(), ...change })).toThrow();
  });
});
