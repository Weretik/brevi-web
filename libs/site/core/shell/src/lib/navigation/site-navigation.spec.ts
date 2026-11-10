import { CATALOG_SECTIONS } from '@site/catalog/model';

import {
  FOOTER_BUYER_LINKS,
  FOOTER_COMPANY_LINKS,
  MAIN_NAV_LINKS,
  SHELL_PATHS,
} from './site-navigation';
import { getShellDictionary } from '../i18n/shell-dictionary';

describe('site navigation', () => {
  it('keeps the header menu in the order of the mockup', () => {
    const { links } = getShellDictionary('uk');

    expect(MAIN_NAV_LINKS.map((link) => links[link.key])).toEqual([
      'Пошиття з логотипом',
      'Ціни для опту',
      'Галузі',
      'Про виробництво',
      'Наші роботи',
      'Контакти',
    ]);
  });

  it('reaches every storefront page from the header or the footer', () => {
    const linked = new Set(
      [...MAIN_NAV_LINKS, ...FOOTER_COMPANY_LINKS, ...FOOTER_BUYER_LINKS].map((link) => link.path),
    );
    const { request, catalog, ...pages } = SHELL_PATHS;

    expect(request).toBe('/request');
    expect(catalog).toBe('/catalog');
    expect([...linked].sort()).toEqual(Object.values(pages).sort());
  });

  it('uses paths without a locale or a trailing slash', () => {
    for (const path of Object.values(SHELL_PATHS)) {
      expect(path).toMatch(/^\/[a-z-]+$/);
    }
  });

  it('names every catalog section and item in both languages', () => {
    expect(CATALOG_SECTIONS.length).toBeGreaterThan(0);
    for (const section of CATALOG_SECTIONS) {
      for (const entry of [section, ...section.items]) {
        expect(entry.label.uk).toBeTruthy();
        expect(entry.label.ru).toBeTruthy();
      }
    }
  });
});
