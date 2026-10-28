import { describe, expect, it } from 'vitest';

import { customerErrors, contactErrors } from './customer-validation';
import { customerDraft, contactDraft } from '../mappers/customer-drafts';

describe('client forms', () => {
  it('requires a client name without forcing a legal identity on a person', () => {
    expect(
      customerErrors({ ...customerDraft(), kind: 'person', displayName: 'Synthetic person' }),
    ).toEqual({});
    expect(customerErrors(customerDraft())['displayName']).toBeTruthy();
  });
  it('accepts an international phone and rejects an invalid channel', () => {
    expect(
      contactErrors({
        ...contactDraft(),
        name: 'Synthetic',
        channels: [{ kind: 'phone', value: '+44 (20) 1234-5678' }],
      }),
    ).toEqual({});
    expect(
      contactErrors({
        ...contactDraft(),
        name: 'Synthetic',
        channels: [{ kind: 'email', value: 'invalid' }],
      })['channel.0'],
    ).toBeTruthy();
  });
});
