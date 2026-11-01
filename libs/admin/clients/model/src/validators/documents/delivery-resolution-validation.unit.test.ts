import { describe, expect, it } from 'vitest';

import { deliveryResolutionErrors } from './delivery-resolution-validation';

describe('manual delivery evidence', () => {
  it('requires a definite decision and a nonempty bounded note', () => {
    expect(deliveryResolutionErrors({ outcome: '', evidenceNote: ' ' })).toEqual({
      outcome: expect.any(String),
      evidenceNote: expect.any(String),
    });
    expect(
      deliveryResolutionErrors({ outcome: 'sent', evidenceNote: 'x'.repeat(1001) }).evidenceNote,
    ).toBeTruthy();
  });
  it('accepts multiline evidence and rejects hidden controls', () => {
    expect(
      deliveryResolutionErrors({
        outcome: 'not_sent',
        evidenceNote: 'Перевірено\nПовідомлення відхилено',
      }),
    ).toEqual({});
    expect(
      deliveryResolutionErrors({ outcome: 'sent', evidenceNote: 'Checked\0hidden' }).evidenceNote,
    ).toBeTruthy();
  });
});
