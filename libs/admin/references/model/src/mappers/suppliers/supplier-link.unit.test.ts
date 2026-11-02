import { describe, expect, it } from 'vitest';

import { supplierLinkHref } from './supplier-link';

describe('supplierLinkHref', () => {
  it.each([
    [' supplier.example/path ', 'https://supplier.example/path'],
    ['https://supplier.example', 'https://supplier.example/'],
    ['http://supplier.example', 'http://supplier.example/'],
  ])('opens HTTP(S) or a domain: %s', (value, expected) => {
    expect(supplierLinkHref(value)).toBe(expected);
  });

  it.each([
    null,
    '',
    ' ',
    'javascript:alert(1)',
    'data:text/html,hello',
    'mailto:a@example.com',
    'https://',
    'not a domain',
  ])('does not activate unsupported or invalid addresses: %s', (value) => {
    expect(supplierLinkHref(value)).toBeNull();
  });
});
