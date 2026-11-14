import { describe, expect, it } from 'vitest';

import { telHref } from './supplier-contact-row';

describe('telHref', () => {
  it('keeps only digits and the plus of a typed phone', () => {
    expect(telHref('+38 (050) 469-86-75')).toBe('tel:+380504698675');
  });

  it('gives no link for a phone without digits', () => {
    expect(telHref('немає')).toBeNull();
  });
});
