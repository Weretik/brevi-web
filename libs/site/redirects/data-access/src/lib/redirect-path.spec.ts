import { describe, expect, it } from 'vitest';

import { findRedirect, redirectPath } from './redirect-path';
import { mapRedirects } from './redirects-loader';

describe('redirectPath', () => {
  it('matches the way the Admin keeps old addresses', () => {
    expect(redirectPath('/Specodyag-Litnij/?utm=1')).toBe('/specodyag-litnij');
    expect(redirectPath('/ru/%D0%BA%D0%BE%D1%81%D1%82%D1%8E%D0%BC//')).toBe('/ru/костюм');
    expect(redirectPath('/')).toBeNull();
    expect(redirectPath('/%E0%A4%A')).toBeNull();
  });
});

describe('findRedirect', () => {
  const redirects = new Map(
    mapRedirects({
      items: [
        { from: '/kostyum-lider', to: '/uk/product/kostyum-lider' },
        { from: '/ru/kostyum-lider', to: '/ru/product/kostyum-lider' },
        { from: '/bad', to: 'https://elsewhere.test/' },
      ],
    }),
  );

  it('finds the new page of an old address', () => {
    expect(findRedirect(redirects, '/Kostyum-Lider/')).toBe('/uk/product/kostyum-lider');
    expect(findRedirect(redirects, '/ru/kostyum-lider')).toBe('/ru/product/kostyum-lider');
  });

  it('never leads off the site and knows nothing else', () => {
    expect(findRedirect(redirects, '/bad')).toBeNull();
    expect(findRedirect(redirects, '/nothing')).toBeNull();
  });

  it('refuses an answer of another shape', () => {
    expect(() => mapRedirects({ items: [{ from: 1 }] })).toThrow();
    expect(() => mapRedirects(null)).toThrow();
  });
});
