import { describe, expect, it } from 'vitest';

import { redirectPath, validateRedirect } from './redirect-validation';

describe('redirectPath', () => {
  it('compares a full link as a lower-case path', () => {
    expect(redirectPath('https://brevi.com.ua/Kostyum//Lider/?utm=1')).toBe('/kostyum/lider');
    expect(redirectPath('/')).toBeNull();
  });
});

describe('validateRedirect', () => {
  it('accepts an old address and a page of the new site', () => {
    expect(validateRedirect({ fromPath: '/a', toPath: '/uk/catalog/b', note: '' })).toEqual({});
  });

  it('refuses a target outside /uk and /ru and the same address twice', () => {
    expect(
      validateRedirect({ fromPath: '/a', toPath: '/catalog/b', note: '' }).toPath,
    ).toBeDefined();
    expect(validateRedirect({ fromPath: '/uk/a', toPath: '/UK/a/', note: '' }).toPath).toBe(
      'Стара і нова адреси однакові.',
    );
    expect(validateRedirect({ fromPath: ' ', toPath: '/uk', note: '' }).fromPath).toBeDefined();
  });
});
